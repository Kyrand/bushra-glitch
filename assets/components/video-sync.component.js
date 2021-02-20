// Put this on the a-video tag in the template
// This will run for everybody in the room
// import video from "../videos/saddywaddy.mp4"

AFRAME.registerComponent('video-sync', {
  schema: {
    paused: {default: true},
    currentTime: {default: 0},
    timeSlop: {default: 0.5},
    // src: {default: "./assets/videos/saddywaddy.mp4"}
    src: {default: ""}
  },

  init: function () {

    console.log('Synced video loaded');

    var networked = this.networkedEl;
    if (!networked || networked.components.networked.data.owner === NAF.clientId) {
      setInterval(this.videoTick.bind(this), 1);
    }
  },

  videoTick: function () {
    var video = document.querySelector('#html-video');
    this.el.setAttribute('video-sync', 'currentTime', video.currentTime);
  },

  update: function(oldData) {
    // Change the HTML video tag's new state
    var video = document.querySelector('#html-video');
    if(this.data.src === "") {
      this.data.src = video.src
    }

    if (this.data.paused && !video.paused) {
      console.log('video paused at ', this.data.currentTime)
      video.pause();
    } else if (!this.data.paused && video.paused) {
      console.log('video played at ', this.data.currentTime)
      video.play();
      video.currentTime = this.data.currentTime;
    }

    if (video.src !== this.data.src) {
      console.log('video src set to', this.data.src);
      video.src = this.data.src;
    }
  }
});
