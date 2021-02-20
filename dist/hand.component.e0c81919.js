// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"3c2b2bd89d79cc2017201e952bb90868":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "e0c81919c2cefa89a49eb4771705ba3c";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets; // eslint-disable-next-line no-redeclare

var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
  var port = HMR_PORT || location.port;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH); // Handle HMR Update

      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || hmrAcceptCheck(global.parcelRequire, asset.id);

        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];

          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      } // Render the fancy html overlay


      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };

  ws.onerror = function (e) {
    console.error(e.message);
  };

  ws.onclose = function (e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };

  newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now());
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      var absolute = /^https?:\/\//i.test(links[i].getAttribute('href'));

      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(global.parcelRequire, id);
      });

      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }

  acceptedAssets[id] = true;
}
},{}],"674fc0a4645b3f33997603d3b9de4156":[function(require,module,exports) {
require('./bundle-manifest').register(JSON.parse("{\"a49eb4771705ba3c\":\"hand.component.e0c81919.js\",\"a2db84f8cbff5f22\":\"leftHand.82ebe8c6.glb\",\"227862007a90f212\":\"rightHand.65894084.glb\"}"));
},{"./bundle-manifest":"ba8df6b71e73837c465d69bebde6e64d"}],"ba8df6b71e73837c465d69bebde6e64d":[function(require,module,exports) {
"use strict";

var mapping = {};

function register(pairs) {
  var keys = Object.keys(pairs);

  for (var i = 0; i < keys.length; i++) {
    mapping[keys[i]] = pairs[keys[i]];
  }
}

function resolve(id) {
  var resolved = mapping[id];

  if (resolved == null) {
    throw new Error('Could not resolve bundle with id ' + id);
  }

  return resolved;
}

module.exports.register = register;
module.exports.resolve = resolve;
},{}],"7ee1380f531dd978f34d6b49ae662ed8":[function(require,module,exports) {
"use strict";

var _leftHand = _interopRequireDefault(require("url:../models/leftHand.glb"));

var _rightHand = _interopRequireDefault(require("url:../models/rightHand.glb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This file is largely from A-Frame (https://github.com/aframevr/aframe)
// Copyright © 2015-2017 A-Frame authors.
// Licensed MIT, see https://github.com/aframevr/aframe/blob/master/LICENSE
var MODEL_URLS = {
  // left: "assets/leftHand.glb",
  // right: "assets/rightHand.glb"
  left: _leftHand.default,
  right: _rightHand.default
}; // Poses.

var ANIMATIONS = {
  open: "Open",
  // point: grip active, trackpad surface active, trigger inactive.
  point: "Grip",
  // pointThumb: grip active, trigger inactive, trackpad surface inactive.
  pointThumb: "Point+Thumb",
  // fist: grip active, trigger active, trackpad surface active.
  fist: "Grip",
  // hold: trigger active, grip inactive.
  hold: "Web",
  // thumbUp: grip active, trigger active, trackpad surface inactive.
  thumbUp: "Grip"
}; // Map animation to public events for the API.

var EVENTS = {};
EVENTS[ANIMATIONS.fist] = "grip";
EVENTS[ANIMATIONS.thumbUp] = "pistol";
EVENTS[ANIMATIONS.point] = "pointing";
/**
 * Hand controls component that abstracts 6DoF controls:
 *   oculus-touch-controls, vive-controls, windows-motion-controls.
 *
 * Originally meant to be a sample implementation of applications-specific controls that
 * abstracts multiple types of controllers.
 *
 * Auto-detect appropriate controller.
 * Handle common events coming from the detected vendor-specific controls.
 * Translate button events to semantic hand-related event names:
 *   (gripclose, gripopen, thumbup, thumbdown, pointup, pointdown)
 * Load hand model with gestures that are applied based on the button pressed.
 *
 * @property {string} Hand mapping (`left`, `right`).
 */

AFRAME.registerComponent("hand", {
  schema: {
    default: "left"
  },
  init: function () {
    var self = this;
    var el = this.el; // Current pose.

    this.gesture = ANIMATIONS.open; // Active buttons populated by events provided by the attached controls.

    this.pressedButtons = {};
    this.touchedButtons = {};
    this.loader = new THREE.GLTFLoader();
    this.loader.setCrossOrigin("anonymous");

    this.onGripDown = function (evt) {
      self.handleButton("grip", "down", evt.detail);
    };

    this.onGripUp = function (evt) {
      self.handleButton("grip", "up", evt.detail);
    };

    this.onTrackpadDown = function (evt) {
      self.handleButton("trackpad", "down", evt.detail);
    };

    this.onTrackpadUp = function (evt) {
      self.handleButton("trackpad", "up", evt.detail);
    };

    this.onTrackpadChanged = function (evt) {
      self.handleButton("trackpad", "changed", evt.detail);
    };

    this.onTrackpadTouchEnd = function (evt) {
      self.handleButton("trackpad", "touchend", evt.detail);
    };

    this.onTriggerDown = function (evt) {
      self.handleButton("trigger", "down", evt.detail);
    };

    this.onTriggerUp = function (evt) {
      self.handleButton("trigger", "up", evt.detail);
    };

    this.onTriggerChanged = function (evt) {
      self.handleButton("trigger", "changed", evt.detail);
    };

    this.onTriggerTouchEnd = function (evt) {
      self.handleButton("trigger", "touchend", evt.detail);
    };

    this.onGripChanged = function (evt) {
      self.handleButton("grip", "changed", evt.detail);
    };

    this.onGripTouchEnd = function (evt) {
      self.handleButton("grip", "touchend", evt.detail);
    };

    this.onThumbstickDown = function (evt) {
      self.handleButton("thumbstick", "down", evt.detail);
    };

    this.onThumbstickUp = function (evt) {
      self.handleButton("thumbstick", "up", evt.detail);
    };

    this.onAorXChanged = function (evt) {
      self.handleButton("AorX", "changed", evt.detail);
    };

    this.onAorXTouchEnd = function (evt) {
      self.handleButton("AorX", "touchend", evt.detail);
    };

    this.onBorYChanged = function (evt) {
      self.handleButton("BorY", "changed", evt.detail);
    };

    this.onBorYTouchEnd = function (evt) {
      self.handleButton("BorY", "touchend", evt.detail);
    };

    this.onSurfaceChanged = function (evt) {
      self.handleButton("surface", "changed", evt.detail);
    };

    this.onSurfaceTouchEnd = function (evt) {
      self.handleButton("surface", "touchend", evt.detail);
    };

    this.onControllerConnected = this.onControllerConnected.bind(this);
    this.onControllerDisconnected = this.onControllerDisconnected.bind(this);
    el.addEventListener("controllerconnected", this.onControllerConnected);
    el.addEventListener("controllerdisconnected", this.onControllerDisconnected); // Hidden by default.

    el.object3D.visible = false;
  },
  play: function () {
    this.addEventListeners();
  },
  pause: function () {
    this.removeEventListeners();
  },
  tick: function (time, delta) {
    var mesh = this.el.getObject3D("mesh");

    if (!mesh || !mesh.mixer) {
      return;
    }

    mesh.mixer.update(delta / 1000);
  },
  onControllerConnected: function () {
    this.el.object3D.visible = true;
  },
  onControllerDisconnected: function () {
    this.el.object3D.visible = false;
  },
  addEventListeners: function () {
    var el = this.el;
    el.addEventListener("gripdown", this.onGripDown);
    el.addEventListener("gripup", this.onGripUp);
    el.addEventListener("trackpaddown", this.onTrackpadDown);
    el.addEventListener("trackpadup", this.onTrackpadUp);
    el.addEventListener("trackpadchanged", this.onTrackpadChanged);
    el.addEventListener("trackpadtouchend", this.onTrackpadTouchEnd);
    el.addEventListener("triggerdown", this.onTriggerDown);
    el.addEventListener("triggerup", this.onTriggerUp);
    el.addEventListener("triggerchanged", this.onTriggerChanged);
    el.addEventListener("triggertouchend", this.onTriggerTouchEnd);
    el.addEventListener("gripchanged", this.onGripChanged);
    el.addEventListener("griptouchend", this.onGripTouchEnd);
    el.addEventListener("thumbstickdown", this.onThumbstickDown);
    el.addEventListener("thumbstickup", this.onThumbstickUp);
    el.addEventListener("abuttonchanged", this.onAorXChanged);
    el.addEventListener("abuttontouchend", this.onAorXTouchEnd);
    el.addEventListener("bbuttonchanged", this.onBorYChanged);
    el.addEventListener("bbuttontouchend", this.onBorYTouchEnd);
    el.addEventListener("xbuttonchanged", this.onAorXChanged);
    el.addEventListener("xbuttontouchend", this.onAorXTouchEnd);
    el.addEventListener("ybuttonchanged", this.onBorYChanged);
    el.addEventListener("ybuttontouchend", this.onBorYTouchEnd);
    el.addEventListener("surfacechanged", this.onSurfaceChanged);
    el.addEventListener("surfacetouchend", this.onSurfaceTouchEnd);
  },
  removeEventListeners: function () {
    var el = this.el;
    el.removeEventListener("gripdown", this.onGripDown);
    el.removeEventListener("gripup", this.onGripUp);
    el.removeEventListener("trackpaddown", this.onTrackpadDown);
    el.removeEventListener("trackpadup", this.onTrackpadUp);
    el.removeEventListener("trackpadchanged", this.onTrackpadChanged);
    el.removeEventListener("trackpadtouchend", this.onTrackpadTouchEnd);
    el.removeEventListener("triggerdown", this.onTriggerDown);
    el.removeEventListener("triggerup", this.onTriggerUp);
    el.removeEventListener("triggerchanged", this.onTriggerChanged);
    el.removeEventListener("triggertouchend", this.onTriggerTouchEnd);
    el.removeEventListener("gripchanged", this.onGripChanged);
    el.removeEventListener("griptouchend", this.onGripTouchEnd);
    el.removeEventListener("thumbstickdown", this.onThumbstickDown);
    el.removeEventListener("thumbstickup", this.onThumbstickUp);
    el.removeEventListener("abuttonchanged", this.onAorXChanged);
    el.removeEventListener("abuttontouchend", this.onAorXTouchEnd);
    el.removeEventListener("bbuttonchanged", this.onBorYChanged);
    el.removeEventListener("bbuttontouchend", this.onBorYTouchEnd);
    el.removeEventListener("xbuttonchanged", this.onAorXChanged);
    el.removeEventListener("xbuttontouchend", this.onAorXTouchEnd);
    el.removeEventListener("ybuttonchanged", this.onBorYChanged);
    el.removeEventListener("ybuttontouchend", this.onBorYTouchEnd);
    el.removeEventListener("surfacechanged", this.onSurfaceChanged);
    el.removeEventListener("surfacetouchend", this.onSurfaceTouchEnd);
  },

  /**
   * Update handler. More like the `init` handler since the only property is the hand, and
   * that won't be changing much.
   */
  update: function (previousHand) {
    var controlConfiguration;
    var el = this.el;
    var hand = this.data;
    var self = this; // Get common configuration to abstract different vendor controls.

    controlConfiguration = {
      hand: hand,
      model: false,
      orientationOffset: {
        x: 0,
        y: 0,
        z: hand === "left" ? 90 : -90
      }
    }; // Set model.

    if (hand !== previousHand) {
      this.loader.load(MODEL_URLS[hand], function (gltf) {
        var mesh = gltf.scene.children[0];
        mesh.mixer = new THREE.AnimationMixer(mesh);
        self.clips = gltf.animations;
        el.setObject3D("mesh", mesh);
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(0, 0, hand === "left" ? 45 : -45);
        el.setAttribute("vive-controls", controlConfiguration);
        el.setAttribute("oculus-touch-controls", controlConfiguration);
        el.setAttribute("windows-motion-controls", controlConfiguration);
      });
    }
  },
  remove: function () {
    this.el.removeObject3D("mesh");
  },

  /**
   * Play model animation, based on which button was pressed and which kind of event.
   *
   * 1. Process buttons.
   * 2. Determine gesture (this.determineGesture()).
   * 3. Animation gesture (this.animationGesture()).
   * 4. Emit gesture events (this.emitGestureEvents()).
   *
   * @param {string} button - Name of the button.
   * @param {string} evt - Type of event for the button (i.e., down/up/touchstart/touchend).
   */
  handleButton: function (button, evt, detail) {
    var lastGesture;
    var isPressed = evt === "down";
    var isTouched = evt === "changed" && detail.value > 0; // Update objects.

    if (evt.indexOf("changed") === 0) {
      // Update touch object.
      if (isTouched === this.touchedButtons[button]) {
        return;
      }

      this.touchedButtons[button] = isTouched;
    } else {
      // Update button object.
      if (isPressed === this.pressedButtons[button]) {
        return;
      }

      this.pressedButtons[button] = isPressed;
    } // Determine the gesture.


    lastGesture = this.gesture;
    this.gesture = this.determineGesture(); // Same gesture.

    if (this.gesture === lastGesture) {
      return;
    } // Animate gesture.


    this.animateGesture(this.gesture, lastGesture); // Emit events.

    this.emitGestureEvents(this.gesture, lastGesture);
  },

  /**
   * Determine which pose hand should be in considering active and touched buttons.
   */
  determineGesture: function () {
    var gesture;
    var isGripActive = this.pressedButtons["grip"];
    var isSurfaceActive = this.pressedButtons["surface"] || this.touchedButtons["surface"];
    var isTrackpadActive = this.pressedButtons["trackpad"] || this.touchedButtons["trackpad"];
    var isTriggerActive = this.pressedButtons["trigger"] || this.touchedButtons["trigger"];
    var isABXYActive = this.touchedButtons["AorX"] || this.touchedButtons["BorY"];
    var isVive = isViveController(this.el.components["tracked-controls"]); // Works well with Oculus Touch and Windows Motion Controls, but Vive needs tweaks.

    if (isVive) {
      if (isGripActive || isTriggerActive) {
        gesture = ANIMATIONS.fist;
      } else if (isTrackpadActive) {
        gesture = ANIMATIONS.point;
      }
    } else {
      if (isGripActive) {
        if (isSurfaceActive || isABXYActive || isTrackpadActive) {
          gesture = isTriggerActive ? ANIMATIONS.fist : ANIMATIONS.point;
        } else {
          gesture = isTriggerActive ? ANIMATIONS.thumbUp : ANIMATIONS.pointThumb;
        }
      } else if (isTriggerActive) {
        gesture = ANIMATIONS.hold;
      }
    }

    return gesture;
  },

  /**
   * Play corresponding clip to a gesture
   */
  getClip: function (gesture) {
    var clip;
    var i;

    for (i = 0; i < this.clips.length; i++) {
      clip = this.clips[i];

      if (clip.name !== gesture) {
        continue;
      }

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
    } // If no gesture, then reverse the current gesture back to open pose.


    this.playAnimation(lastGesture, lastGesture, true);
  },

  /**
   * Emit `hand-controls`-specific events.
   */
  emitGestureEvents: function (gesture, lastGesture) {
    var el = this.el;
    var eventName;

    if (lastGesture === gesture) {
      return;
    } // Emit event for lastGesture not inactive.


    eventName = getGestureEventName(lastGesture, false);

    if (eventName) {
      el.emit(eventName);
    } // Emit event for current gesture now active.


    eventName = getGestureEventName(gesture, true);

    if (eventName) {
      el.emit(eventName);
    }
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
    var mesh = this.el.getObject3D("mesh");
    var toAction;

    if (!mesh) {
      return;
    } // Stop all current animations.


    mesh.mixer.stopAllAction(); // Grab clip action.

    clip = this.getClip(gesture);
    toAction = mesh.mixer.clipAction(clip);
    toAction.clampWhenFinished = true;
    toAction.loop = THREE.LoopRepeat;
    toAction.repetitions = 0;
    toAction.timeScale = reverse ? -1 : 1;
    toAction.time = reverse ? clip.duration : 0;
    toAction.weight = 1; // No gesture to gesture or gesture to no gesture.

    if (!lastGesture || gesture === lastGesture) {
      // Stop all current animations.
      mesh.mixer.stopAllAction(); // Play animation.

      toAction.play();
      return;
    } // Animate or crossfade from gesture to gesture.


    clip = this.getClip(lastGesture);
    fromAction = mesh.mixer.clipAction(clip);
    fromAction.weight = 0.15;
    fromAction.play();
    toAction.play();
    fromAction.crossFadeTo(toAction, 0.15, true);
  }
});
/**
 * Suffix gestures based on toggle state (e.g., open/close, up/down, start/end).
 *
 * @param {string} gesture
 * @param {boolean} active
 */

function getGestureEventName(gesture, active) {
  var eventName;

  if (!gesture) {
    return;
  }

  eventName = EVENTS[gesture];

  if (eventName === "grip") {
    return eventName + (active ? "close" : "open");
  }

  if (eventName === "point") {
    return eventName + (active ? "up" : "down");
  }

  if (eventName === "pointing" || eventName === "pistol") {
    return eventName + (active ? "start" : "end");
  }

  return;
}

function isViveController(trackedControls) {
  var controller = trackedControls && trackedControls.controller;
  var isVive = controller && (controller.id && controller.id.indexOf("OpenVR ") === 0 || controller.profiles && controller.profiles[0] && controller.profiles[0] === "htc-vive-controller-mv");
  return isVive;
}
},{"url:../models/leftHand.glb":"1d6379be3c002b5572a33820d2032b35","url:../models/rightHand.glb":"9d514a1a66f078db4e8683706a7e4755"}],"1d6379be3c002b5572a33820d2032b35":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("a49eb4771705ba3c", "a2db84f8cbff5f22");
},{"./bundle-url":"2146da1905b95151ed14d455c784e7b7","./relative-path":"1b9943ef25c7bbdf0dd1b9fa91880a6c"}],"2146da1905b95151ed14d455c784e7b7":[function(require,module,exports) {
"use strict";

/* globals document:readonly */
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
} // TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.


function getOrigin(url) {
  let matches = ('' + url).match(/(https?|file|ftp):\/\/[^/]+/);

  if (!matches) {
    throw new Error('Origin not found');
  }

  return matches[0];
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;
},{}],"1b9943ef25c7bbdf0dd1b9fa91880a6c":[function(require,module,exports) {
"use strict";

var resolve = require('./bundle-manifest').resolve;

module.exports = function (fromId, toId) {
  return relative(dirname(resolve(fromId)), resolve(toId));
};

function dirname(_filePath) {
  if (_filePath === '') {
    return '.';
  }

  var filePath = _filePath[_filePath.length - 1] === '/' ? _filePath.slice(0, _filePath.length - 1) : _filePath;
  var slashIndex = filePath.lastIndexOf('/');
  return slashIndex === -1 ? '.' : filePath.slice(0, slashIndex);
}

function relative(from, to) {
  if (from === to) {
    return '';
  }

  var fromParts = from.split('/');

  if (fromParts[0] === '.') {
    fromParts.shift();
  }

  var toParts = to.split('/');

  if (toParts[0] === '.') {
    toParts.shift();
  } // Find where path segments diverge.


  var i;
  var divergeIndex;

  for (i = 0; (i < toParts.length || i < fromParts.length) && divergeIndex == null; i++) {
    if (fromParts[i] !== toParts[i]) {
      divergeIndex = i;
    }
  } // If there are segments from "from" beyond the point of divergence,
  // return back up the path to that point using "..".


  var parts = [];

  for (i = 0; i < fromParts.length - divergeIndex; i++) {
    parts.push('..');
  } // If there are segments from "to" beyond the point of divergence,
  // continue using the remaining segments.


  if (toParts.length > divergeIndex) {
    parts.push.apply(parts, toParts.slice(divergeIndex));
  }

  return parts.join('/');
}

module.exports._dirname = dirname;
module.exports._relative = relative;
},{"./bundle-manifest":"ba8df6b71e73837c465d69bebde6e64d"}],"9d514a1a66f078db4e8683706a7e4755":[function(require,module,exports) {
module.exports = require('./bundle-url').getBundleURL() + require('./relative-path')("a49eb4771705ba3c", "227862007a90f212");
},{"./bundle-url":"2146da1905b95151ed14d455c784e7b7","./relative-path":"1b9943ef25c7bbdf0dd1b9fa91880a6c"}]},{},["3c2b2bd89d79cc2017201e952bb90868","674fc0a4645b3f33997603d3b9de4156","7ee1380f531dd978f34d6b49ae662ed8"], null)

//# sourceMappingURL=hand.component.e0c81919.js.map
