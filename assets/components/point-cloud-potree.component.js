/* global AFRAME, THREE */
import {PointCloudOctree, Potree} from "./../libs/potree"

AFRAME.registerComponent("point-cloud-potree", {

  schema: {
    model: {type: "string", default:"cloud.js"},
    baseUrl: {type: "string", default:"https://cdn.rawgit.com/potree/potree/develop/pointclouds/lion_takanawa/"}
  },

  init() {
    this.loaded = false
    document.querySelector("[camera]").addEventListener('loaded', e => {
      console.log(this)
      this.camera = e.target.getObject3D("camera")
      this.scene = this.el.sceneEl.object3D
      this.renderer = this.el.sceneEl.renderer
      this.potree = new Potree()
      this.pointClouds = []
      this.potree.loadPointCloud(this.data.model, url => `${this.data.baseUrl}${url}`)
        .then(pco => {
          this.el.sceneEl.object3D.add(pco)
          this.pointClouds.push(pco)

          return pco
        })
        .then(pco => {
          pco.translateX(-1);
          pco.rotateX(-Math.PI / 2);

          // The point cloud octree already comes with a material which
          // can be customized directly. Here we just set the size of the
          // points.
          pco.material.size = 1.0;
          this.loaded = true
        })
        .catch(err => console.error(err))

    })
  },

  update(oldData) {
    if (Object.keys(oldData).length === 0) { return }
    //if(oldData.key !== this.data.key) {}
  },

  tick(time, delta) {
    if(this.loaded) {
      this.potree.updatePointClouds(this.pointClouds, this.camera, this.renderer)
    }
  }
})
