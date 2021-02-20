/* global THREE */
//var registerComponent = require('../core/component').registerComponent;

// Found at https://github.com/aframevr/assets.
var MODEL_URLS = {
  toonLeft: 'https://cdn.aframe.io/controllers/hands/leftHand.glb',
  toonRight: 'https://cdn.aframe.io/controllers/hands/rightHand.glb',
  lowPolyLeft: 'https://cdn.aframe.io/controllers/hands/leftHandLow.glb',
  lowPolyRight: 'https://cdn.aframe.io/controllers/hands/rightHandLow.glb',
  highPolyLeft: 'https://cdn.aframe.io/controllers/hands/leftHandHigh.glb',
  highPolyRight: 'https://cdn.aframe.io/controllers/hands/rightHandHigh.glb'
};

// Poses.
var ANIMATIONS = {
  open: 'Open',
  // point: grip active, trackpad surface active, trigger inactive.
  point: 'Point',
  // pointThumb: grip active, trigger inactive, trackpad surface inactive.
  pointThumb: 'Point + Thumb',
  // fist: grip active, trigger active, trackpad surface active.
  fist: 'Fist',
  // hold: trigger active, grip inactive.
  hold: 'Hold',
  // thumbUp: grip active, trigger active, trackpad surface inactive.
  thumbUp: 'Thumb Up'
};

// Map animation to public events for the API.
var EVENTS = {};
EVENTS[ANIMATIONS.fist] = 'grip';
EVENTS[ANIMATIONS.thumbUp] = 'pistol';
EVENTS[ANIMATIONS.point] = 'pointing';

AFRAME.registerComponent("hand-animator", {

  schema: {
    color: {default: 'white', type: 'color'},
    hand: { default: 'left' },
    lastGesture: {default: 'Open'},
    gesture: {default: 'Open'},
    gestureComplex: {default: 'xxx'},
    flipper: {default: false, type: 'boolean'},
    handModelStyle: {default: 'lowPoly', oneOf: ['lowPoly', 'highPoly', 'toon']},
  },

  init() {
    console.log("Creating hand-animator: ", this.data)

    this.loader = new THREE.GLTFLoader();
    this.loader.setCrossOrigin('anonymous');

  },

  update: function (previousData) {
    // var controlConfiguration;
    var el = this.el;
    var hand = this.data.hand;
    var handModelStyle = this.data.handModelStyle;
    var handColor = this.data.color;
    var self = this;
    // var event = this.data.event
    // Get common configuration to abstract different vendor controls.
    // controlConfiguration = {
    //   hand: hand,
    //   model: false
    // };
    // console.log("Event change: ", event)
    console.log("Hand-animator - updating gesture from " + this.data.gesture + " to " + this.data.lastGesture)
    if(this.isAvatar()) {
      [gesture, lastGesture] = this.data.gestureComplex.split('__').map(d => {
        if(d === 'undefined') {return undefined}
        return d
      })

      this.animateGesture(gesture, lastGesture)
    }
    // Set model.
    if (hand !== previousData.hand) {
      var handmodelUrl = MODEL_URLS[handModelStyle + hand.charAt(0).toUpperCase() + hand.slice(1)];
      this.loader.load(handmodelUrl, function (gltf) {
        var mesh = gltf.scene.children[0];
        var handModelOrientation = hand === 'left' ? Math.PI / 2 : -Math.PI / 2;
        mesh.mixer = new THREE.AnimationMixer(mesh);
        self.clips = gltf.animations;
        el.setObject3D('mesh', mesh);

        var handMaterial = mesh.children[1].material;
        handMaterial.color = new THREE.Color(handColor);
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(0, 0, handModelOrientation);
        // el.setAttribute('magicleap-controls', controlConfiguration);
        // el.setAttribute('vive-controls', controlConfiguration);
        // el.setAttribute('oculus-touch-controls', controlConfiguration);
        // el.setAttribute('windows-motion-controls', controlConfiguration);
      });
    }
  },

  tick: function (time, delta) {
    var mesh = this.el.getObject3D('mesh');

    if (!mesh || !mesh.mixer) { return; }

    mesh.mixer.update(delta / 1000);
  },

  /**
   * Play corresponding clip to a gesture
   */
  getClip: function (gesture) {
    var clip;
    var i;
    for (i = 0; i < this.clips.length; i++) {
      clip = this.clips[i];
      if (clip.name !== gesture) { continue; }
      return clip;
    }
  },

  /**
   * Play gesture animation.
   *
   * @param {string} gesture - Which pose to animate to. If absent, then animate to open.
   * @param {string} lastGesture - Previous gesture, to reverse back to open if needed.
   */
  animateGesture: function (gesture, lastGesture) {
    if (gesture) {
      this.playAnimation(gesture || ANIMATIONS.open, lastGesture, false);
      return;
    }

    // If no gesture, then reverse the current gesture back to open pose.
    this.playAnimation(lastGesture, lastGesture, true);
  },

  /**
  * Play hand animation based on button state.
  *
  * @param {string} gesture - Name of the animation as specified by the model.
  * @param {string} lastGesture - Previous pose.
  * @param {boolean} reverse - Whether animation should play in reverse.
  */
  playAnimation: function (gesture, lastGesture, reverse) {
    var clip;
    var fromAction;
    var mesh = this.el.getObject3D('mesh');
    var toAction;

    if (!mesh) { return; }

    // Stop all current animations.
    mesh.mixer.stopAllAction();

    // Grab clip action.
    clip = this.getClip(gesture);
    toAction = mesh.mixer.clipAction(clip);
    toAction.clampWhenFinished = true;
    toAction.loop = THREE.LoopRepeat;
    toAction.repetitions = 0;
    toAction.timeScale = reverse ? -1 : 1;
    toAction.time = reverse ? clip.duration : 0;
    toAction.weight = 1;

    //console.log("Playing animation, from " + lastGesture + " to " + gesture)
    //this.el.setAttribute("hand-animator", {gesture: gesture, lastGesture: lastGesture, gestureComplex: gesture + '_' + lastGesture})
    // No gesture to gesture or gesture to no gesture.
    let flipper = this.el.getAttribute("hand-animator")['flipper']
    console.log("(animator) Playing animation, from " + lastGesture + " to " + gesture + ", flipper: ", + flipper)
    console.log("Gesture complex: ", this.data.gestureComplex)
    console.log("Reverse: ", reverse)
    if (!lastGesture || gesture === lastGesture) {
      // Stop all current animations.
      mesh.mixer.stopAllAction();
      // Play animation.
      toAction.play();
      return;
    }

    // Animate or crossfade from gesture to gesture.
    clip = this.getClip(lastGesture);
    fromAction = mesh.mixer.clipAction(clip);
    fromAction.weight = 0.15;
    fromAction.play();
    toAction.play();
    fromAction.crossFadeTo(toAction, 0.15, true);
  },

  isAvatar: function() {
    return this.el.getAttribute('hand-controls-kgd') === null
  }
})
