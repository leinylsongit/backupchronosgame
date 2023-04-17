import * as YUKA from '../../../../lib/yuka.module.js'
import 'https://preview.babylonjs.com/babylon.js'
import 'https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js'
import 'https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js'

import 'https://preview.babylonjs.com/gui/babylon.gui.min.js'

let engine, scene, camera, trilha
let time

var som_Ambiente = false; // checkbox
var som_Efeitos = true; // checkbox
var explosao, colisao;

init()
animate(true);

function init() {
  const canvas = document.getElementById('renderCanvas')
  engine = new BABYLON.Engine(canvas, true, {}, true)

  // if (BABYLON.Engine.audioEngine) {
  //   BABYLON.Engine.audioEngine.useCustomUnlockedButton = true
  // }

  scene = new BABYLON.Scene(engine)
  scene.clearColor = BABYLON.Color3.FromHexString('#a0a0a0')
  scene.useRightHandedSystem = true; // Rotaciona para direita
  // scene.useRightHandedSystem = false; // Rotaciona para esquerda

  // camera = new BABYLON.ArcRotateCamera("camera", -90/180*Math.PI, 45/180*Math.PI, Math.PI, new BABYLON.Vector3(0, 40, -70), scene);
const camera = new BABYLON.ArcRotateCamera(
    'camera',
    BABYLON.Tools.ToRadians(90),
    BABYLON.Tools.ToRadians(80),
    10,
    BABYLON.Vector3.Zero(),
    scene
  )

  camera.wheelDeltaPercentage = 0.005
  camera.target = new BABYLON.Vector3(0, 0, 0)
  camera.attachControl(canvas)
  camera.useAutoRotationBehavior = true
//   var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 5, BABYLON.Vector3.Zero(), scene);
// camera.attachControl(canvas, true);

  // camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 0, -20), scene, true)
  // camera.minZ = 100;
// camera.maxZ = 20000;
// camera.detachControl(canvas);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 250.5;
  // camera.upperRadiusLimit = 150;
  // camera.pinchDeltaPercentage = 2.01;

  // camera.wheelPrecision = 50;
  // camera.zoomOnFactor = 2;

  // camera.panningSensibility = 100; // Panorâmica (botão direito)

  // camera.angularSensibilityX = 500;
  // camera.angularSensibilityY = 500;




  // Cor do plano de fundo da cena
  // scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);


// Lights
  new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene)
  new BABYLON.DirectionalLight('dir-light', new BABYLON.Vector3(1, 1, 0), scene)

// Névoa
  // scene.fogMode = BABYLON.Scene.FOGMODE_EXP2
  // scene.fogColor = BABYLON.Color3.FromHexString('#a0a0a0')
  // scene.fogDensity = 0.001

// Skybox
var skybox = BABYLON.Mesh.CreateBox("skyBox", 1500.0, scene);
var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;           
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/nebula/nebula", scene);// # testar outros céus
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.disableLighting = true;
skybox.material = skyboxMaterial;


// # Executa vídeo de transição entre ambientes
// executaVideo("assets/videos/teleporte.mp4");


// Adiciona o Sol
var sol = BABYLON.ParticleHelper.CreateAsync("sun", scene).then((set) => {
  // console.log(set);        
  //scale all of the particle subsystems uniformly
  for(const sys of set.systems) { // Permite alterar as propriedades do sol
      sys.maxScaleX = 20;
      sys.maxScaleY = 40;
  }
  set.start(); 
});

var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 10, segments: 2.5}, scene);
sphere.isVisible = false; // # Ocultar esta esfera depois!!!


// Create a whirlpool
var points = [];
var tam_espiral = 1000; // # aqui deverá ser um valor que corresponda ao limite máximo de tempo (talvez 10 segundos)
var radius = 0.5;
var angle = 0; // ângulo da trajetória do caminho traçado
for (var index = 0; index <= tam_espiral; index++) {// quanto maior o valor, maior a espiral
    points.push(new BABYLON.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
    radius += 0.3;
    angle += 0.1; // Controla o comprimento do caminho
}

var path3d = new BABYLON.Path3D(points);
var normals = path3d.getNormals();

var linha = BABYLON.Mesh.CreateLines("whirlpool", points, scene, true);
linha.color = new BABYLON.Color3(1, 1, 1);
// linha.isVisible = false; // # Ocultar linha 
linha.alpha = 0.2;

var positionData = linha.getVerticesData(BABYLON.VertexBuffer.PositionKind);
// var heightRange = 10;
// var alpha = 0;

// var diameter = 2;  
// console.log("Diâmetro inicial: ", diameter);

// Asteróide que colidirá com o Sol
var createAsteroid = function(){
  var asteroide = BABYLON.MeshBuilder.CreateSphere("asteroide", {diameter: 2, segments: 1.5}, scene);
  // var asteroide = BABYLON.MeshBuilder.CreateSphere("asteroide", {diameter: diameter, segments: 1.5}, scene);
  var mat = new BABYLON.StandardMaterial("mat1", scene)
  var texture = new BABYLON.Texture("./textures/rock.jpg", scene) // # testar outras texturas 
  mat.diffuseTexture = texture;
  mat.backFaceCulling = false;
  asteroide.material = mat;  
  // asteroide.isVisible = false;
  
  // Create a particle system
  var particleSystem = new BABYLON.ParticleSystem("particles", 150, scene);

  //Texture of each particle
  particleSystem.particleTexture = new BABYLON.Texture("./textures/flare/flare.png", scene);

  // Where the particles come from
  particleSystem.emitter = asteroide; // the starting object, the emitter
  particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0); // Starting all from
  particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

  // Colors of all particles
  particleSystem.color1 = new BABYLON.Color4(0.16, 0.65, 0.93);
  particleSystem.color2 = new BABYLON.Color4(0.91, 0.04, 0.45);
  particleSystem.colorDead = new BABYLON.Color4(0.04, 0.93, 0.4, 0.3);

  // Size of each particle (random between...
  particleSystem.minSize = 0.01;
  particleSystem.maxSize = 2.0

  // Life time of each particle (random between...
  particleSystem.minLifeTime = 0.01;
  particleSystem.maxLifeTime = 2.0;

  // Emission rate
  particleSystem.emitRate = 300;

  // # Blend mode
  // particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
  // particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;

  // Set the gravity of all particles
  particleSystem.gravity = new BABYLON.Vector3(0, -12, 0);

  // Direction of each particle after it has been emitted
  particleSystem.direction1 = new BABYLON.Vector3(-2, 18, 2);
  particleSystem.direction2 = new BABYLON.Vector3(2, 18, -2);

  // Angular speed, in radians
  particleSystem.minAngularSpeed = 0;
  particleSystem.maxAngularSpeed = Math.PI;

  // Speed
  particleSystem.minEmitPower = 1;
  particleSystem.maxEmitPower = 0.4;
  particleSystem.updateSpeed = 0.9;

  // Start the particle system
  particleSystem.start(); // # Rastro de partículas do asteróide (aumenta uso da GPU em 10%)

  var alpha = 0, beta=0;
  scene.registerAfterRender(function(){
      alpha+=0.08;
      beta+=0.04;
    //  asteroide.position = new BABYLON.Vector3(Math.cos(alpha)+Math.cos(beta)+10, 1, Math.sin(alpha)+Math.sin(beta)+10);
      asteroide.position = sphere.position;

    // zoomIn(camera, asteroide, 20);
  })
  // zoomIn(camera, asteroide, 20);
}

createAsteroid();

// The Orb is made of several particle systems 
// function createOrb() {
var createOrb = function(){
  // 1st Particle Sytem - Circles
  BABYLON.ParticleHelper.CreateFromSnippetAsync("2JRD1A#2", scene, false)

  // 2nd Particle Sytem - Core
  BABYLON.ParticleHelper.CreateFromSnippetAsync("EXUQ7M#5", scene, false)

  // 3rd Particle Sytem - Sparks
  var sphereSpark = BABYLON.MeshBuilder.CreateSphere("sphereSpark", { diameter: 3.4, segments: 32 }, scene)
  sphereSpark.isVisible = false;
  BABYLON.ParticleHelper.CreateFromSnippetAsync("UY098C#3", scene, false).then(system => {
    system.emitter = sphereSpark
  })
  // 4th Particle Sytem - Smoke
  var sphereSmoke = BABYLON.MeshBuilder.CreateSphere("sphereSmoke", { diameter: 4.9, segments: 32 }, scene)
  sphereSmoke.isVisible = false;
  BABYLON.ParticleHelper.CreateFromSnippetAsync("UY098C#6", scene, false).then(system => {
    system.emitter = sphereSmoke
  })
}

//---------------------------------- Interface do Usuário ---------------------------------
var userInterface = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
// userInterface.renderScale = 1; // não alterou nada
// userInterface.useRealisticScaling = true;// // não alterou nada
  userInterface.idealWidth = 800;
  userInterface.idealHeight = 900;
  userInterface.useSmallestIdeal = true;
  // userInterface.zIndex = 10;

// Cria uma grade para dividir a Interface do Usuário em células de um tamanho definido.
// Usando 'true' fixa o tamanho da linha ou coluna, expresso em pixels (relativo ao tamanho da janela/advancedTexture FS).
// Linhas e colunas sem o 'true' usarão o valor BJS (onde 1 é igual a 100%) e simplesmente preencherão o espaço restante.

// GUI para Tela
var gridTela = new BABYLON.GUI.Grid();
gridTela.addColumnDefinition(800);
// tela.addColumnDefinition(400);
// tela.addColumnDefinition(200);
// tela.addColumnDefinition(200);
// gridTela.color = new BABYLON.Color3(1, 0, 0);

gridTela.addRowDefinition(100);
// tela.addRowDefinition(100);
// tela.addRowDefinition(100);

gridTela.zIndex = 100;
userInterface.addControl(gridTela);


// GUI para Entradas 
var gridEntrada = new BABYLON.GUI.Grid();
// gridEntrada.color = new BABYLON.Color3(0, 1, 0);

gridEntrada.addColumnDefinition(200);
// entrada.addColumnDefinition(200);
// entrada.addColumnDefinition(200);
// entrada.addColumnDefinition(200);

gridEntrada.addRowDefinition(100);
// entrada.addRowDefinition(100);
// entrada.addRowDefinition(100);

gridEntrada.zIndex = 101;
userInterface.addControl(gridEntrada);

// GUI para Respostas 
var gridResposta = new BABYLON.GUI.Grid();
// gridResposta.color = new BABYLON.Color3(0, 0, 1);

gridResposta.addColumnDefinition(200);
// resposta.addColumnDefinition(200);
// resposta.addColumnDefinition(200);
// resposta.addColumnDefinition(200);

gridResposta.addRowDefinition(100);
// resposta.addRowDefinition(100);
// resposta.addRowDefinition(100);

gridResposta.zIndex = 99;
userInterface.addControl(gridResposta);

// GUI para Teclado
var gridTeclado = new BABYLON.GUI.Grid();
gridTeclado.addColumnDefinition(50);
gridTeclado.addColumnDefinition(50);
gridTeclado.addColumnDefinition(50);
gridTeclado.addColumnDefinition(50);
gridTeclado.addColumnDefinition(50);
gridTeclado.addColumnDefinition(50);
gridTeclado.addColumnDefinition(50);
gridTeclado.addColumnDefinition(50);

gridTeclado.addRowDefinition(50);
gridTeclado.addRowDefinition(50);
gridTeclado.addRowDefinition(50);
gridTeclado.addRowDefinition(50);
gridTeclado.addRowDefinition(50);
gridTeclado.addRowDefinition(50);
gridTeclado.addRowDefinition(50);
gridTeclado.addRowDefinition(50);

gridTeclado.zIndex = 150;
userInterface.addControl(gridTeclado);


// MODAL------------

 // Criar uma caixa para o modal
//  var modalBox = BABYLON.MeshBuilder.CreateBox("modalBox", {size: 1}, scene);

//  // Definir a posição do modal
//  modalBox.position = new BABYLON.Vector3(0, 1, 0);

//  // Criar um material para o modal
//  var modalMaterial = new BABYLON.StandardMaterial("modalMaterial", scene);
//  modalMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
//  modalMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

//  // Adicionar uma textura ao material
//  var modalTexture = new BABYLON.Texture("modal_texture.jpg", scene);
//  modalMaterial.diffuseTexture = modalTexture;
//  modalBox.material = modalMaterial;

//  // Adicionar evento de clique para abrir e fechar o modal
//  scene.onPointerDown = function (evt, pickResult) {
//      if (pickResult.hit && pickResult.pickedMesh === modalBox) {
//          modalBox.isVisible = !modalBox.isVisible;
//      }
//  };

//  modalBox.zIndex = 150;
//  gridTeclado.addControl(modalBox,0,0);


var btn1 = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "../../../assets/gui/1.png");
    btn1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btn1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn1.width = '80px';   
    btn1.height = '80px';
    btn1.background = "transparent";
    btn1.thickness = 0;
    btn1.image.shadowBlur = 5;
    btn1.image.paddingTop = "5px";
    btn1.image.paddingBottom = "5px";
    btn1.image.paddingLeft = "5px";
    btn1.image.paddingRight = "5px";
  
  btn1.zIndex = 150;
  gridTeclado.addControl(btn1,0,0);


  // # usar a função clone e a image.source
  var btn2 = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "../../../assets/gui/2.png");
    btn2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btn2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn2.width = '80px';   
    btn2.height = '80px';
    btn2.background = "transparent";
    btn2.thickness = 0;
    btn2.image.shadowBlur = 5;
    btn2.image.paddingTop = "5px";
    btn2.image.paddingBottom = "5px";
    btn2.image.paddingLeft = "5px";
    btn2.image.paddingRight = "5px";
  
  btn2.zIndex = 150;
  gridTeclado.addControl(btn2,0,1);

  var btn3 = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "../../../assets/gui/3.png");
    btn3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btn3.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn3.width = '80px';   
    btn3.height = '80px';
    btn3.background = "transparent";
    btn3.thickness = 0;
    btn3.image.shadowBlur = 5;
    btn3.image.paddingTop = "5px";
    btn3.image.paddingBottom = "5px";
    btn3.image.paddingLeft = "5px";
    btn3.image.paddingRight = "5px";
  
  btn3.zIndex = 150;
  gridTeclado.addControl(btn3,0,2);

  var btn4 = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "../../../assets/gui/4.png");
    btn4.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btn4.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn4.width = '80px';   
    btn4.height = '80px';
    btn4.background = "transparent";
    btn4.thickness = 0;
    btn4.image.shadowBlur = 5;
    btn4.image.paddingTop = "5px";
    btn4.image.paddingBottom = "5px";
    btn4.image.paddingLeft = "5px";
    btn4.image.paddingRight = "5px";
  
  btn4.zIndex = 150;
  gridTeclado.addControl(btn4,0,3);

  var btn5 = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "../../../assets/gui/5.png");
    btn5.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btn5.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn5.width = '80px';   
    btn5.height = '80px';
    btn5.background = "transparent";
    btn5.thickness = 0;
    btn5.image.shadowBlur = 5;
    btn5.image.paddingTop = "5px";
    btn5.image.paddingBottom = "5px";
    btn5.image.paddingLeft = "5px";
    btn5.image.paddingRight = "5px";
  
  btn5.zIndex = 150;
  gridTeclado.addControl(btn5,0,4);

  var btn6 = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "../../../assets/gui/6.png");
    btn6.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btn6.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn6.width = '80px';   
    btn6.height = '80px';
    btn6.background = "transparent";
    btn6.thickness = 0;
    btn6.image.shadowBlur = 5;
    btn6.image.paddingTop = "5px";
    btn6.image.paddingBottom = "5px";
    btn6.image.paddingLeft = "5px";
    btn6.image.paddingRight = "5px";
  
  btn6.zIndex = 150;
  gridTeclado.addControl(btn6,1,0);

  var btn7 = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "../../../assets/gui/7.png");
    btn7.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btn7.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn7.width = '80px';   
    btn7.height = '80px';
    btn7.background = "transparent";
    btn7.thickness = 0;
    btn7.image.shadowBlur = 5;
    btn7.image.paddingTop = "5px";
    btn7.image.paddingBottom = "5px";
    btn7.image.paddingLeft = "5px";
    btn7.image.paddingRight = "5px";
  
  btn7.zIndex = 150;
  gridTeclado.addControl(btn7,1,1);

  var btn8 = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "../../../assets/gui/8.png");
    btn8.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btn8.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn8.width = '80px';   
    btn8.height = '80px';
    btn8.background = "transparent";
    btn8.thickness = 0;
    btn8.image.shadowBlur = 5;
    btn8.image.paddingTop = "5px";
    btn8.image.paddingBottom = "5px";
    btn8.image.paddingLeft = "5px";
    btn8.image.paddingRight = "5px";
  
  btn8.zIndex = 150;
  gridTeclado.addControl(btn8,1,2);

  var btn9 = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "../../../assets/gui/9.png");
    btn9.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btn9.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn9.width = '80px';   
    btn9.height = '80px';
    btn9.background = "transparent";
    btn9.thickness = 0;
    btn9.image.shadowBlur = 5;
    btn9.image.paddingTop = "5px";
    btn9.image.paddingBottom = "5px";
    btn9.image.paddingLeft = "5px";
    btn9.image.paddingRight = "5px";
  
  btn9.zIndex = 150;
  gridTeclado.addControl(btn9,1,3);

  var btn10 = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "../../../assets/gui/10.png");
    btn10.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btn10.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btn10.width = '80px';   
    btn10.height = '80px';
    btn10.background = "transparent";
    btn10.thickness = 0;
    btn10.image.shadowBlur = 5;
    btn10.image.paddingTop = "5px";
    btn10.image.paddingBottom = "5px";
    btn10.image.paddingLeft = "5px";
    btn10.image.paddingRight = "5px";
  
  btn10.zIndex = 150;
  gridTeclado.addControl(btn10,1,4);

  


// Botão fullscreen
// A  button added to the far right bottom grid cell (row #3, column #3)
var btnFullScreen = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "../../../assets/gui/expand.png");
    btnFullScreen.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btnFullScreen.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btnFullScreen.width = '64px';   
    btnFullScreen.height = '64px';
    btnFullScreen.background = "transparent";
    btnFullScreen.thickness = 0;
    btnFullScreen.image.shadowBlur = 5;
    btnFullScreen.image.paddingTop = "5px";
    btnFullScreen.image.paddingBottom = "5px";
    btnFullScreen.image.paddingLeft = "5px";
    btnFullScreen.image.paddingRight = "5px";

    //Adding observables to the button
    //on pointer up
    btnFullScreen.onPointerUpObservable.add(() => {
        if (!engine.isFullscreen){
            engine.enterFullscreen();
            btnFullScreen.image.source = "../../../assets/gui/undo.png";
        }
        else{
            engine.exitFullscreen();
            btnFullScreen.image.source = "../../../assets/gui/expand.png";
        }                
    });
    //on pointer enter
    btnFullScreen.onPointerEnterObservable.add(() => {
        if (!engine.isFullscreen){
            btnFullScreen.image.source = "../../../assets/gui/expand.png";
        }
        else{
            btnFullScreen.image.source = "../../../assets/gui/undo.png";
        }                
    });


//Attaching the control to the grid on row #3 and column #3 cell
btnFullScreen.zIndex = 550;
gridEntrada.addControl(btnFullScreen,3,3);

//A. Feedback com informações sobre os tempos sorteados
var txtFeedback = new BABYLON.GUI.TextBlock();
// txtFeedback.text = "⏱ Duração";
txtFeedback.color = "white";
txtFeedback.fontSize = 50;

txtFeedback.top = "-275px";
// txtFeedback.left = "0px";
// txtFeedback.width = "150px";
// txtFeedback.height = "50px";

// gridResposta.addControl(txtFeedback); 

// Pontuação com informações sobre os tempos sorteados
var txtFeedback = new BABYLON.GUI.TextBlock();
txtFeedback.text = "⏱ Duração";
txtFeedback.color = "white";
txtFeedback.fontSize = 50;

txtFeedback.top = "-275px";
// txtFeedback.left = "0px";
// txtFeedback.width = "150px";
// txtFeedback.height = "50px";

// gridResposta.addControl(txtFeedback); 

//B. Entrada de resposta por click em botão
var btnClick = BABYLON.GUI.Button.CreateSimpleButton("botão", "🖱 Click");
// btnClick.top = "150px";
btnClick.left = "245px";
btnClick.width = "150px";
btnClick.height = "60px";
btnClick.cornerRadius = 15;
btnClick.thickness = 3;
btnClick.children[0].color = "white";
btnClick.children[0].fontSize = 20;
btnClick.color = "white";
btnClick.background = "black";
btnClick.alpha = 0.7;

btnClick.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

var clicks = 0;
btnClick.onPointerClickObservable.add(function () {
    clicks++;
    if (clicks % 2 == 0) {
        btnClick.background = "red";
    } else {
        btnClick.background = "green";
    }
    btnClick.children[0].text = clicks + "\nsegundos";
});

btnClick.zIndex = 10;
// gridEntrada.addControl(btnClick);   

//C. Campo para o jogador informar a resposta
var input = new BABYLON.GUI.InputText("entrada", "⌨ Digite aqui");
input.left = "400px";
input.width = "150px";
input.height = "60px";
// input.thickness = 3;
// input.text.color = "white";
// input.text.fontSize = 40;
input.color = "white";
input.background = "black";
input.alpha = 0.7;

input.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
// input.horizontalAlignment = 0;
// input.verticalAlignment = 1

// input.horizontalAlignment
// input.width = 0.1;
// input.maxWidth = 0.2;

input.onPointerClickObservable.add(function () {
    // input.background = "blue";
    input.text = ""; // if clicou, então apaga o texto
});

input.zIndex = 10;
// gridEntrada.addControl(input);    

//D. Teclado virtual para entrada de dados do jogador
var keyboard = BABYLON.GUI.VirtualKeyboard.CreateDefaultLayout();
keyboard.top = "-100px";
keyboard.left = "400px";
keyboard.fontSize = 20;
keyboard.color = "white";
// keyboard.background = "black";
keyboard.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
// keyboard.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
// keyboard.horizontalAlignment = 1;
// keyboard.verticalAlignment = 0;
// keyboard.alpha = 0.6;

// gridEntrada.addControl(keyboard);
keyboard.connect(input);

// H. Botão Falar
var btnFalar = BABYLON.GUI.Button.CreateSimpleButton("falar", "🗣 FALAR");
// Button_Falar.top = "-150px";
// Button_Falar.bottom = "150px";
btnFalar.left = "555px";
btnFalar.width = "150px";
btnFalar.height = "60px";
btnFalar.cornerRadius = 15;
btnFalar.thickness = 3;
btnFalar.children[0].color = "white";
btnFalar.fontSize = 25;
// btnFalar.fontFamily = "Segoe UI"
btnFalar.color = "white";
btnFalar.background = "black";
btnFalar.alpha = 0.7;
btnFalar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;     
      
btnFalar.zIndex = 10;
// gridEntrada.addControl(btnFalar);

btnFalar.onPointerUpObservable.add(function () {
    reconheceFala();
    
    btnFalar.children[0].text = ">> INICIOU <<";
    txtFeedback.text = "Aguardando resposta...";
    console.log('Aguardando resposta...');

    clicks++;

    btnFalar.isEnabled = false;
});

//E. Barra superior
var barraSuperior = new BABYLON.GUI.StackPanel();
barraSuperior.isVertical = false;
barraSuperior.background = "black"; 
barraSuperior.alpha = 0.3;
barraSuperior.horizontalAlignment = 1;
barraSuperior.verticalAlignment = 0;
barraSuperior.width = "100%";
barraSuperior.height = "60px";

gridTela.addControl(barraSuperior);

// F. Barra inferior
var barraInferior = new BABYLON.GUI.StackPanel();
barraInferior.isVertical = false;
barraInferior.background = "black"; 
barraInferior.alpha = 0.3;
barraInferior.horizontalAlignment = 0;
barraInferior.verticalAlignment = 1;
barraInferior.width = "100%";
barraInferior.height = "60px";

gridTela.addControl(barraInferior);

// G. Pontuação e tentativas
var txtStatusJob = new BABYLON.GUI.TextBlock();
txtStatusJob.text = "Recompensa: 🥇"; 
txtStatusJob.fontSize = 20;
txtStatusJob.fontFamily = "Segoe UI"
txtStatusJob.height = "60px";
txtStatusJob.width = "30%";
txtStatusJob.top = 0;
txtStatusJob.color = "white";
txtStatusJob.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
txtStatusJob.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

gridResposta.addControl(txtStatusJob);

// I. Gabarito da tarefa
var txtGabarito = new BABYLON.GUI.TextBlock();
txtGabarito.text = "Instruções"; // # add variáveis
txtGabarito.fontSize = 20;
txtGabarito.height = "60px";
txtGabarito.width = "30%";
txtGabarito.top = 0;
txtGabarito.right = 0;
txtGabarito.color = "white";
txtGabarito.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
txtGabarito.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

// gridResposta.addControl(txtGabarito);// # Não exibir para o jogador
  
// J. Local da Resposta do Player
var txtResposta = new BABYLON.GUI.TextBlock();
// txtResposta.text = "Em algum lugar do cosmo";
txtResposta.fontSize = 40;
txtResposta.fontFamily = "Segoe UI"
txtResposta.height = "60px";
txtResposta.top = "0px";
txtResposta.color = "white";
txtResposta.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
txtResposta.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

gridResposta.addControl(txtResposta);

// Botão seta para esquerda
var btnLeft = BABYLON.GUI.Button.CreateImageOnlyButton("esquerda", "../../../assets/gui/leftButton.png");
btnLeft.width = "55px";
btnLeft.height = "55px";
btnLeft.thickness = 0;
btnLeft.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
btnLeft.onPointerClickObservable.add(() => { 
    // if (leftBtn) {
    // // Executa vídeo de abertura
    //     document.write("<video src='assets/videos/abertura.mp4' autoplay='true' width='100%' height='100%'");
    //     console.log("apertou esquerda");
    //     leftBtn = 0;
    // }
});

// gridEntrada.addControl(btnLeft);    
 

// Botão seta para direita
var btnRight = BABYLON.GUI.Button.CreateImageOnlyButton("direita", "../../../assets/gui/rightButton.png");
btnRight.width = "55px";
btnRight.height = "55px";
btnRight.thickness = 0;
btnRight.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
// rightBtn.onPointerClickObservable.add(() => { 
  //     if (acceptInput) {
    //         updateWeaponsPosition("right");
    //     }
    // });
    
// gridTela.addControl(btnRight);  

// Botão que habilita a interação do usuário com a interface gráfica
// var btnExibeGUI = BABYLON.GUI.Button.CreateImageOnlyButton("ativar", "../../../assets/gui/exibirGui.png");
// btnExibeGUI.width = "130px";
// btnExibeGUI.height = "55px";
// btnExibeGUI.thickness = 0;
// btnExibeGUI.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
// btnExibeGUI.horizontalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

// btnExibeGUI.zIndex = 150;  
// userInterface.addControl(btnExibeGUI); 

var gui_ativado = true;
// btnExibeGUI.onPointerClickObservable.add(() => {
    if(gui_ativado){
      gridTela.isVisible = false;
      gridEntrada.isVisible = false;
      gridResposta.isVisible = false;
      gridTeclado.isVisible = false;

      gui_ativado = false;
    }
    else{
      gridTela.isVisible = true;
      gridEntrada.isVisible = true;
      gridResposta.isVisible = true;
      gridTeclado.isVisible = true;
      
      gui_ativado = true;
    }
      console.log("GUI Ativado: ", gui_ativado);
  // });

  

// Zoom no orb
// zoomIn(camera, sphereSpark, 120);

// createOrb();

// Girar o cenário rapidamente e dá um zoomIN na tarefa 
// zoomIn(camera, sphere, 60);
    
//# Passear pelo cenário rapidamente e dá um zoomOUT no ambiente 
// zoomOut(camera, sphere, 60); // # ajustar o angulo do zoom out


// Permite distanciar a camera (Funciona com camera ArcRotateCamera)
// camera.setPosition(new BABYLON.Vector3(100, 25, 10)); // Vista diagonal próxima
// camera.setPosition(new BABYLON.Vector3(0, 35, 250)); // Vista diagonal distante
// camera.setPosition(new BABYLON.Vector3(0, 150, 10)); // Vista superior

 // Adiciona algum elemento 3d
//  var elemento = BABYLON.SceneLoader.ImportMesh(null, 'model/', 'elemento_Azul.glb', scene, (meshes) => {
//   // 3D assets are loaded, now load nav mesh
//   var elemento_mesh = meshes[0];
//   elemento_mesh.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
//   elemento_mesh.position = new BABYLON.Vector3(0, 0, 0);
//  });

// Exibe o nº do asteóride atual
var num_Asteroid = 1;
var qtd_Asteroide = 3 // Número de trilhas

var distancia = 500; // Ponto de partida inicial do asteroide
// Intervalo de tempo a ser estimado
var minTime = 1;
var maxTime = 10;

// Sorteia a duração dentro do intervalo 2 a 10
var duration;
duration = Math.floor((Math.random(distancia)*maxTime) + minTime);

// Botão que inicia a execução do estímulo
var btnEstimulo = BABYLON.GUI.Button.CreateImageOnlyButton("ativar", "../../../assets/gui/iniciaEstimulo.png");
btnEstimulo.width = "130px";
btnEstimulo.height = "55px";
btnEstimulo.thickness = 0;
btnEstimulo.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

btnEstimulo.zIndex = 150;
userInterface.addControl(btnEstimulo); 

btnEstimulo.onPointerClickObservable.add(function() {
    btnEstimulo.isVisible = false;
    gui_ativado = false;
    // for(var i=1; i<=qtd_Asteroide; i++){
      executaTrilha();
      // console.log("Trilha ", i, " iniciada!");
      console.log("Trilha iniciada!");
    // }
    // Serializar a cena para uma string JSON
// var serializedScene = BABYLON.SceneSerializer.Serialize(scene);

// Descartar a cena original
// scene.dispose();
 });

  // Vetor para armazenar as respostas dadas pelo jogador
  var respostas = new Array(qtd_Asteroide);

  // Vetor para armazenar os tempos dos estímulos
  var gabarito = new Array(qtd_Asteroide);

// Executa o estímulo da tarefa 
function executaTrilha() {
  txtStatusJob.text = ("🌑 Asteroide: " + num_Asteroid + '/' + qtd_Asteroide);
  console.log('🌑 Trilha: ' + num_Asteroid + '/' + qtd_Asteroide);
  // Dispara cronômetro
  // console.time(); 
  // Armazenar o tempo de início
  var startTime = Date.now()

  // // 1º Feedback do comando
  // textblock_Feedback.text = ("👀 Observe a colisão");
  // Exibe o tempo da animação
  var elapsedTime = 0
  elapsedTime = Date.now() - startTime
  txtGabarito.text = ("⏱ Tempo: " + formatTime(elapsedTime)) // # Não exibir para o jogador
  console.log('⏱ Tempo: ' + formatTime(elapsedTime))

  // Armazena a duração do estímulo
  gabarito.push(elapsedTime); 

  // Inicia percurso a partir da duração sorteada
  scene.registerBeforeRender(function () {
    // 1º Feedback do comando
    // txtFeedback.text = ("👀 Observe a colisão") 

    sphere.position.x = points[distancia].x
    sphere.position.z = points[distancia].z
    // console.log(i);
    // linha.scaling.x +=0.01;
    // linha.scaling.y +=0.01;
    // linha.scaling.z +=0.01;
    distancia = (distancia - 1)

    if (distancia < 1) { // "Colidiu" com o Sol
      // sleep2(500); // ok
      // Exibe o numero do asteoride atual
      txtStatusJob.text = ("🌑 Asteroide: " + ++num_Asteroid + '/' + qtd_Asteroide)
      console.log('🌑 Trilha: ' + num_Asteroid + '/' + qtd_Asteroide)

      // Exibe o tempo da animação
      elapsedTime = Date.now() - startTime
      txtGabarito.text = ("⏱ Tempo: " + formatTime(elapsedTime))
      console.log('⏱ Tempo: ' + formatTime(elapsedTime))

      gui_ativado = true;
      
      if(!gui_ativado){
        gridTela.isVisible = false;
        gridEntrada.isVisible = false;
        gridResposta.isVisible = false;
        gridTeclado.isVisible = false;
  
        // gui_ativado = true;
      }
      else{
        gridTela.isVisible = true;
        gridEntrada.isVisible = true;
        gridResposta.isVisible = true;
        gridTeclado.isVisible = true;
        
        // gui_ativado = false;
      }
      console.log("GUI Ativado: ", gui_ativado);

      // Verifica se acertou
      btn1.onPointerUpObservable.add(() => {
        // btn1.image.source = "../../../assets/gui/0.png";
          if(formatTime(elapsedTime) == 1){
              console.log("1: Acertou");
          }
          else{
              console.log("1: Errou");
          }  
          
          // Armazena tempo informado pelo jogador
          respostas[num_Asteroid] = 1;
          // respostas.push(1);
      });

      // Verifica se acertou
      btn2.onPointerUpObservable.add(() => {
        // btn1.image.source = "../../../assets/gui/0.png";
          if(formatTime(elapsedTime) == 2){
              console.log("2: Acertou");
          }
          else{
              console.log("2: Errou");
          }
          
          respostas[num_Asteroid] = 2;
          // respostas.push(2);
      });

      // Verifica se acertou
      btn3.onPointerUpObservable.add(() => {
        // btn1.image.source = "../../../assets/gui/0.png";
          if(formatTime(elapsedTime) == 3){
              console.log("3: Acertou");
          }
          else{
              console.log("3: Errou");
          }   
          
          respostas[num_Asteroid] = 3;
      });

      // Verifica se acertou
      btn4.onPointerUpObservable.add(() => {
        // btn1.image.source = "../../../assets/gui/0.png";
          if(formatTime(elapsedTime) == 4){
              console.log("4: Acertou");
          }
          else{
              console.log("4: Errou");
          }   
          
          respostas[num_Asteroid] = 4;
      });

      // Verifica se acertou
      btn5.onPointerUpObservable.add(() => {
        // btn1.image.source = "../../../assets/gui/0.png";
          if(formatTime(elapsedTime) == 5){
              console.log("5: Acertou");
          }
          else{
              console.log("5: Errou");
          }
          
          respostas[num_Asteroid] = 5;
      });

      // Verifica se acertou
      btn6.onPointerUpObservable.add(() => {
        // btn1.image.source = "../../../assets/gui/0.png";
          if(formatTime(elapsedTime) == 6){
              console.log("6: Acertou");
          }
          else{
              console.log("6: Errou");
          }            
          
          respostas[num_Asteroid] = 6;
      });

      // Verifica se acertou
      btn7.onPointerUpObservable.add(() => {
        // btn1.image.source = "../../../assets/gui/0.png";
          if(formatTime(elapsedTime) == 7){
              console.log("7: Acertou");
          }
          else{
              console.log("7: Errou");
          }      
          
          respostas[num_Asteroid] = 7;
      });

      // Verifica se acertou
      btn8.onPointerUpObservable.add(() => {
        // btn1.image.source = "../../../assets/gui/0.png";
          if(formatTime(elapsedTime) == 8){
              console.log("8: Acertou");
          }
          else{
              console.log("8: Errou");
          } 
          
          respostas[num_Asteroid] = 8;
      });

      // Verifica se acertou
      btn9.onPointerUpObservable.add(() => {
        // btn1.image.source = "../../../assets/gui/0.png";
          if(formatTime(elapsedTime) == 9){
              console.log("9: Acertou");
          }
          else{
              console.log("9: Errou");
          }    
          
          respostas[num_Asteroid] = 9;
      });

      // Verifica se acertou
      btn10.onPointerUpObservable.add(() => {
        // btn1.image.source = "../../../assets/gui/0.png";
          if(formatTime(elapsedTime) == 10){
              console.log("10: Acertou");
          }
          else{
              console.log("10: Errou");
          }       
          
          respostas[num_Asteroid] = 10;
      });

      
      // # Exfeito de explosão, fogo, e destruição
      if (som_Efeitos) {
        colisao = new BABYLON.Sound('colisao', './audio/colisao.wav', scene, null, {
          loop: false,
          autoplay: true,
        })

        if (num_Asteroid == 10) {
          explosao = new BABYLON.Sound('explosao', './audio/explosao.mp3', scene, null, {
            loop: false,
            autoplay: true,
          })
        }
      }

      
     

    sleep2(1000); // ok
    
    // engine.runRenderLoop(function () {
    //     scene.render();
    // });


      // Sorteia a posição onde o asteróide iniciará o percurso
      // distancia = Math.floor(Math.random(1000) * 1000)
      distancia = Math.floor(Math.random(500) * 500)
      // distancia = 250; // 4 segundos?
      // distancia = 200; // 3 segundos
      // distancia = 150; // 2 segundos

      // Sorteia um novo tamanho para o asteroide
      // diameter = Math.floor(Math.random(100) * 100)
      // console.log("Diâmetro: ", diameter)

      // 2º Feedback do comando
      // txtFeedback.text = ("⏱ Quanto tempo?")

      // Captura resposta do jogador
      // txtResposta.text = ">> (((((👂🏼))))) <<"



      btnFalar.children[0].text = ">> INICIOU <<"
      txtFeedback.text = "Aguardando resposta..."
      console.log('Aguardando resposta...')

      // reconheceFala();
      btnFalar.isEnabled = false

      // Reexibe o botão do estímulo
      btnEstimulo.isVisible = true;

      // # sobrecarrega por colocar várias vezes?????
      // userInterface.addControl(input)
      // userInterface.addControl(keyboard)
      // userInterface.addControl(btnClick)

      // sleep1(5000); 
      // sleep2(5000); // ok
      // speechSynthesis.speak(new SpeechSynthesisUtterance('Outro asteroide está se aproximando...!'));
      //   console.log('Outro asteroide está se aproximando...!');
      
      // gui_ativado = false;

      // Reseta cronômetro
      startTime = Date.now()
      console.clear();
    };
  })
  gui_ativado = false;
}

// asteroide.dispose();


// // Função para formatar o tempo em minutos e segundos
// function formatTime(time) {
//   var minutes = Math.floor(time / 60000);
//   var seconds = Math.floor((time % 60000) / 1000);
//   return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
// }

// Função para formatar o tempo em minutos e segundos
function formatTime(time) {
  // var minutes = Math.floor(time / 60000);
  var seconds = Math.floor((time % 60000) / 1000);
  // return (seconds < 10 ? "0" : "") + seconds;
  return seconds;
}

// Gerar vários asteróides rotacionando
var sphere = variosAsteroides();

// Loading screen
      // const loadingScreen = document.getElementById('loading-screen')
      // loadingScreen.classList.add('fade-out')
      // loadingScreen.addEventListener('transitionend', onTransitionEnd)

 // Sounds
  // Checkbox opção de som ou mudo
  if(som_Ambiente){ //# abaixar o volume
      trilha = new BABYLON.Sound('trilha', './audio/Ambiente_Tenso_01.mp3', scene, null,{
        loop: true,
        autoplay: true,
      })
  }

// Game setup
    window.addEventListener('resize', onWindowResize, false)

    const intro = document.getElementById('intro')
    var executando = true;
    
    // intro.addEventListener(
    //   'click',
    //   () => {
    //     // if (BABYLON.Engine.audioEngine) {
    //     //   BABYLON.Engine.audioEngine.unlock()
    //     // }
        
    //     // # Executar blip
    //     // # Executar trilha

    //     // controls.connect();

    //     intro.classList.add('hidden'); 
    //     executando = true;       
    //     // animate(executando); // tentar resetar a animação
    //     console.log("Jogo rodando");
        
    //     // alert("Quanto tempo?");
    //   },
    //   false
    // )

    time = new YUKA.Time()

function variosAsteroides() {
  // Material dos asteróides
  var url = "http://jerome.bousquie.fr/BJS/images/rock.jpg" // baixar e usar offline
  var mat = new BABYLON.StandardMaterial("mat1", scene)
  var texture = new BABYLON.Texture(url, scene)
  mat.diffuseTexture = texture
  mat.backFaceCulling = false

  //
  var fact = 1300 // density (diminuindo aumenta o tamanho do asteróid)
  var scaleX = 0.0
  var scaleY = 0.0
  var scaleZ = 0.0
  var grey = 0.0

  // custom vertex function
  var myVertexFunction = function (particle, vertex, i) {
    vertex.x *= (Math.random() + 1)
    vertex.y *= (Math.random() + 1)
    vertex.z *= (Math.random() + 1)
  }

  // Posição do asteróide
  var myPositionFunction = function (particle, i, s) {
    scaleX = Math.random() * 2 + 0.8
    scaleY = Math.random() + 0.8
    scaleZ = Math.random() * 2 + 0.8
    particle.scale.x = scaleX
    particle.scale.y = scaleY
    particle.scale.z = scaleZ
    particle.position.x = (Math.random() - 0.5) * fact
    particle.position.y = (Math.random() - 0.5) * fact
    particle.position.z = (Math.random() - 0.5) * fact
    particle.rotation.x = Math.random() * 3.5
    particle.rotation.y = Math.random() * 3.5
    particle.rotation.z = Math.random() * 3.5
    grey = 1.0 - Math.random() * 0.3
    particle.color = new BABYLON.Color4(grey, grey, grey, 1)
  }

  // Cria o sistema de particulas: Immutável
  var SPS = new BABYLON.SolidParticleSystem('SPS', scene, { updatable: false })
  var sphere = BABYLON.MeshBuilder.CreateSphere("s", { diameter: 15, segments: 8 }, scene)

  // Quantidade de asteróides
  SPS.addShape(sphere, 25, { positionFunction: myPositionFunction, vertexFunction: myVertexFunction })
  var mesh = SPS.buildMesh()
  mesh.material = mat
  // destrói o modelo
  sphere.dispose()

  // Animação dos asteróides
  var k = Date.now()
  scene.registerBeforeRender(function () {
    SPS.mesh.rotation.y += 0.001 // Velocidade de rotação dos asteróides
    SPS.mesh.position.y = Math.sin((k - Date.now()) / 1000) * 2
    k += 0.07
  })
  return sphere;
}

// Permite dar zoom no cenário
function zoomIn(cam, tar, duration) {
  var targetEndPos = tar.getAbsolutePosition();
  var speed = 1;
  var ease = new BABYLON.CubicEase();
  tar.computeWorldMatrix();
  var matrix = tar.getWorldMatrix(true);
  var local_position = new BABYLON.Vector3(0,-10,-15);
  local_position.addInPlace(new BABYLON.Vector3(0, -2, -10));
  var global_position = BABYLON.Vector3.TransformCoordinates(local_position, matrix);
  // console.log(global_position);
  
  BABYLON.Animation.CreateAndStartAnimation('at4', cam, 'position', speed, duration, cam.position, global_position, 0, ease);
  BABYLON.Animation.CreateAndStartAnimation('at5', cam, 'target', speed, duration, cam.target, targetEndPos, 0, ease);
};

function zoomOut(cam, tar, duration) {
  var targetEndPos = tar.getAbsolutePosition();
  var speed = 25;
  var ease = new BABYLON.CubicEase();
  tar.computeWorldMatrix();
  var matrix = tar.getWorldMatrix(true);
  var local_position = new BABYLON.Vector3(0,0,0);
  local_position.addInPlace(new BABYLON.Vector3(0, 0, -80));
  var global_position = BABYLON.Vector3.TransformCoordinates(local_position, matrix);
  // console.log(global_position);
  
  BABYLON.Animation.CreateAndStartAnimation('at4', cam, 'position', speed, duration, cam.position, global_position, 0, ease);
  BABYLON.Animation.CreateAndStartAnimation('at5', cam, 'target', speed, duration, cam.target, targetEndPos, 0, ease);
};


// # Testar
// Permite interagir enquanto pausado
function sleep1(milliseconds) {
  setTimeout(() => { console.log("Pausado por um tempo..."); }, milliseconds);
}

// # Testar
// Não permite interagir enquanto pausado
function sleep2(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  console.log("Pausado por um tempo...");
  do {
      currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// Reconhece o fala o jogador
function reconheceFala() {
  if ("webkitSpeechRecognition" in window) {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
  } else {
    console.log("Seu navegador não possui o Speech Recognition! (Utilize o Chrome ou Edge)");
  }
  
  //   const speechRecognitionList = new webkitSpeechGrammarList();
  //   speechRecognitionList.addFromString(grammar, 1);
  //   recognition.grammars = speechRecognitionList;

  recognition.interimResults = true; // Resultados intermediários
  recognition.lang = "pt-BR";
  recognition.continuous = true; // Escuta contínua
  recognition.maxAlternatives = 1;
  
  // Inicia o reconhecimento
  recognition.start();
  
  //   speechSynthesis.speak(new SpeechSynthesisUtterance('Fale agora!')); 
  
  // colocar meio segundo de espera (sleep)

//A
  // Exibe o resultado reconhecido
  // recognition.onresult = function (event) {
  //     console.log(event.results[0]);
  //     var elemento = event.results[0][0].transcript;
      
  //     // quebrar (strip) a string elemento em varias (de acordo com a qtd de elementos sorteados), usando '.' OU ',' OU ' ' como separador

  //     console.log('Elemento: ' + elemento);
  //     // console.log('Elemento: ' + elemento[0]);
  //     // console.log('Elemento: ' + elemento[1]);
  //     // console.log('Elemento: ' + elemento[0][0]);
  //     textblock_Resposta.text = elemento.toUpperCase();       
  // };

//A2
// Quando falar no microfone
recognition.onresult = function(event) {
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      // Transcreve o que foi falado
      var content = event.results[i][0].transcript.trim();
      txtResposta.text = content.toUpperCase(); 

      // Reproduz o que foi transcrito
      var u = new SpeechSynthesisUtterance();
      u.text = content;
      u.lang = 'pt-BR';
      u.rate = 1.2; // Quanto maior, mais rápido (0.1 .... 10)
      u.pitch = 2; // Quanto menor, mais grave (0, 1, 2)
      u.onend = console.log('Saída: ', content);
      // speechSynthesis.speak(u);
      // u.getVoices;
      // u.volume = 1000;
      // console.log(u.elapsedTime);

      // speechSynthesis.speak(new SpeechSynthesisUtterance('Outro asteroide está se aproximando...!'));
      // console.log('Outro asteroide está se aproximando...!');
    }
  }
};

  // Finaliza o reconhecimento
  recognition.onspeechend = function () {
      recognition.stop();
      console.log("Reconhecimento finalizado.");
      btnFalar.isEnabled = true;
      btnFalar.children[0].text = ">> COMEÇAR <<";
      txtResposta.text = ">> SUA RESPOSTA <<";
  };

  // Caso o que reconheça bata com os elementos sorteados
  recognition.onmatch = function () {
      // # incrementar a pontuação

      txtResposta.text = "Parabéns!";     
      // # add síntese de voz
      // # add alerta sonoro 
      console.log("Muito bem! Você conseguiu!!");
      btnFalar.children[0].text = elemento.toUpperCase();
  };


  // Caso não reconheça o que foi pronunciado
  recognition.onnomatch = function () {
      txtResposta.text = "Palavra desconhecida!";     
      // # add síntese de voz
      // # add alerta sonoro 
      console.log("Não entendi o que falou.");
      btnFalar.children[0].text = "Tentar novamente!";
  };

  recognition.onerror = function (event) {
      console.log("Ocorreu um erro no reconhecimento: " + event.error);
      btnFalar.isEnabled = true;
      btnFalar.children[0].text = "Tentar novamente!";
      txtResposta.text = ">> SUA RESPOSTA <<";
  };
  return recognition;
}



//------------------------------- Animação dos elementos- --------------------------------
    // scene.registerBeforeRender(function (){
        
    
        // zoomIn(camera, sphere, 600); // Fica seguindo o asteróid
        // zoomOut(camera, sphere, 20); // Fica seguindo o asteróid
        
        // Rotação
        // box.rotation.x += 0.001;
        // box.rotation.y += 0.001;
        // box.rotation.z += 0.001;

        // anima_Rotaciona(box, velocidade);

        // Translação
        // sphere.position.x = 4*Math.cos(alpha);
        // // asteroide.position.y = 1.0;
        // asteroide.position.z = 2*Math.sin(alpha);

        // anima_Desloca(box, velocidade);

        // Escalamento
        // sphere.scaling.x += 10*Math.cos(alpha);
        // asteroide.scaling.y = 1.0;
        // asteroide.scaling.z = 10*Math.sin(alpha);

        // anima_Tamanho(box, velocidade);


        // alpha += 0.3 * scene.getAnimationRatio();
    // })
    
  // scene.render();


// Teclado virtual com mão. O usuário pode clicar em um botão na tela usando o dedo 
// enquanto uma imagem da webcam é usada para criar um cursor virtual controlado por 
// detecção de mãos do MediaPipeJS. Quando o cursor virtual está dentro da área do botão, 
// sua cor muda para vermelho e o evento OnPointerOverTrigger é acionado. 
// Quando o usuário clica no botão, o evento OnPickTrigger é acionado

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
      var handLandmarks = results.multiHandLandmarks[0]
      if (handLandmarks) {
        var indexFinger = handLandmarks[8]
        var x = indexFinger.x * video.clientWidth - canvas.width / 2
        var y = -indexFinger.y * video.clientHeight + canvas.height / 2
        cursor.position.x = x
        cursor.position.y = y

        // Verificar se o cursor virtual está dentro da área do botão
        var buttonWidth = 200
        var buttonHeight = 100
        var buttonPosX = canvas.width / 2 - buttonWidth / 2
        var buttonPosY = -canvas.height / 2 + buttonHeight / 2
        if (x > buttonPosX && x < buttonPosX + buttonWidth
          && y > buttonPosY && y < buttonPosY + buttonHeight) {
          cursorMat.emissiveColor = new BABYLON.Color3(1, 0, 0)
          if (button.actionManager) {
            button.actionManager.processTrigger(BABYLON.ActionManager.OnPointerOverTrigger)
            if (buttonPressed) {
              button.actionManager.processTrigger(BABYLON.ActionManager.OnPickTrigger)
            }
          }
        } else {
          cursorMat.emissiveColor = new BABYLON.Color3(0, 1, 0)
        }
      }
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

  // }


function onWindowResize() {
  engine.resize()
}

function animate(executando) {
  if(executando){
    requestAnimationFrame(animate)
    // const delta = time.update().getDelta() // Só se tivesse o player para se mover
    scene.render()
  }
  // if(!executando){
  //   cancelAnimationFrame(animate); // # ta pausando demais
  // }
}

function syncCamera(entity, renderComponent) {
  renderComponent.getViewMatrix().copyFrom(BABYLON.Matrix.FromValues(...entity.worldMatrix.elements).invert())
}

function onTransitionEnd(event) {
  event.target.remove()
}
