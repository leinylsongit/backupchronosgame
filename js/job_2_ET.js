var canvas = document.getElementById("canvasPrimario");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var job_2ET = null;
var sceneToRender = null;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();

var hdrTexture;
var directionalLight;

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var targets = [];
var spawnTimer = 0;
var spawnDelay = 1000;
var spawnFactor = 0.99;
var globalCount = 0;

var som_Ambiente = false; // checkbox
var som_Efeitos = false; // checkbox

var narrador = true; // checkbox

var lastTime = Date.now();

//# Excluir!!
function GameLoop() {
	
	var currentTime = Date.now();
	var deltaTime = Date.now() - lastTime;
	lastTime = currentTime;
	
	spawnTimer -= deltaTime;
	
	if (spawnTimer <= 0.0 && globalCount < 1){
		globalCount++;
		
		var newTarget = {alive:true, timer:0.0, mesh:BABYLON.MeshBuilder.CreateSphere("sphere" + globalCount.toString(), {}, job_2ET)};
		
        // Determina o tamanho da esfera
        newTarget.mesh.scaling = new BABYLON.Vector3(4, 4, 4);

        // sorteia uma posição para a esfera surigr!
        // newTarget.mesh.position = new BABYLON.Vector3(Math.random() * 20.0 - 10.0, Math.random() * 20.0 - 10.0, 0);

        // Usa posição fixa
        newTarget.mesh.position = new BABYLON.Vector3(0, 0, 0);


		newTarget.mesh.material = new BABYLON.StandardMaterial("texture" + globalCount.toString(), job_2ET);
		newTarget.mesh.material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 0.0);
		targets.push(newTarget);
		
		spawnTimer += spawnDelay;
		spawnDelay *= spawnFactor;
	}
	
	for (var i = 0; i < targets.length; i++){
		if (targets[i].alive){
			targets[i].timer += deltaTime;
            var lifePercent = targets[i].timer / 5000.0; //tempo tem que ser aleatório
            targets[i].mesh.scale = lifePercent;
            targets[i].mesh.material.diffuseColor = new BABYLON.Color3(1.0, 1.0 - lifePercent, 0.0);
		
	//		//scale up
	//		targets[i].mesh.material.diffuseColor = new BABYLON.Color3(1.0, 1.0 - targets[i].timer / 3.0, 0.0);
	//		if (targets[i].timer >= 3.0)
	//		{
	//			//pop
	//		}
		}
	//	if (!targets[i].alive && targets[i].timer > 0.0)
	//	{
	//		targets[i].timer -= deltaTime * 5;
	//		//scale down
	//		if (targets[i].timer <= 0.0) {
	//			//death
	//		}
	//	}
	}
}

//--------------------------------------- Inicio da tarefa---------------------------------
var create_Tarefa = function () {
    // Cria a Cena
    job_2ET = new BABYLON.Scene(engine);

//  Cria a câmera, luz e som

    // createSkyboxAndLight(); // # Atualizar esta função e ativar

    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 5, new BABYLON.Vector3(0, 0, 0), job_2ET);
    
    // var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 2.5, 200, BABYLON.Vector3.Zero(), job_2ET);

    // Controle para touchscreen
    // var camera = new BABYLON.VirtualJoysticksCamera("VJ_camera", new BABYLON.Vector3(0, 1, -15), job_2ET);

    camera.lowerRadiusLimit = 10; // Limite de zoom in
    camera.upperRadiusLimit = 250; // Limite de zoom out
    camera.wheelDeltaPercentage = 0.01; // Velocidade do zoom do mouse
    // camera.lowerBetaLimit = 0.1; // Limite da visão inferior
    // camera.upperBetaLimit = (Math.PI / 2) * 0.9; // Limite da visão superior
    // camera.pinchDeltaPercentage = 0.01;
    // camera.minZ = 0.1;

    // job_2ET.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    // job_2ET.clearColor = new BABYLON.Color3.Blue();
    // job_2ET.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    camera.attachControl(canvas, true); //# sai
    // Controles de câmera [OK]
    // var cameraControl = false;
    // job_2ET.onKeyboardObservable.add(evt =>{
    //     if (evt.type !== BABYLON.KeyboardEventTypes.KEYDOWN){
    //         return;
    //     }
    //     if (evt.event.keyCode === 82) { // Tecla r alterna entre rotação da câmera e rotação do objeto
    //         cameraControl = !cameraControl;

    //         if (cameraControl) {
    //             camera.attachControl(canvas, true);
    //         } else {
    //             camera.detachControl(canvas);
    //         }
    //     }        
    // });

    // var anchor = new BABYLON.TransformNode("");

    // Luz hemisférica
    // var lightHemis = new BABYLON.HemisphericLight("sun", new BABYLON.Vector3(0,1,0), job_2ET);
    // lightHemis.intensity = 0.1;

    // Ponto de luz
    var lightPoint = new BABYLON.PointLight("PointLight", new BABYLON.Vector3(20, 20, 10), job_2ET);
    // lightPoint.intensity = 0.7;


    // Luz direcional
    // var dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0, 0, 0), job_2ET);
    // dirLight.direction = new BABYLON.Vector3(-0.5, 0.38, 0.67);
    // dirLight.position = camera.position;
    // dirLight.parent = camera;
    // dirLight.intensity = 0.7;

    // Reflexo de lente
    var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", lightPoint, job_2ET);
    var flare00 = new BABYLON.LensFlare(0.2, 0, new BABYLON.Color3(1, 1, 1), "assets/skybox/lens5.png", lensFlareSystem);
    var flare01 = new BABYLON.LensFlare(0.5, 0.5, new BABYLON.Color3(0.5, 0.5, 1), "assets/skybox/lens4.png", lensFlareSystem);
    var flare02 = new BABYLON.LensFlare(0.2, 1.0, new BABYLON.Color3(1, 0, 0), "assets/skybox/lens4.png", lensFlareSystem);
    var flare03 = new BABYLON.LensFlare(0.4, 0.4, new BABYLON.Color3(1, 0.5, 1), "assets/skybox/flare.png", lensFlareSystem);
    var flare04 = new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1), "assets/skybox/lens5.png", lensFlareSystem);
    var flare05 = new BABYLON.LensFlare(0.3, 0.8, new BABYLON.Color3(1, 1, 1), "assets/skybox/lens4.png", lensFlareSystem);


     // Atmosfera 1
     var skybox1 = BABYLON.MeshBuilder.CreateBox("SkyBox1", {size:1000.0}, job_2ET);
     var skyboxMaterial1 = new BABYLON.StandardMaterial("skyBox1", job_2ET);
     skyboxMaterial1.backFaceCulling = false;
    //  skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets/skybox/9.hdr", job_2ET, 512);     
    // skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/bosque1.hdr", job_2ET, 512);     
    // skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/bosque2.hdr", job_2ET, 512);     
    // skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/bancoBosque.hdr", job_2ET, 512);     
    // skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/ceuRosa.hdr", job_2ET, 512);     
    // skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/ceuTropical.hdr", job_2ET, 512);     
    // skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/ceuCarregado.hdr", job_2ET, 512);     
    skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/ceuAzul.hdr", job_2ET, 512);     
    // skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/estacionamento.hdr", job_2ET, 512);     
    // skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/escadarias.hdr", job_2ET, 512);     
    // skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/predioNevoeiro.hdr", job_2ET, 512);     
    // skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/montanhasNeve.hdr", job_2ET, 512);     
    // skyboxMaterial1.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/montanhasRocha.hdr", job_2ET, 512);     
     skyboxMaterial1.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
     skybox1.material = skyboxMaterial1;


    // Atmosfera 2
    // var skybox2 = BABYLON.Mesh.CreateBox("Skybox2", 500, job_2ET, undefined, BABYLON.Mesh.BACKSIDE);
    // var skyboxMaterial2 = new BABYLON.BackgroundMaterial("skyboxMaterial2", job_2ET);
    // skyboxMaterial2.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/TropicalSunnyDay", job_2ET);
    // skyboxMaterial2.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // skybox2.material = skyboxMaterial2;

    // Checkbox opção de som ou mudo
    if (som_Ambiente)//# abaixar o volume
        var backSound = new BABYLON.Sound("Ambiente", "assets/sounds/soundtracks/Ambiente_Calmo_01.mp3", job_2ET, null, { loop: false, autoplay: true });


    // Executa vídeo de abertura
    // executaVideo("assets/videos/abertura.mp4");
    // executaVideo("assets/videos/encontro.mp4");


//----------------------------------------- Camada de brilho -------------------------------------------
    // var gl = new BABYLON.GlowLayer("glow", job_2ET, {
    //     mainTextureFixedSize: 512,
    //     // blurKernelSize: 64
    // });
    // // gl.intensity = 1.25;
    // gl.isEnabled = true;



    // Deixa tudo de uma cor só
    // var gl = new BABYLON.GlowLayer("glow", job_2ET);
    // gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
    //     result.set(0, 1, 1, 1);
    // }

// --------------------------------------------------------------------
//     // # Usar uma cor ao invés de textura!!!!
//     BABYLON.SceneLoader.ImportMesh("", "https://david.blob.core.windows.net/babylonjs/MRTK/", "pushButton.glb", job_2ET, function (newMeshes) {
//         pushButton = newMeshes[0];
//         makePushButton(pushButton);        
//             pushButtonSound = new BABYLON.Sound("pushButtonSound", "assets/sound/effects/pushButtonSound.wav", job_2ET, function() {
//             pushButtonSound.attachToMesh(pushButton); // adicona um botão??
//         });
//         sphereButtonSound = new BABYLON.Sound("sphereButtonSound", "audios/sound/effects/sphereButtonSound.mp3", job_2ET, function() {
//             addSomeSpheres(qtd_Elementos);
//         });
//         var arhelper = job_2ET.createDefaultARExperience();
//         arhelper.enableInteractions();
//     });

//     // Botão para adicionar mais elemento
//     var button = new BABYLON.GUI.HolographicButton("addMore");
//     button.text = "Adicionar Elementos";
//     // button.position.y = -30;
//     button.scaling = new BABYLON.Vector3(10, 10, 10);
//     button.onPointerDownObservable.add(() => {
//         addSomeSpheres(qtd_Elementos+1);
//     });
//   //  manager.addControl(button);

//---------------------------------- Interface do Usuário ---------------------------------
var interface = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
// interface.renderScale = 1; // não alterou nada
// interface.useRealisticScaling = true;// // não alterou nada
    
//# TESTAR ESSAS 3 LINHAS!!!
//This adds some parameters towards how the GUI will display on resize.
    //Explanations will be part of lesson #3 
    // interface.idealWidth = 800;
    // interface.idealHeight = 900;
    // interface.useSmallestIdeal = true;



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
interface.addControl(grid);


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



//A. Feedback com informações sobre as ações de interação do jogador
var textblock_Feedback = new BABYLON.GUI.TextBlock();
textblock_Feedback.text = "Desafio 01 - A explosão do Sol!";
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
input.text.color = "white";
input.text.fontSize = 40;
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


//E. Barra superior
var panel1 = new BABYLON.GUI.StackPanel();
panel1.isVertical = false;
panel1.background = "black"; 
panel1.alpha = 0.3;
// panel.background = "transparent";
panel1.horizontalAlignment = 1;
panel1.verticalAlignment = 0;
panel1.width = "100%";
panel1.height = "60px";


// F. Barra inferior
var panel2 = new BABYLON.GUI.StackPanel();
panel2.isVertical = false;
panel2.background = "black"; 
panel2.alpha = 0.3;
panel2.horizontalAlignment = 0;
panel2.verticalAlignment = 1;
panel2.width = "100%";
panel2.height = "60px";

// G. Pontuação e tentativas
var textblock_Pontos = new BABYLON.GUI.TextBlock();
textblock_Pontos.text = "Pontuação: 0\nTentativas restantes: 1/3"; //add a variável da tentativa 1/3, 2/3...
textblock_Pontos.fontSize = 20;
textblock_Pontos.fontFamily = "Segoe UI"
textblock_Pontos.height = "60px";
textblock_Pontos.width = "30%";
textblock_Pontos.top = 0;
textblock_Pontos.color = "white";
textblock_Pontos.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
textblock_Pontos.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

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

// I. Nível da tarefa
var textblock_Nivel = new BABYLON.GUI.TextBlock();
textblock_Nivel.text = "DESAFIO: 01 - Estimativa de Tempo\n NÍVEL: Fácil\n VELOCIDADE: Lenta";
textblock_Nivel.fontSize = 15;
textblock_Nivel.height = "60px";
textblock_Nivel.width = "30%";
textblock_Nivel.top = 0;
textblock_Nivel.right = 0;
textblock_Nivel.color = "white";
textblock_Nivel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
textblock_Nivel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

// J. Local da Resposta
var textblock_Resposta = new BABYLON.GUI.TextBlock();
textblock_Resposta.text = ">> (((((👂🏼))))) <<";
textblock_Resposta.fontSize = 40;
textblock_Resposta.fontFamily = "Segoe UI"
textblock_Resposta.height = "60px";
textblock_Resposta.top = "0px";
textblock_Resposta.color = "white";
textblock_Resposta.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
textblock_Resposta.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

// // K. Regras da tarefa
// var textblock_Regras = new BABYLON.GUI.TextBlock();
// textblock_Regras.text = "1. Click no botão [INICIAR]\n 2. OBSERVE o que vai acontecer com o Sol\n 3. Informe quanto tempo demorou para o Sol explodir\n";
// textblock_Regras.fontSize = 30;
// textblock_Regras.fontFamily = "Segoe UI"
// textblock_Regras.height = "150px";
// textblock_Regras.top = "80px";
// textblock_Regras.color = "blue";
// // textblock_Regras.background = "black";
// textblock_Regras.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
// textblock_Regras.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

// Botão seta para esquerda
leftBtn = BABYLON.GUI.Button.CreateImageOnlyButton("esquerda", "assets/gui/leftButton.png");
leftBtn.width = "55px";
leftBtn.height = "55px";
leftBtn.thickness = 0;
leftBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
leftBtn.onPointerClickObservable.add(() => { 
    // if (leftBtn) {
    // // Executa vídeo de abertura
    //     document.write("<video src='assets/videos/abertura.mp4' autoplay='true' width='100%' height='100%'");
    //     console.log("apertou MENU");
    //     leftBtn = 0;
    // }
});


// Botão seta para direita
rightBtn = BABYLON.GUI.Button.CreateImageOnlyButton("direita", "assets/gui/rightButton.png");
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
activateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("ativar", "assets/gui/activateButton.png");
activateBtn.width = "130px";
activateBtn.height = "55px";
activateBtn.thickness = 0;
activateBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

activateBtn.onPointerClickObservable.add(function() {
    panel1.isVisible = false;
 });

// activateBtn.onPointerClickObservable.add(() => {
    // gui_ativado = true;
    // if  (gui_ativado){

    // Colocar tudo dentro de painel e ocultar o painel!!!
        // REESCREVER TODOS PASSANDO COMO PARAMETROS!!!
        interface.addControl(leftBtn);   
        interface.addControl(rightBtn);  
        interface.addControl(panel1);
        // interface.addControl(panel2);
        interface.addControl(input);    
        interface.addControl(keyboard);
        interface.addControl(button_Click);    
        interface.addControl(Button_Falar);
        // interface.addControl(Button_Desistir);
        interface.addControl(textblock_Feedback);
        // interface.addControl(textblock_Regras);
        interface.addControl(textblock_Resposta);
        interface.addControl(textblock_Nivel);
        interface.addControl(textblock_Pontos);
      
        // interface.addControl(leftBtn, rightBtn);
        // interface.addControl(panel1, panel2);   
        // interface.addControl(input, keyboard, button_Click, Button_Falar); 
        // interface.addControl(textblock_Feedback, textblock_Resposta);   
        // interface.addControl(textblock_Nivel, textblock_Pontos);
        // interface.removeControl //# pesquisar se existe algo similar
    // }

    // gui_ativado = false;

    // });
    
interface.addControl(activateBtn);   

//------------------------------- Cria o plano do chão ----------------------------------
// var groundSize = 150;
// var ground = BABYLON.Mesh.CreateGround("ground", groundSize, groundSize, 5, job_2ET);
// // ground.position.y = -7;

// // Cria a textura do chão
// var grade = new BABYLON.GridMaterial("grade", job_2ET);
// grade.gridRatio = 1;
// // grade.lineColor = new BABYLON.Color3.White();
// // grade.mainColor = new BABYLON.Color3.Black();
// // grade.alpha = 0.3;
// // grade.majorUnitFrequency = 10;    
// // ground.fogEnabled = true;
// ground.material = grade;

// ground.visibility = false; //Oculta o elemento
    
// Cria uma repetição do material 
    // var texturaNitLab = new BABYLON.StandardMaterial("nitlab", scene_Mundo);
    // texturaNitLabw.diffuseTexture = new BABYLON.Texture("assets/textures/flare.png", job_2ET);
    // // texturaNitLab.diffuseTexture.uScale = 2.0;//Repeat 2 times on the Vertical Axes
    // texturaNitLab.diffuseTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
    // texturaNitLab.backFaceCulling = false;//Always show the front and the back of an element
    // ground.material = texturaNitLab;


    

   

    //   console.time('Tempo utilizado: ');
    // console.timeEnd('Tempo utilizado --> ');


    
    // Adiciona o Sol
    var sol = BABYLON.ParticleHelper.CreateAsync("sun", job_2ET).then((set) => {
        console.log(set);        
        //scale all of the particle subsystems uniformly
        for(const sys of set.systems) { // Permite alterar as propriedades do sol
        //     // sys.maxScaleX = 10;
        //     // sys.maxScaleY = 1;
            sys.maxScaleX = 1.5;
            sys.maxScaleY = 1;
        }
        // set.start(); 
        set.start(new BABYLON.Vector3(0, 0, 0)); 
    });
    
    
    // Adiciona planeta Lava
    BABYLON.SceneLoader.ImportMesh("", "./assets/ambiente/planetas/", "planeta_lava.glb", job_2ET, function (mesh_planeta_Lava){
        // mesh_planeta_Lava[0].scaling = new BABYLON.Vector3(20, 20, 20);
        mesh_planeta_Lava[0].scaling = new BABYLON.Vector3(2, 2, 2);
        mesh_planeta_Lava[0].position = new BABYLON.Vector3(30, 0, 0);
        mesh_planeta_Lava[0].collisionsEnabled = true;
        mesh_planeta_Lava[0].checkCollisions = true;
        // mesh_planeta_Lava[0].dispose();
    });
    


    //  // Adiciona planeta Terra
    //     BABYLON.SceneLoader.ImportMesh("", "./assets/ambiente/planetas/", "planeta_terra.glb", job_2ET, function (mesh_planeta_Terra){        
    //     mesh_planeta_Terra[0].scaling = new BABYLON.Vector3(3, 3, 3);
    //     mesh_planeta_Terra[0].position = new BABYLON.Vector3(-10, 0, 0);
    //     mesh_planeta_Terra[0].collisionsEnabled = true;
    //     mesh_planeta_Terra[0].checkCollisions = true;
    // });


    // Fumaça
    // BABYLON.ParticleHelper.CreateAsync("smoke", job_2ET).then((set) => {
    //     set.start();
    // });

    // Chuva
    // BABYLON.ParticleHelper.CreateAsync("rain", job_2ET).then((set) => {
    //     set.start();
    // });

    // BABYLON.ParticleHelper.CreateAsync("fire", job_2ET).then((set) => {
    //     set.start();
    // });
    


     

    // Adiciona particulas na esfera   
    // adicionaParticulas();
    // geraParticulas(texture, position) {

    // Animação de transição
    // job_2ET.onBeforeRenderObservable.add(GameLoop);


//------------------------------- Eventos de efeitos especiais --------------------------
    // Evento de fumaça
    document.addEventListener('keydown', fumaceia);
    // Remove listeners when scene disposed
    job_2ET.onDisposeObservable.add(function(){
        document.removeEventListener('keydown', fumaceia);
    });
  
    // Evento de chuva
    document.addEventListener('keydown', chove);
    // Remove listeners when scene disposed
    job_2ET.onDisposeObservable.add(function(){
        document.removeEventListener('keydown', chove);
    });

    // Ativa evento de fogo
    document.addEventListener('keydown', queima);
    // Remove listeners when scene disposed
    job_2ET.onDisposeObservable.add(function(){
        document.removeEventListener('keydown', queima);
    });
   
     // Ativa evento de explosão
     document.addEventListener('keydown', explode);
     // Remove listeners when scene disposed
     job_2ET.onDisposeObservable.add(function(){
         document.removeEventListener('keydown', explode);
     });


    // // Planeta Lava some
    // document.addEventListener('keydown', sumindo);
    // // Remove listeners when scene disposed
    // job_2ET.onDisposeObservable.add(function(){
    //     document.removeEventListener('keydown', sumindo);
    // });

//------------------------------- Eventos variados --------------------------
    // Ativa evento de Gravação da tela
    document.addEventListener('keydown', gravaTela);
    // Remove listeners when scene disposed
    job_2ET.onDisposeObservable.add(function(){
        document.removeEventListener('keydown', gravaTela);
    });


//---------------------------------- Síntese de fala -------------------------------------
    var box = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, job_2ET);
    box.position.x = -2;
    box.metadata = {speech: "Oi, sou uma caixa!"}
    // console.log(box.metadata.speech);
    // console.log(box.metadata);

    // SIG instruindo a tarefa
    var bola = BABYLON.MeshBuilder.CreateSphere("bola", {size: 1}, job_2ET);
    bola.position.x = 2;
    bola.metadata = {speech: "Olá herói! Veja o que está acontecendo com o Sol! Ele está superaquecendo! Observe o que vai acontecer em seguida me conta quanto tempo levou para ele explodir. Preparado? Iniciaremos em 3, 2, 1."}
    // console.log(bola.metadata);

    // Leitura de texto por meio de sintese
    // leituraTexto(box, bola);

   
// if (finalizou){
//     // Executa vídeo de comemoração
//     //  executaVideo("assets/videos/comemora.mp4");


//     // Registra dados em um arquivo


//     // Retorna ao labirinto
// }


    // Asteróide que colidirá com o Sol
    var asteroide = BABYLON.Mesh.CreateBox("asteroide", 0.5, job_2ET);
        // asteroide.isVisible = false;

    // Particles
    var particleSystem = new BABYLON.ParticleSystem("particles", 4000, job_2ET);
    particleSystem.particleTexture = new BABYLON.Texture("assets/textures/flare/flare.png", job_2ET);
    
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.3;

    particleSystem.minLifeTime = 0.5;
    particleSystem.maxLifeTime = 1.0;

    particleSystem.minEmitPower = 1.0;
    particleSystem.maxEmitPower = 2.0;

    particleSystem.emitter = asteroide;
    particleSystem.emitRate = 500;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

    particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);

    particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);

    particleSystem.color1 = new BABYLON.Color4(1, 1, 0, 1);
    particleSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1);

    particleSystem.gravity = new BABYLON.Vector3(0, -0.5, 0);
    particleSystem.start();



//# -------- Gerar vários asteróides rotacionando ---------------------------------
    // Meterial do asteróide
    var url = "http://jerome.bousquie.fr/BJS/images/rock.jpg";
	var mat = new BABYLON.StandardMaterial("mat1", job_2ET);
	var texture = new BABYLON.Texture(url, job_2ET);
	mat.diffuseTexture = texture;
	mat.backFaceCulling = false;
	
    //
	var fact = 1000;   // density
    var scaleX = 0.0;
    var scaleY = 0.0;
    var scaleZ = 0.0;
    var grey = 0.0;

    // custom vertex function
    var myVertexFunction = function(particle, vertex, i) {
      vertex.x *= (Math.random() + 1);
      vertex.y *= (Math.random() + 1);
      vertex.z *= (Math.random() + 1);
    };

    // Posição do asteróide
    var myPositionFunction = function(particle, i, s) {
      scaleX = Math.random() * 2 + 0.8;
      scaleY = Math.random() + 0.8;
      scaleZ = Math.random() * 2 + 0.8;
      particle.scale.x = scaleX;
      particle.scale.y = scaleY;
      particle.scale.z = scaleZ;
      particle.position.x = (Math.random() - 0.5) * fact;
      particle.position.y = (Math.random() - 0.5) * fact;
      particle.position.z = (Math.random() - 0.5) * fact;
      particle.rotation.x = Math.random() * 3.5;
      particle.rotation.y = Math.random() * 3.5;
      particle.rotation.z = Math.random() * 3.5;
      grey = 1.0 - Math.random() * 0.3;
      particle.color = new BABYLON.Color4(grey, grey, grey, 1);
    };
 
    // Cria o sistema de particulas: Immutável
    var SPS = new BABYLON.SolidParticleSystem('SPS', job_2ET, {updatable: false});
    var sphere = BABYLON.MeshBuilder.CreateSphere("s", {diameter: 6, segments: 8}, job_2ET);
    SPS.addShape(sphere, 200, {positionFunction: myPositionFunction, vertexFunction: myVertexFunction});
    var mesh = SPS.buildMesh();
    mesh.material = mat;
    // destrói o modelo
    sphere.dispose();

    // Animação dos asteróides
    var k = Date.now();
    job_2ET.registerBeforeRender(function() {
        SPS.mesh.rotation.y += 0.01;
        SPS.mesh.position.y = Math.sin((k - Date.now())/1000) * 2;
        k += 0.07;
    });
// -------------------------------------------------------------------------------




//------------------------------- Animação dos elementos- --------------------------------

// Girar o cenário rapidamente e dá um zoomIN na tarefa 
    // zoomIn(camera,ground);
    // zoomIn(camera, bola);
    
//# Passear pelo cenário rapidamente e dá um zoomOUT no ambiente 
    // zoomOut(camera,ground);
    // zoomOut(camera, bola);

    //# Animação de translação 
    // var frameRate = 10;


    //# Animação de rotação
    var alpha = 0;
    // asteroide.position.x = 1050;
    // asteroide.position.z = 150;

    job_2ET.registerBeforeRender(function (){
        
        //# Apenas chamar as funções de animações aqui!!!

        // zoomIn(camera,box); // Fica seguindo a caixa....
        // zoomIn(camera,bola); // Trava na bola
        
        
        // box.position = new BABYLON.Vector3(Math.cos(alpha)*30, 10, Math.sin(alpha)*30);
        // alpha += 0.01;
        
        // mesh_planeta_Lava.position = new BABYLON.Vector3(Math.cos(alpha)*30, 10, Math.sin(alpha)*30);


        // Rotação
        // box.rotation.x += 0.001;
        // box.rotation.y += 0.001;
        // box.rotation.z += 0.001;

        // anima_Rotaciona(box, velocidade);

        // Translação
        // asteroide.position.x = 10*Math.cos(alpha);
        // asteroide.position.y = 1.0;
        // asteroide.position.z = 10*Math.sin(alpha);

        // anima_Desloca(box, velocidade);

        // Escalamento
        asteroide.scaling.x = 10*Math.cos(alpha);
        // asteroide.scaling.y = 1.0;
        // asteroide.scaling.z = 10*Math.sin(alpha);

        // anima_Tamanho(box, velocidade);


        alpha += 0.01 * job_2ET.getAnimationRatio();
    });
 
return job_2ET;

//#  Executa vídeo automaticamente
function executaVideo(video) {
    var tela_Opts = {
        height: 80,
        width: 100,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    };

    var Video = BABYLON.MeshBuilder.CreatePlane("tela", tela_Opts, job_2ET);
    Video.position = new BABYLON.Vector3(0, 0, 0.1);

    var Video_Material = new BABYLON.StandardMaterial("m", job_2ET);
    var Video_Textura = new BABYLON.VideoTexture("vidtex", video, job_2ET);
    // var abertura_VideoTex = new BABYLON.VideoTexture("vidtex",video",
    //  job_2ET, false, false, {autoplay: false, loop: false, playsinline: false, poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"}
    // );
    Video_Material.diffuseTexture = Video_Textura;
    Video_Material.roughness = 1;
    Video_Material.emissiveColor = new BABYLON.Color3.White();
    Video.material = Video_Material;


    // Executa vídeo ao clicar na tela do vídeo
    job_2ET.onPointerObservable.add(function (evt) {
        if (evt.pickInfo.pickedMesh === Video) {
            console.log("Clicou no vídeo.");
            if (Video_Textura.video.paused)
                Video_Textura.video.play();

            else
                Video_Textura.video.pause();
            console.log(Video_Textura.video.paused ? "paused" : "playing");
        }
    }, BABYLON.PointerEventTypes.POINTERPICK);
    console.log(Video);
}

// Efeito de fumaça ao pressionar a tecla S
    function fumaceia(event, lava){
        if(event.keyCode == 83){ 
            BABYLON.ParticleHelper.CreateAsync("smoke", job_2ET).then((set) => {
                set.systems.forEach(s => {
                    s.disposeOnStop = true;
                });
                set.start();
            });
            // lava[0].dispose();
        }
    }

// Efeito de chuva ao pressionar a tecla c
    function chove(event){
        if(event.keyCode == 67){ 
            BABYLON.ParticleHelper.CreateAsync("rain", job_2ET).then((set) => {
                set.systems.forEach(s => {
                    s.disposeOnStop = true;
                });
                set.start();
                if (som_Efeitos)//
                    var chuva = new BABYLON.Sound("chuva", "assets/sounds/effects/chuva.mp3", job_2ET, null, { loop: false, autoplay: true });
                });
        }
    }

// Efeito de explosão ao pressionar a tecla E
    function explode(event){
        if(event.keyCode == 69){ 
            BABYLON.ParticleHelper.CreateAsync("explosion", job_2ET).then((set) => {
                set.systems.forEach(s => {
                    s.disposeOnStop = true;
                });
                set.start();
                if (som_Efeitos)
                    var explosao = new BABYLON.Sound("explosao", "assets/sounds/effects/explosao.mp3", job_2ET, null, { loop: false, autoplay: true });
            });
        }
    }

// Efeito de chamas ao pressionar a tecla F
    function queima(event){
        if(event.keyCode == 70){ 
            BABYLON.ParticleHelper.CreateAsync("fire", job_2ET).then((set) => {
                set.systems.forEach(s => {
                    s.disposeOnStop = true;
                });
                set.start();
                if (som_Efeitos)
                    var fogo = new BABYLON.Sound("fogo", "assets/sounds/effects/fogo.mp3", job_2ET, null, { loop: false, autoplay: true });
            });
        }
    }

// Efeito de desaparecimento ao pressionar a tecla D
// function fumaceia(event){
//     if(event.keyCode == 68){ 
//         s.disposeOnStop = true;
//     }
// }

    // Efeito de partículas nas esferas
    function geraParticulas(texture, position) {
        // Cria um sistema de partículas
        const origem_ParticleSystem = new BABYLON.ParticleSystem("particles", 25);

        // Textura de cada partícula
        origem_ParticleSystem.particleTexture = new BABYLON.Texture(texture);

        // Posição de onde as partículas são emitidas
        origem_ParticleSystem.emitter = position;

        // Gera e emite as partículas
        origem_ParticleSystem.start();
    }

    // Permite adicionar partículas de efeito
    function adicionaParticulas() {

        // Emissor das partículas
        var emissor = BABYLON.Mesh.CreateBox("emissor", 0.1, job_2ET);
        emissor.isVisible = false;

        // Custom shader for particles
        BABYLON.Effect.ShadersStore["myParticleFragmentShader"] =
            "#ifdef GL_ES\n" +
            "precision highp float;\n" +
            "#endif\n" +

            "varying vec2 vUV;\n" + // Provided by babylon.js
            "varying vec4 vColor;\n" + // Provided by babylon.js

            "uniform sampler2D diffuseSampler;\n" + // Provided by babylon.js
            "uniform float time;\n" + // This one is custom so we need to declare it to the effect

            "void main(void) {\n" +
            "vec2 position = vUV;\n" +

            "float color = 0.0;\n" +
            "vec2 center = vec2(0.5, 0.5);\n" +

            "color = sin(distance(position, center) * 10.0+ time * vColor.g);\n" +

            "vec4 baseColor = texture2D(diffuseSampler, vUV);\n" +

            "gl_FragColor = baseColor * vColor * vec4( vec3(color, color, color), 1.0 );\n" + "}\n" + "";

        // Effect
        var effect = engine.createEffectForParticles("myParticle", ["time"]);

        // Particles
        var particleSystem = new BABYLON.ParticleSystem("particles", 40, job_2ET, effect);
        particleSystem.particleTexture = new BABYLON.Texture("assets/textures/flare/flare.png", job_2ET);
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;
        particleSystem.minLifeTime = 0.5;
        particleSystem.maxLifeTime = 5.0;
        particleSystem.minEmitPower = 0.5;
        particleSystem.maxEmitPower = 3.0;
        particleSystem.emitter = emissor;
        particleSystem.emitRate = 50;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
        particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
        particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
        particleSystem.color1 = new BABYLON.Color4(1, 1, 0, 1);
        particleSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1);
        particleSystem.gravity = new BABYLON.Vector3(0, -2, 0);
        particleSystem.start();

        var time = 0;
        var order = 0.1;

        effect.onBind = function () {
            effect.setFloat("time", time);

            time += order;

            if (time > 100 || time < 0) {
                order *= -1;
            }
        };
    }

    // Permite dar zoom no cenário
    function zoomIn(cam, tar) {
        var targetEndPos = tar.getAbsolutePosition();
        var speed = 25;
        var ease = new BABYLON.CubicEase();
        tar.computeWorldMatrix();
        var matrix = tar.getWorldMatrix(true);
        var local_position = new BABYLON.Vector3(0,-10,-15);
        local_position.addInPlace(new BABYLON.Vector3(0, -2, -10));
        var global_position = BABYLON.Vector3.TransformCoordinates(local_position, matrix);
        console.log(global_position);
        
        BABYLON.Animation.CreateAndStartAnimation('at4', cam, 'position', speed, 120, cam.position, global_position, 0, ease);
        BABYLON.Animation.CreateAndStartAnimation('at5', cam, 'target', speed, 120, cam.target, targetEndPos, 0, ease);
    };

    function zoomOut(cam, tar) {
        var targetEndPos = tar.getAbsolutePosition();
        var speed = 25;
        var ease = new BABYLON.CubicEase();
        tar.computeWorldMatrix();
        var matrix = tar.getWorldMatrix(true);
        var local_position = new BABYLON.Vector3(0,0,0);
        local_position.addInPlace(new BABYLON.Vector3(0, 0, -80));
        var global_position = BABYLON.Vector3.TransformCoordinates(local_position, matrix);
        console.log(global_position);
        
        BABYLON.Animation.CreateAndStartAnimation('at4', cam, 'position', speed, 120, cam.position, global_position, 0, ease);
        BABYLON.Animation.CreateAndStartAnimation('at5', cam, 'target', speed, 120, cam.target, targetEndPos, 0, ease);
    };

    // Constrói o botão pressionável
    function makePushButton(mesh) {
        var cylinder = mesh.getChildMeshes(false, (node) => { return node.name.indexOf("Cylinder") !== -1 })[0];
        var pushButton = new BABYLON.GUI.MeshButton3D(mesh, "pushButton" + index);
        // pushButton.position = new BABYLON.Vector3(10,10,10);
        pushButton.pointerDownAnimation = () => {
            cylinder.position.y = 0;
        }
        pushButton.pointerUpAnimation = () => {
            cylinder.position.y = 0.21;
        }
        pushButton.pointerEnterAnimation = () => {
            cylinder.material.albedoColor = new BABYLON.Color3(0.21, 1, 0.05);
        };
        pushButton.pointerOutAnimation = () => {
             cylinder.material.albedoColor = new BABYLON.Color3(1, 0, 0);
        };
        pushButton.onPointerDownObservable.add(() => {
            console.log(pushButton.name + " pushed.");
            if (pushButtonSound && pushButtonSound.isReady) {
                pushButtonSound.play();
                addSomeSpheres(qtd_Elementos-1);
            }
        });
        panelCylinder.addControl(pushButton);
        index++;
    }  

    // # Cria a luz e a atmosfera
    function createSkyboxAndLight() {
        // Define a general environment texture
        hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/textures/environment.dds", job_2ET);
        job_2ET.environmentTexture = hdrTexture;

        // Let's create a color curve to play with background color
        var curve = new BABYLON.ColorCurves();
        curve.globalHue = 10;
        curve.globalDensity = 10;

        var box = job_2ET.createDefaultSkybox(hdrTexture, true, 200, 0.7);
        box.infiniteDistance = false;
        box.material.imageProcessingConfiguration = new BABYLON.ImageProcessingConfiguration();
        box.material.cameraColorCurvesEnabled = true;
        box.material.cameraColorCurves = curve;
        box.name = "MYMESHFORSKYBOX";
        box.isPickable = false;

        directionalLight = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(-0.2, -1, 0), job_2ET)
        directionalLight.position = new BABYLON.Vector3(100 * 0.2, 100 * 2, 0)
        directionalLight.intensity = 4.5;

    // Cria a ATMOSFERA # TROCAR POR UM CÉU NOTURNO
    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, job_2ET, undefined, BABYLON.Mesh.BACKSIDE);
    var skyboxMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", job_2ET);
    // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/TropicalSunnyDay", job_2ET);
    // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/Cerebro", job_2ET);
    skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets/skybox/1.hdr", job_2ET, 512);
    //textures/forest.hdr

    
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = skyboxMaterial;
    }
   
    // Permite interagir enquanto pausado
    function sleep1(milliseconds) {
        setTimeout(() => { console.log("World!"); }, milliseconds);
    }

    // Não permite interagir enquanto pausado
    function sleep2(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    function reconheceFala() {
        // var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        // var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
        // var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
        // var elementos = ['um', 'UM', 'Um', 'green', 'purple', 'red', 'teal', 'white', 'yellow', 'magenta'];
        // var grammar = 'Elementos da gramática: ' + elementos.join(' | ') + ' ;';
        // console.log(grammar);
    
        // var speechRecognitionList = new SpeechGrammarList();
        // speechRecognitionList.addFromString(grammar, 1);

        // Object for matching colors
        //    const elementoArray = [];
        //    const elementoMatchList = {
        //        white: BABYLON.Color3.White(),
        //        magenta: BABYLON.Color3.Magenta(),
        //        teal: BABYLON.Color3.Teal(),
        //        red: BABYLON.Color3.Red(),
        //        gray: BABYLON.Color3.Gray(),
        //        green: BABYLON.Color3.Green(),
        //        blue: BABYLON.Color3.Blue(),
        //        black: BABYLON.Color3.Black(),
        //        yellow: BABYLON.Color3.Yellow(),
        //        purple: BABYLON.Color3.Purple()
        //    }
     
          
        // Inicia o reconhecimento
        recognition.start();
        
        // recognition.grammars = speechRecognitionList;
        recognition.continuous = false;
        recognition.lang = 'pt-BR'; // Funciona para qualquer língua, independente deste parametro
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
    
        // Exibe o resultado reconhecido
        recognition.onresult = function (event) {
            console.log(event.results[0]);
            var elemento = event.results[0][0].transcript;
            
            // quebrar (strip) a string elemento em varias (de acordo com a qtd de elementos sorteados), usando '.' OU ',' OU ' ' como separador

            console.log('Elemento: ' + elemento);
            // console.log('Elemento: ' + elemento[0]);
            // console.log('Elemento: ' + elemento[1]);
            // console.log('Elemento: ' + elemento[0][0]);
            //  Change Confidence textblock content
            textblock_Resposta.text = elemento.toUpperCase();       
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
            console.log("Não reconheci essa palavra.");
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

    // Realiza a leitura de textos associados a elementos presentes na cena por meio de sintese
    function leituraTexto(box, bola) {
        let synth = window.speechSynthesis;
        let rate = 1;
        let pitch = 1;

        job_2ET.onPointerUp = function (evt, pickResult) {
            if (evt.button === 0) {
                if (pickResult.hit) {
                    var meshName = pickResult.pickedMesh.name;
                    console.log(pickResult.pickedMesh.name);
                    if (meshName == "box") {
                        meshName = box.metadata.speech;
                    }
                    else if (meshName == "bola") {
                        meshName = bola.metadata.speech;
                    }

                    let msg = new SpeechSynthesisUtterance(meshName);
                    let voices = synth.getVoices();
                    // console.log(voices); //1; 16; 21
                    msg.voice = voices[21];
                    msg.rate = rate;
                    msg.pitch = pitch;

                    // Iniciou a leitura
                    msg.onstart = function (e) {
                        pickResult.pickedMesh.renderOverlay = true;
                        pickResult.pickedMesh.overlayColor = BABYLON.Color3.Blue();
                        console.log(meshName);
                    };

                    // Finalizou a leitura
                    msg.onend = function (e) {
                        pickResult.pickedMesh.renderOverlay = false;
                    };
                    window.speechSynthesis.speak(msg);
                }
            }
        };
    }

    // Grava em vídeo ao pressionar G, na duração passada como parâmetro
    function gravaTela(event) {
        if(event.keyCode == 71){ 
            // Verifique o suporte para gravação
            if (BABYLON.VideoRecorder.IsSupported(engine)) {
                var recorder = new BABYLON.VideoRecorder(engine);
                // recorder.startRecording("tarefa_01_ET.mpeg, tempo");
                // recorder.startRecording("tarefa_01_ET.mp4", tempo);
                // recorder.startRecording("tarefa_01_ET.webm", tempo);
                // Grava e quanto termina emite um aviso
                recorder.startRecording("tarefa_01_ET.webm", 10).then(() => {
                    alert("Gravação concluída!");
                });
            }  
        }
    }
        
        

};//Fim da tarefa <-----------------------------------------------------------------------<<<

//-----------------Início do MediaPipe---------------------------------

const videoInput = document.getElementsByClassName('input_video')[0];
const canvasOutput = document.getElementsByClassName('output_canvas')[0];
// const canvasCtx = canvasOutput.getContext('3d');

function onResults(results) {
    // canvasCtx.save();
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {

            // Pega os pontos
            pegarPontos(landmarks);
            ponto = landmarks;
          
            // Desenha os contornos
            // drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
            // drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
    }
    // canvasCtx.restore();
}
const hand = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hand.setOptions({
    selfieMode: true,
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

hand.onResults(onResults);

const cameraPlayer = new Camera(videoInput, {
    onFrame: async () => {
        await hand.send({ image: videoInput });
    },
    width: 350,
    height: 180
});

// Inicializar a camera do player
// cameraPlayer.start();

 function pegarPontos(pontos) {
     window.pegar(pontos);
     console.log("Pontos: ", pontos);
}
//-----------------Fim do MediaPipe---------------------------------

window.initFunction = async function () {
    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = create_Tarefa();
};
initFunction().then(() => { sceneToRender = scene });

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});



