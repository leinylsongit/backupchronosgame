import { Hands } from '@mediapipe/hands';
import * as BABYLON from 'babylonjs';

// Variáveis globais
let engine, scene, camera, handTracking, sphere;

// Cria a cena BabylonJS
function createScene() {
    // Cria o engine
    engine = new BABYLON.Engine(document.getElementById('renderCanvas'), true);

    // Cria a cena
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);

    // Cria a câmera
    camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(document.getElementById('renderCanvas'), true);

    // Cria uma luz direcional
    const light = new BABYLON.DirectionalLight('dir01', new BABYLON.Vector3(-1, -2, -1), scene);

    // Cria uma esfera para representar a mão
    sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
}

// Inicializa o MediaPipe Hands e inicia o loop de renderização
async function initHands() {
    // Cria a instância do MediaPipe Hands
    handTracking = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    // Inicia o hand tracking
    handTracking.onResults((results) => {
        if (results.multiHandLandmarks) {
            const landmarks = results.multiHandLandmarks[0];

            // Define a posição da esfera com base no ponto médio dos dedos
            const x = (landmarks[5].x + landmarks[17].x) / 2;
            const y = (landmarks[5].y + landmarks[17].y) / 2;
            const z = (landmarks[5].z + landmarks[17].z) / 2;
            sphere.position = new BABYLON.Vector3(x, y, z);
        }
    });
    handTracking.initialize();
    handTracking.start();

    // Inicia o loop de renderização
    engine.runRenderLoop(() => {
        scene.render();
    });
}

// Função principal
async function main() {
    createScene();
    await initHands();
}

main();
