import {tiles, items, setCenterPos, setMapScale} from './globals.js'
import {loadGroundTiles} from './tiles.js'
import {loadTrees} from './trees.js'
import {loadBuildings} from './buildings.js'

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// Mapnik is the default world-wide OpenStreetMap style.
// Basemap offers hires tiles for Austria.
//var tileServer = "https://tilecache.kairo.at/basemaphires/";
// Standard Overpass API Server

var COORDS = {
  Brighton: [50.8222367, -0.1369]
}

var selected = 'Brighton'

window.onload = function() {
  setCenterPos(COORDS[selected][0], COORDS[selected][1])
  setMapScale(0.1)
  loadScene()
}
  // Load location presets and subdialog.

function loadScene() {
  while (tiles.firstChild) {tiles.removeChild(tiles.firstChild); }
  while (items.firstChild) {items.removeChild(items.firstChild); }
  // document.querySelector("#cameraRig").object3D.position.set(0, 0, 0);
  loadGroundTiles();
  loadTrees();
  loadBuildings();
}
