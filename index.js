//...
import * as d3 from 'd3'
window.d3 = d3
window.kgd = {}
console = window.console

document.body.addEventListener('connected', () => {
  console.log("Made it here!!!")
  onConnect()
})


let playerTemplate = {
  template: '#player-template',
  components: [
    'position',
    'rotation'
  ]
};
NAF.schemas.add(playerTemplate);

let handTemplate = {
  template: '#hand-template',
  components: [
    'position',
    'rotation',
    'hand-animator'
  ]
}
NAF.schemas.add(handTemplate)

NAF.schemas.add({
  template: '#head-template',
  components: [
    'position',
    'rotation',
    {
      selector: '.head',
      component: 'material',
      property: 'color'
    },
    {
      selector: '.nametag',
      component: 'text',
      property: 'value'
    }
  ]
});

NAF.schemas.add({
  template: '#box-head-template',
  components: [
    'position',
    'rotation',
    // {
    //   selector: '.head',
    //   component: 'material',
    //   property: 'color'
    // },
    {
      selector: '.nametag',
      component: 'text',
      property: 'value'
    }
  ]
});



// NAF.schemas.add({
//   template: '#video-template',
//   components: [
//     'position',
//     'rotation',
//     {
//       selector: '.front',
//       component: 'video-sync',
//       property: 'paused',
//     },
//     {
//       selector: '.front',
//       component: 'video-sync',
//       property: 'src',
//     },
//     {
//       selector: '.front',
//       component: 'video-sync',
//       property: 'currentTime',
//     },
//   ]
// });


// Called by Networked-Aframe when connected to server
let onConnect = kgd.onConnect = function() {
  console.log("onConnect", new Date());

  document.body.addEventListener('entityCreated', function (evt) {
    console.error('entityCreated event', evt);
  });

  let el = d3.select("#player")
  let params = processParams()
  console.log("Player params: ", params)
  let pos = params.pos
  let rot = params.rot
  if(pos) {
    console.log("Moving player to " + pos)
    el.node().object3D.position.set(pos[0], pos[1], pos[2])
  }

  if(rot) {
    // el.node().object3D.rotation.set(rot[0], rot[1], rot[2])
    console.log("Rotating player to " + rot[1] + " degrees")
    //el.node().object3D.rotateY(Math.PI * (rot[1]/180))
    el.node().object3D.rotation.y = Math.PI * (rot[1]/180)
    console.log("player rotation: ", el.node().object3D.rotation)
    // el.node().object3D.updateMatrixWorld()
  }

  let head = d3.select('#player .head')
  console.log("Setting head color to " + params.color)
  head.node().setAttribute('material', 'color', params.color)
  // el.select('.nametag').node().setAttribute('text', 'value', params.name)
  //let nt = el.node().querySelector('.nametag')
  // let nt = el.append('a-entity').attr('class', 'nametag')
  let nt = d3.select('#player .nametag')

  nt.node().setAttribute('text', 'value', params.name)

}

let randomHexColor = () => {
  let hexCode = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += hexCode[Math.floor(Math.random() * 16)]
  }
  return color
}

let processParams = () => {
  let defaults = {name: 'anon', color: randomHexColor()}
  let params = Object.fromEntries(new URLSearchParams(window.location.search))
  if(params.pos) {
    params.pos = params.pos.split(':').map(d => Number(d))
  }
  if(params.rot) {
    params.rot = params.rot.split(':').map(d => Number(d))
  }
  if(params.color) {
    params.color = '#' + params.color
  }
  params = {...defaults, ...params}
  return params
}


/* NAF.connection.subscribeToDataChannel('occupantsChanged', function(d) {
 *   console.log("OCCUPANTS CHANGED!!", d)
 * }) */



// On mobile remove elements that are resource heavy
var isMobile = AFRAME.utils.device.isMobile();

if (isMobile) {
  var particles = document.getElementById('particles');
  particles.parentNode.removeChild(particles);
}

export default {
  onConnect: onConnect
}
