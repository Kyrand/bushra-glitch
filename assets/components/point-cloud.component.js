import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader"

let points;
let flashPoints = false;


AFRAME.registerComponent('point-cloud', {

  schema: {
    model: {default: "hintze-hall-lo.ply"},
    color: {default: 0x0055ff},
    pointsFlag: {default: true}
  },

  init() {
		const loader = new PLYLoader();
		loader.load( "/assets/models/" + this.data.model, ( geometry ) =>  {

			geometry.computeVertexNormals();

      let mesh
      if(this.data.pointsFlag) {
        mesh = new THREE.Points(geometry, new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors }));
			  //mesh.rotation.x = - Math.PI / 2;
        console.log("Mesh", mesh)
      }
      else {
			  const material = new THREE.MeshStandardMaterial( { color: this.data.color, flatShading: true } );
			  mesh = new THREE.Mesh( geometry, material );
        console.log("Mesh", mesh)
			  // mesh.position.y = - 0.2;
			  // mesh.position.z = 0.3;
			  // mesh.rotation.x = - Math.PI / 2;
			  // mesh.scale.multiplyScalar( 0.001 );

			  mesh.castShadow = true;
			  mesh.receiveShadow = true;
      }

      let scene = this.el.object3D
			scene.add( mesh );
		} );
  },
  tick(time, delta) {

  }

});


  // init: function () {
  //   if (!Detector.webgl) Detector.addGetWebGLMessage()
  //   let container, stats
  //   let camera, renderer
  //   //let scene = document.querySelector('a-scene').object3D
  //   let scene = this.el.sceneEl
  //   let g
  //   let loader = new PLYLoader()
  //   loader.load(this.data.model, function (geometry) {
  //     geometry.computeVertexNormals();
  //     console.log('geometry is:');
  //     g = geometry.attributes.position.array;
  //     console.log('g: ', g.length);
  //     let particles = g.length / 3;
  //     console.log('loading particles ....')
  //     let geometry = new THREE.BufferGeometry();
  //     let positions = new Float32Array(particles * 3);
  //     let colors = new Float32Array(particles * 3);
  //     let color = new THREE.Color();
  //     let scale = 300;
  //     for (let i = 0; i < positions.length; i += 3) {
  //       let x = g[i];
  //       let y = g[i + 1];
  //       let z = g[i + 2];
  //       positions[i] = x * scale;
  //       positions[i + 1] = y * scale;
  //       positions[i + 2] = z * scale;
  //       color.setRGB(1, 1, 1);
  //       colors[i] = color.r;
  //       colors[i + 1] = color.g;
  //       colors[i + 2] = color.b;
  //     }
  //     geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  //     geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
  //     geometry.computeBoundingSphere();
  //     let material = new THREE.PointsMaterial({
  //       size: 0.5,
  //       vertexColors: THREE.VertexColors
  //     });
  //     points = new THREE.Points(geometry, material);
  //     scene.add(points);
  //     points.rotation.z = 3.2;
  //     container = document.querySelector('body');
  //     stats = new Stats();
  //     container.appendChild(stats.dom);
  //     let checkbox = document.createElement('input');
  //     let checkboxID = 'flashPoints'
  //     checkbox.type = 'checkbox';
  //     checkbox.name = 'flash-points-checkbox';
  //     checkbox.value = flashPoints;
  //     checkbox.id = checkboxID;
  //     checkbox.onclick = function () {
  //       checkbox.value = !flashPoints;
  //       flashPoints = !flashPoints;
  //       points.material.size = 0.5;
  //     };
  //     let label = document.createElement('label')
  //     label.htmlFor = checkboxID;
  //     label.appendChild(document.createTextNode('Flash the size of the points?'));
  //     checkbox.className += 'generated-checkbox';
  //     label.className += 'generated-label';
  //     container.appendChild(checkbox);
  //     container.appendChild(label);
  //   });
  //   // function animate() {
  //   //   requestAnimationFrame(animate);
  //   //   if (!!points) {
  //   //     render();
  //   //     stats.update();
  //   //   }
  //   // }
  //   // function render() {
  //   //   if (!!points) {
  //   //     var time = document.querySelector('a-scene').time * 0.001;
  //   //     points.rotation.y = time * 0.05;
  //   //     if (flashPoints) {
  //   //       points.material.size = time % 0.5;
  //   //     }
  //   //   }
  //   // }
  // },
