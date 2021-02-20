/* global AFRAME, THREE */
// import afu from "../aframe-utils"
// import store from "./store"
import io from 'socket.io-client'
const SOCKET_SERVER_URL = "http://localhost:8080"
// socket.io
let socket;
//let id;

// array of connected clients
let clients = {};
let entities = {}
let heads = {}
// Variable to store our three.js scene:

// WebRTC Variables:
const { RTCPeerConnection, RTCSessionDescription } = window;
let iceServerList;

// set video width / height / framerate here:
const videoWidth = 160;
const videoHeight = 120;
const videoFrameRate = 15;

// Our local media stream (i.e. webcam and microphone stream)
let localMediaStream = null;

// Constraints for our local audio/video stream
let mediaConstraints = {
	audio: true,
	video: {
		width: videoWidth,
		height: videoHeight,
		frameRate: videoFrameRate
	}
}


AFRAME.registerComponent("webrtc", {

  schema: {
    key: {type: "string"},
    video: {default: true}
  },

  init() {
    console.log("Creating webrtc: " + this.data.key)
    // first get user media
    // localMediaStream = await getMedia(mediaConstraints)

    document.body.addEventListener('connected', (evt) => {
      console.log("NAF client connected: " + evt.detail.clientId, evt.detail)
      this.clientId = evt.detail.clientId
      this.initAsync()
    })

    document.body.addEventListener('entityCreated', function (evt) {
      console.error('[webrtc] entityCreated event', evt);

      let el = evt.detail.el
      if(el.className === "heads") {
        let id = el.firstUpdateData.owner
        console.log("Registering entity " + id)
        entities[id] = {'el': el, 'initialized': false}
        if(id in clients) {
          entities[id].initialized = true
          addClientGL(id, el, this.data.video)
        }
        //addClient(id, el)
        //callUser(id)
      }
    })
    // // then initialize socket connection
    // initSocketConnection()
  },

  update(oldData) {
    if (Object.keys(oldData).length === 0) { return }
    afu.log("Updated webrtc: " + this.data)
    //if(oldData.key !== this.data.key) {}
  },

  tick(time, delta) {
    // console.log('tick')
    if(this.data.video) {
      this.updateVideoTextures()
    }
  },

	updateVideoTextures() {
		// update ourselves first:
		// let localVideo = document.getElementById("local_video");
		// let localVideoCanvas = document.getElementById("local_canvas");
		// this.redrawVideoCanvas(localVideo, localVideoCanvas, this.playerVideoTexture)

    let availableClients = Object.entries(entities)
        .filter(e => e[1].initialized)
        .map(e => e[0])

		availableClients.forEach(_id => {
			let remoteVideo = document.getElementById(_id);
			let remoteVideoCanvas = document.getElementById(_id + "_canvas");
			// this.redrawVideoCanvas(remoteVideo, remoteVideoCanvas, clients[_id].texture);
      let texture = entities[_id].el.getElementsByClassName("head")[0]._texture
			this.redrawVideoCanvas(remoteVideo, remoteVideoCanvas, texture);
		})
	},

	// this function redraws on a 2D <canvas> from a <video> and indicates to three.js
	// that the _videoTex should be updated
	redrawVideoCanvas(_videoEl, _canvasEl, _videoTex) {
		let _canvasDrawingContext = _canvasEl.getContext('2d');

		// check that we have enough data on the video element to redraw the canvas
		if (_videoEl.readyState === _videoEl.HAVE_ENOUGH_DATA) {
			// if so, redraw the canvas from the video element
			_canvasDrawingContext.drawImage(_videoEl, 0, 0, _canvasEl.width, _canvasEl.height);
			// and indicate to three.js that the texture needs to be redrawn from the canvas
			_videoTex.needsUpdate = true;
		}
	},

  async initAsync() {
    // window.onload = async () => {
	  console.log("Window loaded.");

	  // first get user media
	  localMediaStream = await getMedia(mediaConstraints);

	  // then initialize socket connection
	  this.initSocketConnection();

	  // finally create the threejs scene
	  //createScene();

  },


// establishes socket connection
  initSocketConnection() {
    console.log("Initializing WebRTC socket.io...");
    //socket = io().connect(SOCKET_SERVER_URL);
    //let socket = io();
    socket = this.socket = NAF.connection.adapter.socket
    console.log(socket)
    // let namespace = null;
    // let ns = io.of(namespace || "/");
    // let socket = this.socket = ns.connected[this.clientId]
    socket.emit("ice-me", {room: NAF.room})

    socket.on('connect', () => { console.log("WebRTC connection for " + this.clientId) });

    //On connection server sends the client his ID and a list of all keys
    socket.on('introduction', params  => {
      let [_id, _clientNum, _ids, _iceServers] = params
      // keep local copy of ice servers:
      console.log("Received ICE server credentials from server.");
      iceServerList = _iceServers;

      // keep a local copy of my ID:
      console.log('My socket ID is: ' + _id, 'Client keys: ' + _ids);
      this.socketid = _id;

      //for each existing user, add them as a client and add tracks to their peer connection
      for (let i = 0; i < _ids.length; i++) {
        if (_ids[i] !== this.socketid) {
          addClient(_ids[i], this.data.video)
          callUser(_ids[i])
        }
      }


    })

    // when a new user has entered the server
    socket.on('newUserConnected', params => {
      let [clientCount, _id, _ids] = params
      console.log(_id + " connected, ", clientCount + ' clients connected', 'all connected ids: ' + _ids);

      let alreadyHasUser = false;
      for (let i = 0; i < Object.keys(clients).length; i++) {
        if (Object.keys(clients)[i] == _id) {
          alreadyHasUser = true;
          break;
        }
      }

      if (_id !== this.socketid && !alreadyHasUser) {
        console.log('A new user connected with the id: ' + _id);
        addClient(_id, this.data.video);
      }

    });

    socket.on('userDisconnected', params => {
      // Update the data from the server
      [clientCount, _id, _ids] = params

      if (_id != this.socketid) {
        console.log('A user disconnected with the id: ' + _id);
        removeClientGL(_id);
        delete clients[_id];
      }
    });

    socket.on("call-made", async data => {
      console.log("Receiving call from user " + data.socket);
      // if entity is not registered yet, bail
      if(!clients[data.socket]) {
        return
      }

      // set remote session description to incoming offer
      await clients[data.socket].peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      // create answer and set local session description to that answer
      const answer = await clients[data.socket].peerConnection.createAnswer();
      await clients[data.socket].peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      // send answer out to caller
      socket.emit("make-answer", {
        answer,
        to: data.socket
      });

    });

    socket.on("answer-made", async data => {

      console.log("Answer made by " + data.socket);

      // set the remote description to be the incoming answer
      await clients[data.socket].peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      // what is this for?
      if (!clients[data.socket].isAlreadyCalling) {
        callUser(data.socket);
        clients[data.socket].isAlreadyCalling = true;
      }
    });

    socket.on("call-rejected", data => {
      alert(`User: "Socket: ${data.socket}" rejected your call.`);
	  });

	  socket.on('iceCandidateFound', data => {
      console.log("iceCandidateFound: ", data, clients)
		  clients[data.socket].peerConnection.addIceCandidate(data.candidate);
	  });
  }
})

/*
*
* This uses code from a THREE.js Multiplayer boilerplate made by Or Fleisher:
* https://github.com/juniorxsound/THREE.Multiplayer
* And a WEBRTC chat app made by Mikołaj Wargowski:
* https://github.com/Miczeq22/simple-chat-app
*
* Aidan Nelson, April 2020
*
*/


////////////////////////////////////////////////////////////////////////////////
// Start-Up Sequence:
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Local media stream setup
////////////////////////////////////////////////////////////////////////////////

// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
async function getMedia(_mediaConstraints) {
	let stream = null;

	try {
		stream = await navigator.mediaDevices.getUserMedia(_mediaConstraints);
	} catch (err) {
		console.log("Failed to get user media!");
		console.warn(err);
	}

	return stream;
}

function addTracksToPeerConnection(_stream, _pc) {
	if (_stream == null) {
		console.log("Local User media stream not yet established!");
	} else {
		_stream.getTracks().forEach(track => {
			_pc.addTrack(track, _stream)
		});
	}
}

////////////////////////////////////////////////////////////////////////////////
// Socket.io
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// Clients / WebRTC
////////////////////////////////////////////////////////////////////////////////

// Adds client object with THREE.js object, DOM video object and and an RTC peer connection for each :
function addClient(_id, video=true) {
	console.log("Adding client with id " + _id);
	clients[_id] = {};

	// add peerConnection to the client
	let pc = createPeerConnection(_id, video);
	clients[_id].peerConnection = pc;

	// boolean for establishing WebRTC connection
	clients[_id].isAlreadyCalling = false;

	// add client to scene:
	//addClientGL(_id, el);
  if(_id in entities) {
    entities[_id].initialized = true
    addClientGL(_id, entities[_id].el, video)
  }
}


// this function sets up a peer connection and corresponding DOM elements for a specific client
function createPeerConnection(_id, video=true) {
	// create a peer connection for  client:
	let peerConnectionConfiguration;
	// if (false) {
	peerConnectionConfiguration = { iceServers: iceServerList };
	// } else {
	// peerConnectionConfiguration = {}; // this should work locally
	// }


	let pc = new RTCPeerConnection(peerConnectionConfiguration);

	// add ontrack listener for peer connection
	pc.ontrack = function ({ streams: [_remoteStream] }) {
		console.log("OnTrack: track added to RTC Peer Connection.");
		console.log(_remoteStream);
		// Split incoming stream into two streams: audio for THREE.PositionalAudio and
		// video for <video> element --> <canvas> --> videoTexture --> videoMaterial for THREE.js
		// https://stackoverflow.com/questions/50984531/threejs-positional-audio-with-webrtc-streams-produces-no-sound

		let audioStream = new MediaStream([_remoteStream.getAudioTracks()[0]]);

		//////////////////////////////////////////////////////////////////////
		// UNCOMMENT ONE OF THE FOLLOWING APPROACHES FOR INCOMING AUDIO
		//////////////////////////////////////////////////////////////////////
		// 1. Positional Audio
		// Working in Firefox 75.0
		// Not working in Chrome: https://bugs.chromium.org/p/chromium/issues/detail?id=933677
		// let audioSource = new THREE.PositionalAudio(glScene.listener);
		// audioSource.setMediaStreamSource(audioStream);
		// audioSource.setRefDistance(10);
		// audioSource.setRolloffFactor(10);
		// clients[_id].group.add(audioSource);

		// 2. Global Audio: Using DOM <audio> element
		// Works in Firefox and Chrome
		let audioEl = document.getElementById(_id+"_audio");
		if (!audioEl){
			audioEl = document.createElement('audio');
			audioEl.setAttribute("id",_id+"_audio");
			audioEl.style = "visibility: hidden;";
			audioEl.controls = 'controls';
			audioEl.volume = 1;
			document.body.appendChild(audioEl);
		}
		audioEl.srcObject = audioStream;
		audioEl.play();

    if(video) {
      let videoStream = new MediaStream([_remoteStream.getVideoTracks()[0]]);
      const remoteVideoElement = document.getElementById(_id);
      if (remoteVideoElement) {
        remoteVideoElement.srcObject = videoStream;
      } else {
        console.warn("No video element found for ID: " + _id);
      }
    }

	};

	// https://www.twilio.com/docs/stun-turn
	// Here's an example in javascript
	pc.onicecandidate = function (evt) {
		if (evt.candidate) {
			console.log('OnICECandidate: Forwarding ICE candidate to peer: ' + _id);
			// send the candidate to the other party via your signaling channel
			socket.emit('addIceCandidate', {
				candidate: evt.candidate,
				to: _id
			});
		}
	};

	addTracksToPeerConnection(localMediaStream, pc);

	return pc;
}


async function callUser(id) {
	if (clients.hasOwnProperty(id)) {
		console.log('Calling user ' + id);

		// https://blog.carbonfive.com/2014/10/16/webrtc-made-simple/
		// create offer with session description
		const offer = await clients[id].peerConnection.createOffer();
		await clients[id].peerConnection.setLocalDescription(new RTCSessionDescription(offer));

		socket.emit("call-user", {
			offer,
			to: id
		});
	}
}

// temporarily pause the outgoing stream
function disableOutgoingStream() {
	localMediaStream.getTracks().forEach(track => {
		track.enabled = false;
	})
}
// enable the outgoing stream
function enableOutgoingStream() {
	localMediaStream.getTracks().forEach(track => {
		track.enabled = true;
	})
}


////////////////////////////////////////////////////////////////////////////////
// Three.js
////////////////////////////////////////////////////////////////////////////////

function onPlayerMove() {
	// console.log('Sending movement update to server.');
	socket.emit('move', glScene.getPlayerPosition());
}

function createScene() {
	// initialize three.js scene
	console.log("Creating three.js scene...")
	glScene = new Scene(
		domElement = document.getElementById('gl_context'),
		_width = window.innerWidth,
		_height = window.innerHeight,
		clearColor = 'lightblue',
		onPlayerMove);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// THREEJS FUNCTIONS
// add a client meshes, a video element and  canvas for three.js video texture
function addClientGL(_id, el, video) {
  if(!video) { return }

  console.log(`Adding socket ${_id} to element: `, el)
  createClientVideoElement(_id);

  let [videoTexture, videoMaterial, canvasEl] = makeVideoTextureAndMaterial(_id);

  let head = el.getElementsByClassName("head")[0]
  //head.setAttribute('material', 'src', canvasEl)
  let box = head.getObject3D("mesh")
  box.material = videoMaterial
  head._texture = videoTexture
}

function removeClientGL(_id) {

	removeClientVideoElementAndCanvas(_id)

}




//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Utilities 🚂

// created <video> element for local mediastream
function createLocalVideoElement() {
	const videoElement = document.createElement("video");
	videoElement.id = "local_video";
	videoElement.autoplay = true;
	videoElement.width = videoWidth;
	videoElement.height = videoHeight;
	videoElement.style = "visibility: hidden;";

	// there seems to be a weird behavior where a muted video
	// won't autoplay in chrome...  so instead of muting the video, simply make a
	// video only stream for this video element :|
	let videoStream = new MediaStream([localMediaStream.getVideoTracks()[0]]);

	videoElement.srcObject = videoStream;
	document.body.appendChild(videoElement);
}

// created <video> element using client ID
function createClientVideoElement(_id) {
	console.log("Creating <video> element for client with id: " + _id);

	const videoElement = document.createElement("video");
	videoElement.id = _id;
	videoElement.width = videoWidth;
	videoElement.height = videoHeight;
	videoElement.autoplay = true;
	// videoElement.muted = true; // TODO Positional Audio
	videoElement.style = "visibility: hidden;";

	document.body.appendChild(videoElement);
}

// remove <video> element and corresponding <canvas> using client ID
function removeClientVideoElementAndCanvas(_id) {
	console.log("Removing <video> element for client with id: " + _id);

	let videoEl = document.getElementById(_id).remove();
	if (videoEl != null) { videoEl.remove(); }
	let canvasEl = document.getElementById(_id + "_canvas");
	if (canvasEl != null) { canvasEl.remove(); }
}

// Adapted from: https://github.com/zacharystenger/three-js-video-chat
function makeVideoTextureAndMaterial(_id) {
	// create a canvas and add it to the body
	let rvideoImageCanvas = document.createElement('canvas');
	document.body.appendChild(rvideoImageCanvas);

	rvideoImageCanvas.id = _id + "_canvas";
	rvideoImageCanvas.width = videoWidth;
	rvideoImageCanvas.height = videoHeight;
	rvideoImageCanvas.style = "visibility: hidden;";

	// get canvas drawing context
	let rvideoImageContext = rvideoImageCanvas.getContext('2d');

	// background color if no video present
	rvideoImageContext.fillStyle = '#000000';
	rvideoImageContext.fillRect(0, 0, rvideoImageCanvas.width, rvideoImageCanvas.height);

	// make texture
	let videoTexture = new THREE.Texture(rvideoImageCanvas);
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;

	// make material from texture
	var movieMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, overdraw: true, side: THREE.DoubleSide });

	return [videoTexture, movieMaterial, rvideoImageCanvas];
}
