import * as YUKA from '../../../../lib/yuka.module.js'
import 'https://preview.babylonjs.com/babylon.js'
import 'https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js'
import 'https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js'

import 'https://preview.babylonjs.com/gui/babylon.gui.min.js'

import { FirstPersonControls } from './src/FirstPersonControls.js'
import { Player } from './src/Player.js'


let engine, scene, camera, trilha
let entityManager, time, controls

var som_Ambiente = false; // checkbox
var som_Efeitos = true; // checkbox
var explosao, colisao;

init()


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

  camera = new BABYLON.ArcRotateCamera("camera", -90/180*Math.PI, 45/180*Math.PI, Math.PI, new BABYLON.Vector3(0, 40, -70), scene);
  // camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 0, -20), scene, true)
  camera.minZ = 100;
// camera.maxZ = 20000;
// camera.detachControl(canvas);
  camera.attachControl(canvas);
  camera.lowerRadiusLimit = 250.5;
  camera.upperRadiusLimit = 150;
  camera.pinchDeltaPercentage = 2.01;
  camera.wheelDeltaPercentage = 20.01;

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

//---------------------------------- Interface do Usuário ---------------------------------
var interface_user = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
// interface_user.renderScale = 1; // não alterou nada
// interface_user.useRealisticScaling = true;// // não alterou nada
    
//# TESTAR ESSAS 3 LINHAS!!!
//This adds some parameters towards how the GUI will display on resize.
    //Explanations will be part of lesson #3 
    // interface_user.idealWidth = 800;
    // interface_user.idealHeight = 900;
    // interface_user.useSmallestIdeal = true;



//# TESTAR ESSAS GRADE !!!
    /////////// GUI 2D GRID ////////////////

// Creating a grid to split the advancedTexture layer into cells of a defined and remaining size.
// The parameter 'true' fixes the size of the row or column, expressed in pixels (relative to the window/advancedTexture FS size).
// Rows and columns without parameter 'true' will use the BJS value (where 1 is equal to 100%) and will simply fill-in the remaining space.
var grid = new BABYLON.GUI.Grid();
grid.addColumnDefinition(128,true);
grid.addColumnDefinition(384,true);
grid.addColumnDefinition(1);
grid.addColumnDefinition(80,true);

grid.addRowDefinition(128,true);
grid.addRowDefinition(1);
grid.addRowDefinition(80,true);

//Adding our grid to the advancedTexture layer. 
//Before this step, the grid does not show and you cannot interact with it.
interface_user.addControl(grid);


// Botão fullscreen
// A  button added to the far right bottom grid cell (row #3, column #3)
var btnfs = BABYLON.GUI.Button.CreateImageOnlyButton("btnfs", "https://dl.dropbox.com/s/elhq6yfwr9p7dmf/expand.png");
    btnfs.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    btnfs.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    btnfs.width = '64px';   
    btnfs.height = '64px';
    btnfs.background = "transparent";
    btnfs.thickness = 0;
    btnfs.image.shadowBlur = 5;
    btnfs.image.paddingTop = "5px";
    btnfs.image.paddingBottom = "5px";
    btnfs.image.paddingLeft = "5px";
    btnfs.image.paddingRight = "5px";

    //Adding observables to the button
    //on pointer up
    btnfs.onPointerUpObservable.add(() => {
        if (!engine.isFullscreen){
            engine.enterFullscreen();
            btnfs.image.source = "textures/icons/Undo.png";
        }
        else{
            engine.exitFullscreen();
            btnfs.image.source = "https://dl.dropbox.com/s/elhq6yfwr9p7dmf/expand.png";
        }                
    });
    //on pointer enter
    btnfs.onPointerEnterObservable.add(() => {
        if (!engine.isFullscreen){
            btnfs.image.source = "https://dl.dropbox.com/s/elhq6yfwr9p7dmf/expand.png";
        }
        else{
            btnfs.image.source = "textures/icons/Undo.png";
        }                
    });

//Attaching the control to the grid on row #3 and column #3 cell
grid.addControl(btnfs,3,3);

//A. Feedback com informações sobre os tempos sorteados
var textblock_Feedback = new BABYLON.GUI.TextBlock();
textblock_Feedback.text = "⏱ Duração";
textblock_Feedback.color = "white";
textblock_Feedback.fontSize = 50;

textblock_Feedback.top = "-275px";
// textblock_Feedback.left = "0px";
// textblock_Feedback.width = "150px";
// textblock_Feedback.height = "50px";


//B. Entrada de resposta por click em botão
var button_Click = BABYLON.GUI.Button.CreateSimpleButton("botão", "🖱 Click");
// button_Click.top = "150px";
button_Click.left = "245px";
button_Click.width = "150px";
button_Click.height = "60px";
button_Click.cornerRadius = 15;
button_Click.thickness = 3;
button_Click.children[0].color = "white";
button_Click.children[0].fontSize = 20;
button_Click.color = "white";
button_Click.background = "black";
button_Click.alpha = 0.7;

button_Click.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

var clicks = 0;
button_Click.onPointerClickObservable.add(function () {
    clicks++;
    if (clicks % 2 == 0) {
        button_Click.background = "red";
    } else {
        button_Click.background = "green";
    }
    button_Click.children[0].text = clicks + "\nsegundos";
});


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

keyboard.connect(input);

// H. Botão Falar
var Button_Falar = BABYLON.GUI.Button.CreateSimpleButton("falar", "🗣 FALAR");
// Button_Falar.top = "-150px";
// Button_Falar.bottom = "150px";
Button_Falar.left = "555px";
Button_Falar.width = "150px";
Button_Falar.height = "60px";
Button_Falar.cornerRadius = 15;
Button_Falar.thickness = 3;
Button_Falar.children[0].color = "white";
Button_Falar.fontSize = 25;
// Button_Falar.fontFamily = "Segoe UI"
Button_Falar.color = "white";
Button_Falar.background = "black";
Button_Falar.alpha = 0.7;
Button_Falar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

Button_Falar.onPointerUpObservable.add(function () {
    reconheceFala();
    
    Button_Falar.children[0].text = ">> INICIOU <<";
    textblock_Feedback.text = "Aguardando resposta...";
    console.log('Aguardando resposta...');

    clicks++;

    textblock_Pontos.text = "Pontuação: " + clicks + "\n Tentativas restantes: 2/3"; // # add a variavel aqui

    Button_Falar.isEnabled = false;
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


// F. Barra inferior
var barraInferior = new BABYLON.GUI.StackPanel();
barraInferior.isVertical = false;
barraInferior.background = "black"; 
barraInferior.alpha = 0.3;
barraInferior.horizontalAlignment = 0;
barraInferior.verticalAlignment = 1;
barraInferior.width = "100%";
barraInferior.height = "60px";

// G. Pontuação e tentativas
var textblock_StatusJob = new BABYLON.GUI.TextBlock();
textblock_StatusJob.text = "Acertos: 4 | Erros: 2\nAsteróide: 6/10"; // # add a variável da tentativa 1/3, 2/3...
textblock_StatusJob.fontSize = 20;
textblock_StatusJob.fontFamily = "Segoe UI"
textblock_StatusJob.height = "60px";
textblock_StatusJob.width = "30%";
textblock_StatusJob.top = 0;
textblock_StatusJob.color = "white";
textblock_StatusJob.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
textblock_StatusJob.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

// I. Gabarito da tarefa
var textblock_Gabarito = new BABYLON.GUI.TextBlock();
textblock_Gabarito.text = "Tempo da tarefa: 0"; // # add variáveis
textblock_Gabarito.fontSize = 20;
textblock_Gabarito.height = "60px";
textblock_Gabarito.width = "30%";
textblock_Gabarito.top = 0;
textblock_Gabarito.right = 0;
textblock_Gabarito.color = "white";
textblock_Gabarito.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
textblock_Gabarito.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

// J. Local da Resposta do Player
var textblock_Resposta = new BABYLON.GUI.TextBlock();
// textblock_Resposta.text = ">> (((((👂🏼))))) <<";
textblock_Resposta.fontSize = 40;
textblock_Resposta.fontFamily = "Segoe UI"
textblock_Resposta.height = "60px";
textblock_Resposta.top = "0px";
textblock_Resposta.color = "white";
textblock_Resposta.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
textblock_Resposta.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

// Botão seta para esquerda
var leftBtn = BABYLON.GUI.Button.CreateImageOnlyButton("esquerda", "./textures/leftButton.png");
leftBtn.width = "55px";
leftBtn.height = "55px";
leftBtn.thickness = 0;
leftBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
leftBtn.onPointerClickObservable.add(() => { 
    // if (leftBtn) {
    // // Executa vídeo de abertura
    //     document.write("<video src='assets/videos/abertura.mp4' autoplay='true' width='100%' height='100%'");
    //     console.log("apertou esquerda");
    //     leftBtn = 0;
    // }
});

// Botão seta para direita
var rightBtn = BABYLON.GUI.Button.CreateImageOnlyButton("direita", "./textures/rightButton.png");
rightBtn.width = "55px";
rightBtn.height = "55px";
rightBtn.thickness = 0;
rightBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
// rightBtn.onPointerClickObservable.add(() => { 
//     if (acceptInput) {
//         updateWeaponsPosition("right");
//     }
// });

// Botão que habilita a interação do usuário com a interface gráfica
// var gui_ativado = false;
var activateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("ativar", "./textures/activateButton.png");
activateBtn.width = "130px";
activateBtn.height = "55px";
activateBtn.thickness = 0;
activateBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

activateBtn.onPointerClickObservable.add(function() {
    barraSuperior.isVisible = false;
 });

// activateBtn.onPointerClickObservable.add(() => {
    // gui_ativado = true;
    // if  (gui_ativado){

    // Colocar tudo dentro de painel e ocultar o painel!!!
        // // REESCREVER TODOS PASSANDO COMO PARAMETROS!!!
        // // interface_user.addControl(leftBtn);   
        // // interface_user.addControl(rightBtn);  
        // interface_user.addControl(barraSuperior);
        // interface_user.addControl(barraInferior);
        // interface_user.addControl(input);    
        // interface_user.addControl(keyboard);
        // interface_user.addControl(button_Click);    
        interface_user.addControl(Button_Falar);
        // // interface_user.addControl(Button_Desistir);
        interface_user.addControl(textblock_Feedback); 
        interface_user.addControl(textblock_Resposta);
        interface_user.addControl(textblock_Gabarito);// # Não exibir para o jogador
        interface_user.addControl(textblock_StatusJob);
      
        // interface_user.addControl(leftBtn, rightBtn);
        // interface_user.addControl(panel1, panel2);   
        // interface_user.addControl(input, keyboard, button_Click, Button_Falar); 
        // interface_user.addControl(textblock_Feedback, textblock_Resposta);   
        // interface_user.addControl(textblock_Nivel, textblock_Pontos);
        // interface_user.removeControl //# pesquisar se existe algo similar
    // }

    // gui_ativado = false;

    // });
    
// interface_user.addControl(activateBtn); 


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

var diameter = 2;  
console.log("Diâmetro inicial: ", diameter);

// Asteróide que colidirá com o Sol
var createAsteroid = function(){
  // var asteroide = BABYLON.MeshBuilder.CreateSphere("asteroide", {diameter: 2, segments: 1.5}, scene);
  var asteroide = BABYLON.MeshBuilder.CreateSphere("asteroide", {diameter: diameter, segments: 1.5}, scene);
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
var qtd_Asteroide = 10
textblock_StatusJob.text = ("🌑 Asteroide: " + num_Asteroid + '/' + qtd_Asteroide);
console.log('🌑 Asteroide: ' + num_Asteroid + '/' + qtd_Asteroide);

var distancia = 1000; // Ponto de partida inicial do asteroide
// Intervalo de tempo a ser estimado
var minTime = 4;
var maxTime = 6;

// Sorteia a duração dentro do intervalo 2 a 10
var duration;
// duration = Math.floor((Math.random(distancia)*maxTime) + minTime);

// Dispara cronômetro
// console.time(); 
// Armazenar o tempo de início
var startTime = Date.now();

// // 1º Feedback do comando
// textblock_Feedback.text = ("👀 Observe a colisão");

// Exibe o tempo da animação
var elapsedTime = 0;
elapsedTime = Date.now() - startTime;
textblock_Gabarito.text = ("⏱ Tempo: " + formatTime(elapsedTime)); // # Não exibir para o jogador
console.log('⏱ Tempo: ' + formatTime(elapsedTime));

// Inicia percurso a partir da duração sorteada
scene.registerBeforeRender(function() {

  // 1º Feedback do comando
  textblock_Feedback.text = ("👀 Observe a colisão"); //# Aqui dentro ele escreve várias vezes, isso sobrecarrega??

  sphere.position.x = points[distancia].x;
  sphere.position.z = points[distancia].z;
  // console.log(i);

    // linha.scaling.x +=0.01;
    // linha.scaling.y +=0.01;
    // linha.scaling.z +=0.01;

  distancia = (distancia - 1)    
  
  if(distancia<1){ // "Colidiu" com o Sol

    // Exibe o numero do asteoride atual
    textblock_StatusJob.text = ("🌑 Asteroide: " + ++num_Asteroid + '/' + qtd_Asteroide);
    console.log('🌑 Asteroide: ' + num_Asteroid + '/' + qtd_Asteroide);

    // Exibe o tempo da animação
    elapsedTime = Date.now() - startTime;
    textblock_Gabarito.text = ("⏱ Tempo: " + formatTime(elapsedTime));
    console.log('⏱ Tempo: ' + formatTime(elapsedTime));

    // # Exfeito de explosão, fogo, e destruição
    if(som_Efeitos){
      colisao = new BABYLON.Sound('colisao', './audio/colisao.wav', scene, null,{ // # Usar outro som de explosão
        loop: false,
        autoplay: true,
      })

      if(num_Asteroid == 10){
        explosao = new BABYLON.Sound('explosao', './audio/explosao.mp3', scene, null,{ // # Usar outro som de explosão
          loop: false,
          autoplay: true,
        })
      }
    }

    // Sorteia a posição onde o asteróide iniciará o percurso
    distancia = Math.floor(Math.random(1000)*1000);  
    
    // Sorteia um novo tamanho para o asteroide
    diameter = Math.floor(Math.random(100)*100);  
    console.log("Diâmetro: ", diameter);
    
    // 2º Feedback do comando
    textblock_Feedback.text = ("⏱ Quanto tempo?");

    // Captura resposta do jogador
    textblock_Resposta.text = ">> (((((👂🏼))))) <<";


    
    Button_Falar.children[0].text = ">> INICIOU <<";
    textblock_Feedback.text = "Aguardando resposta...";
    console.log('Aguardando resposta...');
    
    // reconheceFala();
    
    Button_Falar.isEnabled = false;

    // # sobrecarrega por colocar várias vezes?????
    // interface_user.addControl(input);    
    // interface_user.addControl(keyboard);
    // interface_user.addControl(button_Click); 

    // sleep1(5000); 
    sleep2(5000); // ok
    
    // speechSynthesis.speak(new SpeechSynthesisUtterance('Outro asteroide está se aproximando...!'));
    //   console.log('Outro asteroide está se aproximando...!');

    // Reseta cronômetro
    startTime = Date.now();
  };  
});
// asteroide.dispose();


// Função para formatar o tempo em minutos e segundos
function formatTime(time) {
  var minutes = Math.floor(time / 60000);
  var seconds = Math.floor((time % 60000) / 1000);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// Gerar vários asteróides rotacionando
var sphere = variosAsteroides();

// Loading screen
      const loadingScreen = document.getElementById('loading-screen')
      loadingScreen.classList.add('fade-out')
      loadingScreen.addEventListener('transitionend', onTransitionEnd)

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

      entityManager = new YUKA.EntityManager()
      time = new YUKA.Time()

      const player = new Player()
      player.head.setRenderComponent(camera, syncCamera)

      controls = new FirstPersonControls(player)
      controls.setRotation(-2.2, 0.2)
      
      controls.addEventListener('lock', () => {
        intro.classList.add('hidden')
      })

      controls.addEventListener('unlock', () => {
        intro.classList.remove('hidden')
      })

      entityManager.add(player)
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
      textblock_Resposta.text = content.toUpperCase(); 

      // Reproduz o que foi transcrito
      var u = new SpeechSynthesisUtterance();
      u.text = content;
      u.lang = 'pt-BR';
      u.rate = 1.2; // Quanto maior, mais rápido (0.1 .... 10)
      u.pitch = 2; // Quanto menor, mais grave (0, 1, 2)
      u.onend = console.log('Saída: ', content);
      speechSynthesis.speak(u);
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
      Button_Falar.isEnabled = true;
      Button_Falar.children[0].text = ">> COMEÇAR <<";
      textblock_Resposta.text = ">> SUA RESPOSTA <<";
  };

  // Caso o que reconheça bata com os elementos sorteados
  recognition.onmatch = function () {
      // # incrementar a pontuação

      textblock_Resposta.text = "Parabéns!";     
      // # add síntese de voz
      // # add alerta sonoro 
      console.log("Muito bem! Você conseguiu!!");
      Button_Falar.children[0].text = elemento.toUpperCase();
  };


  // Caso não reconheça o que foi pronunciado
  recognition.onnomatch = function () {
      textblock_Resposta.text = "Palavra desconhecida!";     
      // # add síntese de voz
      // # add alerta sonoro 
      console.log("Não entendi o que falou.");
      Button_Falar.children[0].text = "Tentar novamente!";
  };

  recognition.onerror = function (event) {
      console.log("Ocorreu um erro no reconhecimento: " + event.error);
      Button_Falar.isEnabled = true;
      Button_Falar.children[0].text = "Tentar novamente!";
      textblock_Resposta.text = ">> SUA RESPOSTA <<";
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
    entityManager.add(player)
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
  // entityManager.update(delta)

  scene.render()
}

function syncCamera(entity, renderComponent) {
  renderComponent.getViewMatrix().copyFrom(BABYLON.Matrix.FromValues(...entity.worldMatrix.elements).invert())
}

function onTransitionEnd(event) {
  event.target.remove()
}
