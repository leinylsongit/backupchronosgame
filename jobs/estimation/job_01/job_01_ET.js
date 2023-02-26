import * as YUKA from '../../../../lib/yuka.module.js'
import 'https://preview.babylonjs.com/babylon.js'
import 'https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js'
import 'https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js'

import { FirstPersonControls } from './src/FirstPersonControls.js'
import { Player } from './src/Player.js'

let engine, scene, camera, step1, step2
let entityManager, time, controls

const entityMatrix = new BABYLON.Matrix()

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
  scene.useRightHandedSystem = true

  camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(-13, 0.75, -9), scene, true)
  camera.minZ = 0.1

  // scene.fogMode = BABYLON.Scene.FOGMODE_EXP2
  // scene.fogColor = BABYLON.Color3.FromHexString('#a0a0a0')
  // scene.fogDensity = 0.01

  //
  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 250, height: 250 }, scene)
  ground.position.y = -5
  const groundMaterial = new BABYLON.StandardMaterial('grid', scene)
  groundMaterial.diffuseColor = BABYLON.Color3.FromHexString('#999999')
  ground.material = groundMaterial

  //

  new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene)
  new BABYLON.DirectionalLight('dir-light', new BABYLON.Vector3(1, 1, 0), scene)

  //
  // BABYLON.SceneLoader.ImportMesh(null, "", './assets/plantas/Bordo.glb', scene, (meshes) => {
  BABYLON.SceneLoader.ImportMesh(null, 'model/', 'house.glb', scene, (meshes) => {
    // BABYLON.SceneLoader.ImportMesh(null, 'C:/Users/Leinylson/Documents/game/assets/ambiente/labirinto/', 'Labirinto_grama.glb', scene, (meshes) => {
    // 3D assets are loaded, now load nav mesh

    const loader = new YUKA.NavMeshLoader()
    loader.load('./navmesh/navmesh.glb', { epsilonCoplanarTest: 0.25 }).then((navMesh) => {
      const loadingScreen = document.getElementById('loading-screen')

      loadingScreen.classList.add('fade-out')
      loadingScreen.addEventListener('transitionend', onTransitionEnd)

      //

      step1 = new BABYLON.Sound('step1', 'audio/step1.ogg', scene, null, {
        loop: false,
        autoplay: false,
      })

      step2 = new BABYLON.Sound('step2', 'audio/step2.ogg', scene, null, {
        loop: false,
        autoplay: false,
      })

      //

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

      // game setup

      entityManager = new YUKA.EntityManager()
      time = new YUKA.Time()

      const player = new Player()
      player.navMesh = navMesh
      player.head.setRenderComponent(camera, syncCamera)
      player.position.set(-13, -0.75, -9)

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

      entityManager.add(player)

      animate()
    })
  })

// Inicializar o MediaPipe Hands
  // tecladoFinger(canvas)

}

function tecladoFinger(canvas) {
  var hands = new Hands({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    }
  })
  hands.setOptions({
    maxNumHands: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  })

  // Começar a transmitir a imagem da webcam para o MediaPipe Hands
  navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
    video.srcObject = stream
    video.onloadedmetadata = function (e) {
      video.play()
      hands.send({ image: video })
    }
  }).catch(function (error) {
    console.error(error)
  })


  var video = document.getElementById("video")


  // Inicializa a detecção de mãos quando o vídeo estiver pronto para reprodução
  video.addEventListener('loadeddata', function () {
    hands.initialize(video.clientWidth, video.clientHeight)
  })

  // Inicia a reprodução do vídeo
  video.addEventListener('canplay', function () {
    video.play()
  })

  // Criar um objeto plano como botão
  var button = BABYLON.MeshBuilder.CreatePlane("button", { width: 200, height: 100 }, scene)

  // Definir a posição do botão na parte inferior da tela
  button.position.y = -canvas.height / 2 + 50


  engine.runRenderLoop(function () {
    // Renderizar a cena
    scene.render()

    // Atualizar a posição do cursor virtual usando a detecção de mãos do MediaPipe
    hands.send({ image: video }).then(function (results) {
      
      // Obter os pontos de referência da mão detectada
      var handLandmarks = result.multiHandLandmarks[0];

      // Verificar se o ponto de referência na posição 8 existe
      if (handLandmarks[8]) {
          // Obter as coordenadas do ponto de referência na posição 8
          var x = handLandmarks[8].x * canvas.width;
          var y = handLandmarks[8].y * canvas.height;
          
          // Converter as coordenadas do ponto de referência para as coordenadas da tela
          var pos = new BABYLON.Vector3(x, -y, 0);
          BABYLON.Vector3.UnprojectToRef(pos, scene.getTransformMatrix(), camera.viewport.toGlobal(canvas.width, canvas.height), ray.origin);
          
          // Usar um raio para verificar se ele colide com algum objeto na cena
          var pickResult = scene.pickWithRay(ray);
          if (pickResult.hit) {
              // Se o raio colidiu com um objeto, chame a função "onClick" desse objeto
              pickResult.pickedMesh.onClick();
          }
      }

      // if (handLandmarks) {
      //   var indexFinger = handLandmarks[8]
      //   var x = indexFinger.x * video.clientWidth - canvas.width / 2
      //   var y = -indexFinger.y * video.clientHeight + canvas.height / 2
      //   cursor.position.x = x
      //   cursor.position.y = y

      //   // Verificar se o cursor virtual está dentro da área do botão
      //   var buttonWidth = 200
      //   var buttonHeight = 100
      //   var buttonPosX = canvas.width / 2 - buttonWidth / 2
      //   var buttonPosY = -canvas.height / 2 + buttonHeight / 2
      //   if (x > buttonPosX && x < buttonPosX + buttonWidth
      //     && y > buttonPosY && y < buttonPosY + buttonHeight) {
      //     cursorMat.emissiveColor = new BABYLON.Color3(1, 0, 0)
      //     if (button.actionManager) {
      //       button.actionManager.processTrigger(BABYLON.ActionManager.OnPointerOverTrigger)
      //       if (buttonPressed) {
      //         button.actionManager.processTrigger(BABYLON.ActionManager.OnPickTrigger)
      //       }
      //     }
      //   } else {
      //     cursorMat.emissiveColor = new BABYLON.Color3(0, 1, 0)
      //   }
      // }
    })
  })

  // Adicionar evento pointerdown ao botão para registrar o início do clique do usuário
  button.actionManager = new BABYLON.ActionManager(scene)
  button.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnPointerDownTrigger,
    function () {
      buttonPressed = true
    }
  ))

  // Adicionar evento pointerup ao botão para registrar o final do clique do usuário
  button.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnPointerUpTrigger,
    function () {
      buttonPressed = false
    }
  ))
}


function onWindowResize() {
  engine.resize()
}

function animate() {
  requestAnimationFrame(animate)

  const delta = time.update().getDelta()
  controls.update(delta)
  entityManager.update(delta)

  scene.render()
}

function syncCamera(entity, renderComponent) {
  renderComponent.getViewMatrix().copyFrom(BABYLON.Matrix.FromValues(...entity.worldMatrix.elements).invert())
}

function onTransitionEnd(event) {
  event.target.remove()
}
