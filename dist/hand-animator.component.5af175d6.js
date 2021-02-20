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
})({"3fae37b9417adc7f9448bf83e5303a26":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "5af175d674ec36b2eb707af71b45a11f";
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
},{}],"46a61f6906313acc9818f6baf69f3704":[function(require,module,exports) {
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
}; // Poses.

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
}; // Map animation to public events for the API.

var EVENTS = {};
EVENTS[ANIMATIONS.fist] = 'grip';
EVENTS[ANIMATIONS.thumbUp] = 'pistol';
EVENTS[ANIMATIONS.point] = 'pointing';
AFRAME.registerComponent("hand-animator", {
  schema: {
    color: {
      default: 'white',
      type: 'color'
    },
    hand: {
      default: 'left'
    },
    lastGesture: {
      default: 'Open'
    },
    gesture: {
      default: 'Open'
    },
    gestureComplex: {
      default: 'xxx'
    },
    flipper: {
      default: false,
      type: 'boolean'
    },
    handModelStyle: {
      default: 'lowPoly',
      oneOf: ['lowPoly', 'highPoly', 'toon']
    }
  },

  init() {
    console.log("Creating hand-animator: ", this.data);
    this.loader = new THREE.GLTFLoader();
    this.loader.setCrossOrigin('anonymous');
  },

  update: function (previousData) {
    // var controlConfiguration;
    var el = this.el;
    var hand = this.data.hand;
    var handModelStyle = this.data.handModelStyle;
    var handColor = this.data.color;
    var self = this; // var event = this.data.event
    // Get common configuration to abstract different vendor controls.
    // controlConfiguration = {
    //   hand: hand,
    //   model: false
    // };
    // console.log("Event change: ", event)

    console.log("Hand-animator - updating gesture from " + this.data.gesture + " to " + this.data.lastGesture);

    if (this.isAvatar()) {
      [gesture, lastGesture] = this.data.gestureComplex.split('__').map(d => {
        if (d === 'undefined') {
          return undefined;
        }

        return d;
      });
      this.animateGesture(gesture, lastGesture);
    } // Set model.


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
        mesh.rotation.set(0, 0, handModelOrientation); // el.setAttribute('magicleap-controls', controlConfiguration);
        // el.setAttribute('vive-controls', controlConfiguration);
        // el.setAttribute('oculus-touch-controls', controlConfiguration);
        // el.setAttribute('windows-motion-controls', controlConfiguration);
      });
    }
  },
  tick: function (time, delta) {
    var mesh = this.el.getObject3D('mesh');

    if (!mesh || !mesh.mixer) {
      return;
    }

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
    toAction.weight = 1; //console.log("Playing animation, from " + lastGesture + " to " + gesture)
    //this.el.setAttribute("hand-animator", {gesture: gesture, lastGesture: lastGesture, gestureComplex: gesture + '_' + lastGesture})
    // No gesture to gesture or gesture to no gesture.

    let flipper = this.el.getAttribute("hand-animator")['flipper'];
    console.log("(animator) Playing animation, from " + lastGesture + " to " + gesture + ", flipper: ", +flipper);
    console.log("Gesture complex: ", this.data.gestureComplex);
    console.log("Reverse: ", reverse);

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
  },
  isAvatar: function () {
    return this.el.getAttribute('hand-controls-kgd') === null;
  }
});
},{}]},{},["3fae37b9417adc7f9448bf83e5303a26","46a61f6906313acc9818f6baf69f3704"], null)

//# sourceMappingURL=hand-animator.component.5af175d6.js.map
