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
})({"ffe979a78a7bfa517cde4f439176de23":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "dacc8a0cffe45e39ed6fb75a5a712d53";
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
},{}],"384e68e7af659d1db59736e724f83228":[function(require,module,exports) {
AFRAME.registerComponent("player", {
  schema: {
    mass: {
      type: "number",
      default: 70
    },
    // kg
    bounce: {
      type: "number",
      default: 0.1
    },
    // 0 - 1 (larger is more bouncy)
    gravity: {
      type: "number",
      default: -9.8
    },
    // m / s^2
    padding: {
      type: "number",
      default: 0.4
    },
    // m
    paddingHand: {
      type: "number",
      default: 0.03
    },
    // m
    handStrength: {
      type: "number",
      default: 50
    },
    friction: {
      type: "number",
      default: 0.08
    },
    keepAwayWallsDistance: {
      type: "number",
      default: 10
    } // m

  },
  init: function () {
    let self = this; // raycaster (for collision detection with environment)

    this.el.setAttribute("raycaster", {
      objects: "#tile-specific",
      enabled: false,
      autoRefresh: false
    }); // camera

    this.camera = document.createElement("a-entity");
    this.camera.setAttribute("camera", "");
    this.camera.setAttribute("look-controls", "");
    this.camera.setAttribute("wasd-controls", "");
    this.camera.setAttribute("position", {
      y: 1.6
    });
    this.camera.setAttribute("raycaster", {
      objects: "#tile-specific",
      enabled: false,
      autoRefresh: false
    });
    this.el.appendChild(this.camera); // right hand

    this.rightHand = document.createElement("a-entity");
    this.rightHand.setAttribute("hand", "right");
    this.rightHand.setAttribute("raycaster", {
      objects: "#tile-specific",
      enabled: false,
      autoRefresh: false
    });
    this.el.appendChild(this.rightHand); // left hand

    this.leftHand = document.createElement("a-entity");
    this.leftHand.setAttribute("hand", "left");
    this.leftHand.setAttribute("raycaster", {
      objects: "#tile-specific",
      enabled: false,
      autoRefresh: false
    });
    this.score = document.createElement("a-entity");
    this.score.setAttribute("text", "value: 0; color: #0397ac; align: center; width: 0.9;");
    this.score.setAttribute("position", "-0.05 0.01 0.11");
    this.score.setAttribute("rotation", "-165 80 -90");
    this.leftHand.appendChild(this.score);
    this.el.appendChild(this.leftHand); // sounds

    this.rightHand.setAttribute("sound__shoot_web", "src: #sound-shoot-web; volume: 1; positional: false;");
    this.leftHand.setAttribute("sound__shoot_web", "src: #sound-shoot-web; volume: 1; positional: false;");
    this.rightHand.setAttribute("sound__no_web", "src: #sound-no-web; volume: 0.5; positional: false;");
    this.leftHand.setAttribute("sound__no_web", "src: #sound-no-web; volume: 0.5; positional: false;");
    this.el.setAttribute("sound__hit_wall", "src: #sound-hit-wall; positional: false;");
    this.el.setAttribute("sound__hit_ground", "src: #sound-hit-ground; positional: false;"); // properties

    this.velocity = new THREE.Vector3(0, 0, 0);
    this.cameraWorldPosition = new THREE.Vector3();
    this.rightHandWorldPosition = new THREE.Vector3();
    this.leftHandWorldPosition = new THREE.Vector3();
    this.lastCollisionWorldPosition = new THREE.Vector3();
    this.lastCollisionPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
    this.scoreValue = 0; // events

    window.addEventListener("keydown", function (evt) {
      if (evt.keyCode === 32 && !evt.repeat) {
        self.playWebSound(self.rightWeb.components.web.toggleWeb(self.camera, 1), "right");
      }
    });
    window.addEventListener("keyup", function (evt) {
      if (evt.keyCode === 32) {
        self.rightWeb.components.web.toggleWeb(self.camera, 0);
      }
    });
    this.rightHand.addEventListener("triggerchanged", function (evt) {
      self.playWebSound(self.rightWeb.components.web.toggleWeb(self.rightHand, evt.detail.value), "right");
    });
    this.rightHand.addEventListener("triggertouchend", function (evt) {
      self.rightWeb.components.web.toggleWeb(self.rightHand, 0);
    });
    this.leftHand.addEventListener("triggerchanged", function (evt) {
      self.playWebSound(self.leftWeb.components.web.toggleWeb(self.leftHand, evt.detail.value), "left");
    });
    this.leftHand.addEventListener("triggertouchend", function (evt) {
      self.leftWeb.components.web.toggleWeb(self.leftHand, 0);
    });
    this.rightHand.addEventListener("gripchanged", function (evt) {
      self.rightWeb.components.web.changeReduceWallDirForce(evt.detail.value);
    });
    this.rightHand.addEventListener("griptouchend", function (evt) {
      self.rightWeb.components.web.changeReduceWallDirForce(0);
    });
    this.leftHand.addEventListener("gripchanged", function (evt) {
      self.leftWeb.components.web.changeReduceWallDirForce(evt.detail.value);
    });
    this.leftHand.addEventListener("griptouchend", function (evt) {
      self.leftWeb.components.web.changeReduceWallDirForce(0);
    });
    this.rightHand.addEventListener("thumbstickmoved", function (evt) {
      self.rightWeb.components.web.changeLengthFactor(evt.detail.y);
    });
    this.rightHand.addEventListener("thumbstickup", function (evt) {
      self.rightWeb.components.web.changeLengthFactor(0);
    });
    this.leftHand.addEventListener("thumbstickmoved", function (evt) {
      self.leftWeb.components.web.changeLengthFactor(evt.detail.y);
    });
    this.leftHand.addEventListener("thumbstickup", function (evt) {
      self.leftWeb.components.web.changeLengthFactor(0);
    });
  },
  play: function () {
    this.rightWeb = document.getElementById("web-right");
    this.leftWeb = document.getElementById("web-left");
    this.map = document.getElementById("map");

    if (!this.camera.getAttribute("camera").active) {
      this.camera.setAttribute("camera", {
        active: true
      });
    }
  },
  playWebSound: function (type, hand) {
    if (type == "shoot-web") {
      if (hand == "right") this.rightHand.components.sound__shoot_web.playSound();else this.leftHand.components.sound__shoot_web.playSound();
    } else if (type == "no-web") {
      if (hand == "right") this.rightHand.components.sound__no_web.playSound();else this.leftHand.components.sound__no_web.playSound();
    }
  },
  playCollideSound: function (type, strength) {
    if (type == "hit-wall") this.el.components.sound__hit_wall.playSound();else if (type == "hit-ground") this.el.components.sound__hit_ground.playSound();
  },
  updateScore: function () {
    this.score.setAttribute("text", `value: ${this.scoreValue}`);
  },
  tick: function (time, timeDelta) {
    let timeDeltaSec = Math.min(timeDelta / 1000, 1);
    let rigLocalPosition = this.el.object3D.position;
    let velocityRaycaster = this.el.components.raycaster; // apply gravity

    this.velocity.y += this.data.gravity * timeDeltaSec; // apply velocity and collide with environment

    velocityRaycaster.data.origin = this.camera.object3D.position;
    velocityRaycaster.data.direction = this.velocity;
    velocityRaycaster.raycaster.far = Math.max(this.velocity.length() * timeDeltaSec, this.data.padding);
    velocityRaycaster.checkIntersections();

    if (!velocityRaycaster.intersections.length) {
      rigLocalPosition.addScaledVector(this.velocity, timeDeltaSec);
    } else {
      // collision with environment
      this.velocity.reflect(velocityRaycaster.intersections[0].face.normal);
      this.velocity.multiplyScalar(this.data.bounce); // for keep away from walls

      this.lastCollisionWorldPosition = velocityRaycaster.intersections[0].point;
      this.lastCollisionPlane.setFromNormalAndCoplanarPoint(velocityRaycaster.intersections[0].face.normal, velocityRaycaster.intersections[0].point); // sound hit wall

      this.playCollideSound("hit-wall", this.velocity.length());
      this.scoreValue = 0;
      this.updateScore();
    } // collide with floor


    if (rigLocalPosition.y < 0) {
      // sound
      if (this.velocity.y < -2) {
        this.playCollideSound("hit-ground", Math.abs(this.velocity.y));
        this.scoreValue = 0;
        this.updateScore();
      } // collision


      rigLocalPosition.y = 0;
      this.velocity.reflect(new THREE.Vector3(0, 1, 0));
      this.velocity.multiplyScalar(this.data.bounce);
    } // apply webs


    if (AFRAME.utils.device.checkHeadsetConnected()) {
      // vr mode right hand
      if (this.rightWeb) {
        let webForce = this.rightWeb.components.web.updateWeb(this.rightHand, rigLocalPosition, timeDeltaSec, "right");
        this.velocity.addScaledVector(webForce, 1 / this.data.mass * timeDeltaSec); // friction

        if (webForce.lengthSq() > 0) this.velocity.addScaledVector(this.velocity, -1 * timeDeltaSec * this.data.friction);
      } // vr mode left hand


      if (this.leftWeb) {
        let webForce = this.leftWeb.components.web.updateWeb(this.leftHand, rigLocalPosition, timeDeltaSec, "left");
        this.velocity.addScaledVector(webForce, 1 / this.data.mass * timeDeltaSec); // friction

        if (webForce.lengthSq() > 0) this.velocity.addScaledVector(this.velocity, -1 * timeDeltaSec * this.data.friction);
      }
    } else {
      // not in vr mode (use mouse and spacebar)
      if (this.rightWeb) {
        let webForce = this.rightWeb.components.web.updateWeb(this.camera, rigLocalPosition, timeDeltaSec, "camera");
        this.velocity.addScaledVector(webForce, 1 / this.data.mass * timeDeltaSec); // friction

        if (webForce.lengthSq() > 0) this.velocity.addScaledVector(this.velocity, -1 * timeDeltaSec * this.data.friction);
      }
    } // keep camera away from walls


    this.cameraWorldPosition.copy(this.camera.object3D.position);
    this.cameraWorldPosition.add(rigLocalPosition);

    if (this.cameraWorldPosition.distanceTo(this.lastCollisionWorldPosition) < this.data.keepAwayWallsDistance) {
      let lastWallDistance = this.lastCollisionPlane.distanceToPoint(this.cameraWorldPosition);

      if (lastWallDistance < this.data.padding) {
        rigLocalPosition.addScaledVector(this.lastCollisionPlane.normal, this.data.padding - lastWallDistance);
      } // keep hands away from walls


      if (AFRAME.utils.device.checkHeadsetConnected()) {
        // right hand
        this.rightHandWorldPosition.copy(this.rightHand.object3D.position);
        this.rightHandWorldPosition.add(rigLocalPosition);
        lastWallDistance = this.lastCollisionPlane.distanceToPoint(this.rightHandWorldPosition);

        if (lastWallDistance < this.data.paddingHand) {
          rigLocalPosition.addScaledVector(this.lastCollisionPlane.normal, this.data.paddingHand - lastWallDistance);
          this.velocity.addScaledVector(this.lastCollisionPlane.normal, (this.data.paddingHand - lastWallDistance) * this.data.handStrength);
        } // left hand


        this.leftHandWorldPosition.copy(this.leftHand.object3D.position);
        this.leftHandWorldPosition.add(rigLocalPosition);
        lastWallDistance = this.lastCollisionPlane.distanceToPoint(this.leftHandWorldPosition);

        if (lastWallDistance < this.data.paddingHand) {
          rigLocalPosition.addScaledVector(this.lastCollisionPlane.normal, this.data.paddingHand - lastWallDistance);
          this.velocity.addScaledVector(this.lastCollisionPlane.normal, (this.data.paddingHand - lastWallDistance) * this.data.handStrength);
        }
      }
    } // update map


    if (this.map) {
      // choose the web raycasters to update
      let webRaycasters = [this.rightHand.components.raycaster, this.leftHand.components.raycaster];

      if (!AFRAME.utils.device.checkHeadsetConnected()) {
        webRaycasters = [this.camera.components.raycaster];
      } // update the map


      let hitCrystal = this.map.components.map.updateMap(this.cameraWorldPosition, this.velocity, velocityRaycaster, webRaycasters);

      if (hitCrystal) {
        this.scoreValue++;
        this.updateScore();
      }
    }
  }
});
},{}]},{},["ffe979a78a7bfa517cde4f439176de23","384e68e7af659d1db59736e724f83228"], null)

//# sourceMappingURL=player.component.dacc8a0c.js.map
