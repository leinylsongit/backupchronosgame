var canvas = document.getElementById("canvasPrimario");
var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;

//const videoElement = document.getElementsByClassName('input_video')[0];
// canvasElement = document.getElementsByClassName('menu')[0];
// canvasCtx = canvasElement.getContext('3d');

var createDefaultEngine = function() { 
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); 
};

// Cena do Menu Principal do Jogo
var create_Menu = function () {
    engine.enableOfflineSupport = false;
    
    // Animação de Carregando
    engine.displayLoadingUI();  
    
    // Cria a cena do MENU
    var scene_Menu = new BABYLON.Scene(engine);

    // Adiciona a CÂMERA
    var camera = createCamera(scene_Menu);
    
    // Adiciona as fontes de LUZ 
    var light = createLight(scene_Menu);

    // Adiciona as SOMBRAS
    var shadow = createShadow(light);
    
    // Definição da Interface do Usuário
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var UiPanel = new BABYLON.GUI.StackPanel();
    UiPanel.width = "220px";
    UiPanel.fontSize = "14px";
    UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(UiPanel);

    // Botão Start
    var Button_Start = BABYLON.GUI.Button.CreateSimpleButton("butStart", "Start");
    Button_Start.paddingTop = "10px";
    Button_Start.width = "100px";
    Button_Start.height = "50px";
    Button_Start.color = "white";
    Button_Start.background = "black";
    Button_Start.onPointerDownObservable.add(()=> {
        if (Button_Start){           
            document.write("<canvas id='canvasPrimario' width='1520' height='840'></canvas><script src='js/mundoExploratorio.js'></script>");            
            console.log("apertou START");     
            Button_Start = 0;
        }
    });
    UiPanel.addControl(Button_Start);

    /*var checkbox = new BABYLON.GUI.Checkbox();
    checkbox.width = "20px";
    checkbox.height = "20px";
    checkbox.isChecked = doMorphing;
    checkbox.color = "green";
    checkbox.onIsCheckedChangedObservable.add(function(value) {
        doMorphing = value;    });

    stack2.addControl(checkbox);*/

    // Oculta a animação de carregando
    engine.hideLoadingUI();

    pause = false;
        
        scene_Menu.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "a": //Executa o jogo do início
                            button_Start.background = "blue";
                        break

                        case "b": //Continua o jogo de onde parou
                            button_Continue.background = "blue";
                        break
                        case "c": //Finaliza o jogo
                            button_Sair.background = "blue";
                        break

                        case "1": //Alterna para 1ª pessoa
                            camera.lowerRadiusLimit = 1;
                            camera.upperRadiusLimit = 0; 
                            camera.wheelDeltaPercentage = 0.01;  
                        break

                        case "2": //Alterna para 3ª pessoa
                            camera.lowerRadiusLimit = 4;
                            camera.upperRadiusLimit = 100;
                            camera.wheelDeltaPercentage = 0.01;                       
                        break

                        case "3": //Alterna para visão total do ambiente
                            camera.lowerRadiusLimit = 60;
                            camera.upperRadiusLimit = 600; 
                            camera.radius = 30; 
                        break

                        case "p": //Pausar/Despausar o jogo
                            if (!pause){
                                // Rotaciona a camera orbitando o herói
                                scene_Menu.activeCamera.useAutoRotationBehavior = true;
                                // Desabilitar controle?
                                //Desligar a câmera?
                                pause = true;
                            }
                            else{
                                // Para a rotação da camera
                                scene_Menu.activeCamera.useAutoRotationBehavior = false;
                                // Resetar posição da camera
                                // Habilitar controle?
                                //Ligar a câmera?
                                pause = false;
                            }
                        break
                    }
            }
        });
    
    // // Adiciona o AMBIENTE
    // BABYLON.SceneLoader.ImportMesh("", "./ambiente/", "estadio.glb", scene_Mundo, function(mesh_ambiente){
    //     // mesh_ambiente[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
    //      mesh_ambiente[0].position = new BABYLON.Vector3(0, 0, 0);
    //  });
        
    // Adiciona elemento do ambiente
    // BABYLON.SceneLoader.ImportMesh("", "./ambiente/", "parabens.glb", scene_Mundo, function(mesh_elemento){
    //    // mesh_elemento[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
    //    mesh_elemento[0].position = new BABYLON.Vector3(0, 2, -18);
    // });   

    // Atmosfera
    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, scene_Menu, undefined, BABYLON.Mesh.BACKSIDE);
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene_Menu);
    backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene_Menu);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;

    return scene_Menu;
}

function createCamera(scene_Mundo) {
    // Camera em 3ª pessoa
    //---> Age como um satélite em órbita ao redor de um alvo e sempre aponta para a posição do alvo.
    var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / -2, Math.PI / 2, 3.5, new BABYLON.Vector3(0, 2, -22), scene_Mundo);

    //o único a escolher para jogos do tipo tiro em primeira pessoa, e funciona com todo o teclado, mouse, toque e gamepads. Com esta câmera você pode verificar colisões e aplicar gravidade
    //Universal Camera
    // var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -10), scene_Mundo);
    
    // Targets the camera to a particular position. In this case the scene origin
    //    camera.setTarget(BABYLON.Vector3.Zero());
    //camera.setTarget(mesh_Heroi);
        
    // Escolhe uma malha como alvo e a segue enquanto ela se move. (Duas opções: freefollowCamera e arcFollowCamera)
    // Follow Camera
    
    //Câmeras de orientação do dispositivo - projetadas para reagir a um dispositivo sendo inclinado para frente ou para trás e para a esquerda ou para a direita
    // Device Orientation Cameras
    //gráficos 2D na tela que são usados ​​para controlar a câmera ou outros itens de cena
    
    // Virtual Joysticks Camera
    // câmeras para dispositivos VR
    
    camera.attachControl(canvas, false);
    camera.lowerRadiusLimit = 1;
    camera.upperRadiusLimit = 1000; //Alterar limite posteriormente para 2
    camera.wheelDeltaPercentage = 0.01;
    // camera.radius = 30; // Determina a altura inicial da camera

    // camera.heightOffset = 8;
    //  camera.rotationOffset = 180;
    // camera.cameraAcceleration = 0.005
    // camera.maxCameraSpeed = 10
    
    //  scene_Mundo.activeCamera.beta -= 0.2; // Pociciona a camera em um ângulo especificado

    return camera;
}

function createShadow(light) {
    var shadow = new BABYLON.ShadowGenerator(1024, light);
    // var shadow = new BABYLON.ShadowGenerator(2048, light);
    shadow.useBlurExponentialShadowMap = true;
    shadow.blurKernel = 32;
    return shadow;
}

function createLight(scene_Mundo) {
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene_Mundo);
    // light1.intensity = 0.6;
    //light1.specular = BABYLON.Color3.Black();

    var light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(0, -0.5, -1.0), scene_Mundo);
    light2.position = new BABYLON.Vector3(0, 5, 5);
    //light2.intensity = 0.6;
    //light2.specular = BABYLON.Color3.Black();
    return light2;
}

window.initFunction = async function() {
    var asyncEngineCreation = async function() {
        try {
        return createDefaultEngine();
        } catch(e) {
        console.log("the available createEngine function failed. Creating the default engine instead");
        return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
        startRenderLoop(engine, canvas);
        window.scene = create_Menu();};
        initFunction().then(() => {sceneToRender = scene                    
    });

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});