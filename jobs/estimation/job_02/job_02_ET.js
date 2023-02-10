import * as YUKA from '../../../../lib/yuka.module.js'
import 'https://preview.babylonjs.com/babylon.js'
import 'https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js'
import 'https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js'

import { FirstPersonControls } from './src/FirstPersonControls.js'
import { Player } from './src/Player.js'

let engine, scene, camera, step1, step2
let time, controls

// const entityMatrix = new BABYLON.Matrix()

init()

//

function init() {
  const canvas = document.getElementById('renderCanvas')
  engine = new BABYLON.Engine(canvas, true, {}, true)

  if (BABYLON.Engine.audioEngine) {
    BABYLON.Engine.audioEngine.useCustomUnlockedButton = true
  }

  scene = new BABYLON.Scene(engine)
  scene.clearColor = BABYLON.Color3.FromHexString('#a0a0a0')
  scene.useRightHandedSystem = true; // Rotaciona para direita
  // scene.useRightHandedSystem = false; // Rotaciona para esquerda

  camera = new BABYLON.ArcRotateCamera("Camera", -90/180*Math.PI, 45/180*Math.PI, Math.PI, new BABYLON.Vector3(0, 0, 0), scene);
  camera.minZ = 0.1;
  // camera.maxZ = 20000;

  // Permite distanciar a camera
  // camera.setPosition(new BABYLON.Vector3(20, 100, 100));
    

  camera.attachControl(canvas);
  camera.lowerRadiusLimit = 2.5;
  camera.upperRadiusLimit = 10;
  camera.pinchDeltaPercentage = 0.01;
  camera.wheelDeltaPercentage = 0.01;

// Lights
  new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene)
  new BABYLON.DirectionalLight('dir-light', new BABYLON.Vector3(1, 1, 0), scene)

// Névoa
  // scene.fogMode = BABYLON.Scene.FOGMODE_EXP2
  // scene.fogColor = BABYLON.Color3.FromHexString('#a0a0a0')
  // scene.fogDensity = 0.001

// Skybox
var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;           
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/nebula/nebula", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.disableLighting = true;
skybox.material = skyboxMaterial;

// Create the Earth
  var earth = BABYLON.Mesh.CreateSphere("earth", 20, 2.0, scene);
//	var earth = BABYLON.MeshBuilder.CreateSphere("object", {}, scene);
  var earthMaterial = new BABYLON.StandardMaterial("ground", scene);
  earthMaterial.diffuseTexture = new BABYLON.Texture("./textures/earth.jpg", scene);
  earthMaterial.diffuseTexture.uScale = -1;
  earthMaterial.diffuseTexture.vScale = -1;
  earth.material = earthMaterial;

// Earth animation
  var earthAxis = new BABYLON.Vector3(Math.sin(23.4/180 * Math.PI), Math.cos(23.4/180 * Math.PI), 0);
  var angle = 0.003; // Influencia a velocidade
  scene.registerBeforeRender(function() {
      earth.rotate(earthAxis, angle, BABYLON.Space.WORLD);
  })
  

  // Adiciona algum elemento 3d
  // BABYLON.SceneLoader.ImportMesh(null, 'model/', 'Ambiente_A.glb', scene, (meshes) => {
  //   // 3D assets are loaded, now load nav mesh
  //   var ambiente = meshes[0];
  //   ambiente.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
  //   ambiente.position = new BABYLON.Vector3(0, -20, 0);


// Loading screen
      const loadingScreen = document.getElementById('loading-screen')
      loadingScreen.classList.add('fade-out')
      loadingScreen.addEventListener('transitionend', onTransitionEnd)

 // Sounds
      step1 = new BABYLON.Sound('step1', 'audio/step1.ogg', scene, null, {
        loop: false,
        autoplay: false,
      })

      step2 = new BABYLON.Sound('step2', 'audio/step2.ogg', scene, null, {
        loop: false,
        autoplay: false,
      })

// Game setup
      window.addEventListener('resize', onWindowResize, false)

      const intro = document.getElementById('intro')

      intro.addEventListener(
        'click',
        () => {
          if (BABYLON.Engine.audioEngine) {
            BABYLON.Engine.audioEngine.unlock()
          }

          controls.connect()
        },
        false
      )

      time = new YUKA.Time()

      const player = new Player()

      controls = new FirstPersonControls(player)
      controls.setRotation(-2.2, 0.2)

      controls.sounds.set('rightStep', step1)
      controls.sounds.set('leftStep', step2)

      
      controls.addEventListener('lock', () => {
        intro.classList.add('hidden')
      })

      controls.addEventListener('unlock', () => {
        intro.classList.remove('hidden')
      })


      animate()
    }
  // }


function onWindowResize() {
  engine.resize()
}

function animate() {
  requestAnimationFrame(animate)

  const delta = time.update().getDelta()
  controls.update(delta)

  scene.render()
}

function onTransitionEnd(event) {
  event.target.remove()
}
