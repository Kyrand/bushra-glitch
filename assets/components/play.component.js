/* global AFRAME, THREE */
import afu from "../aframe-utils"
import store from "./store"

AFRAME.registerComponent("play", {

  schema: {
    key: {type: "string"},
  },

  init() {
    console.log("Creating play: " + this.data.key)

  },

  update(oldData) {
    if (Object.keys(oldData).length === 0) { return }
    afu.log("Updated play: " + this.data)
    //if(oldData.key !== this.data.key) {}
  },

  tick(time, delta) {}
})
