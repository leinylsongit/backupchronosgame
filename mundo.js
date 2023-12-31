// "use strict"; // altera o comportamento de alguns scripts de forma a evitar erros comuns e aumentar a segurança do código.
// Mundo: 167 MB (29/12/2022)

// chronos.gui
// chronos.colide
// chronos.efeito
// chronos.movePlayer

// Adicionar elementos no mundo que testem a percepção do tempo, além das tarefas

// Obtém um elemento canvas do DOM (Modelo de Objeto de Documento) com o id "canvasPrimario".
//  Este elemento canvas será utilizado para desenhar a cena 3D.
var canvas = document.getElementById("canvasPrimario");

// Antes de renderizar a cena, verifica se existe uma cena a ser renderizada (sceneToRender)
//  e se essa cena possui uma câmera ativa.
var sceneToRender = null;

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}


var createDefaultEngine = function () {
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
};

// Elementos 3d-------------------------------------------------------------------
// Player
const player = 'assets/personagens/players/ybot.babylon';

// Abelha
const abelha = './assets/animais/Bee.glb';
// const abelha = './assets/animais/Beija-flor.glb';


// Elementos de construções
// const towerURL = "assets/ambiente/tower/TowerHouse.obj";
// const labirinto = './assets/ambiente/labirinto_01.glb';
const labirinto = './assets/ambiente/labirinto/maze1.glb';
// const labirinto = './assets/ambiente/labirinto/maze2.obj';

// Carregue o labirinto como um objeto 3D
// const labirinto = BABYLON.OBJFileLoader.Load("assets/ambiente/labirinto/maze2.obj");

    
// SIG
// const sig = './assets/personagens/npc/sig.glb';

// Mentor
const mentor = './assets/personagens/npc/Old_Man_separado/Old_Man_convertido_separado.gltf';
// const mentor = './assets/personagens/npc/Homem_andando.fbx'; // Converter....
// const mentor = './assets/personagens/npc/Astronauta.glb';


// Outlier
// const outlier = './assets/personagens/npc/outlier.glb';

// NPC's
const emogi = './assets/itens/Carinha_Olhos.glb';

// Elementos da natureza
const cacto_1 = './assets/plantas/Cacto_1.glb';
const cacto_2 = './assets/plantas/Cacto_2.glb';
const macieira = './assets/plantas/Macieira.glb';
const pinheiro_nevado = './assets/plantas/Pinheiro Nevado.glb';
const bordo = './assets/plantas/Bordo.glb';
const folhas_caindo = './assets/plantas/Folhas_caindo.glb';
const pilha_folhas = './assets/plantas/Pilha de folhas.glb';

// Skyboxes 
const atmosfera = 'assets/skybox/TropicalSunnyDay';
// const atmosfera = 'assets/skybox/TropicalSunnyDay';


// Elementos sonoros--------------------------------------------------------------
var narrador = true; // checkbox
var som_Ambiente = false; // checkbox
var som_Efeitos = true; // checkbox

const Ambiente_Calmo = 'assets/sounds/soundtracks/Ambiente_Calmo_01.mp3';
// const Ambiente_Suspense = 'assets/sounds/soundtracks/Ambiente_Suspense.mp3';

var explosao = 'assets/sounds/effects/explosao.mp3';
var chuva = 'assets/sounds/effects/chuva.mp3';
var fogo = 'assets/sounds/effects/fogo.mp3';

//#checkbox 1ª ou 3ª pessoa
var firstPerson = false;

// Animações
var skeleton_Heroi = null; // utilizada para acessar e controlar o esqueleto do personagem.

var idleAnim = null;
var walkAnim = null;
var runAnim = null;
var sprintAnim = null;
var jumpAnim = null;

var animationBlend = 0.005; // controla a velocidade com que as animações são misturadas entre si.
var mouseSensitivity = 0.0005; // controla a sensibilidade do mouse ao mover a câmera.
var cameraSpeed = 0.0075; // controla a velocidade da câmera ao se mover pelo cenário.

var walkSpeed = 0.001; // controla a velocidade do personagem ao andar pelo cenário.
var runSpeed = 0.005; // controla a velocidade do personagem ao correr pelo cenário.
var sprintSpeed = 0.008; // controla a velocidade do personagem ao sprintar pelo cenário.
var jumpSpeed = 0.1; // controla a velocidade do personagem ao pular.
var jumpHeight = 0.5; //  controla a altura do salto do personagem.

// o que significa que a gravidade é de 0 na direção X, -0.5 na direção Y e 0 na direção Z.
//  Isso significa que o personagem cairá para baixo (na direção Y negativa) 
// com uma força de gravidade de 0.5.
var gravity = new BABYLON.Vector3(0, -0.5, 0);

// Variáveis alteradas no jogo
var speed = 0; // velocidade atual do personagem. O personagem está parado no início do jogo.
var vsp = 0; // velocidade vertical do personagem. O personagem não está subindo ou descendo no início do jogo.
var jumped = false; // indica se o personagem está saltando ou não.
var mouseX = 0, mouseY = 0; // coordenadas atuais do mouse.
var mouseMin = -35, mouseMax = 45; // limites mínimo e máximo de rotação da câmera em torno do eixo X.

// Cenário do Mundo Exploratório
var create_Mundo = function () {
    
    // Faz com que o motor de renderização baixe todos os recursos necessários 
    // para a cena 3D e os armazene localmente, permitindo que a cena seja renderizada 
    // mesmo quando o usuário estiver offline.
    engine.enableOfflineSupport = false;
    // engine.enableOfflineSupport = true;

    // Utilizado para decomposeLerp e interpolação de matrizes
    // BABYLON.Animation.AllowMatricesInterpolation = true;

    // // Animação de Carregando
    // engine.displayLoadingUI();

    // Cria a cena do MUNDO
    var scene_Mundo = new BABYLON.Scene(engine);

    // Adiciona física ao cenário
    scene_Mundo.collisionsEnabled = true;
    scene_Mundo.gravity = new BABYLON.Vector3(0, -9.81, 0);
    // scene_Mundo.enablePhysics();

    // Cria um efeito de neblina na cena, útil para esconder os limites do cenário
    // e dar uma sensação de distância.
    scene_Mundo.fogEnabled = false; // desabilitada
    scene_Mundo.fogMode = BABYLON.Scene.FOGMODE_EXP2; // tipo de neblina
	scene_Mundo.fogDensity = 0.01; // densidade da neblina
    scene_Mundo.fogColor = new BABYLON.Color3(0.8, 10.9, 1.0); // cor da neblina
    scene_Mundo.clearColor = scene_Mundo.fogColor; // A cor de limpeza da cena (a cor que é usada para limpar a tela a cada frame)

    // Adiciona a CÂMERA
    // var camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3.Zero(0, 0, 0), scene_Mundo);

    var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 0, 30), scene_Mundo);
    
    // var camera = new BABYLON.VirtualJoysticksCamera("VJ_camera", new BABYLON.Vector3(0, 1, -15), scene_Mundo);
    
    scene_Mundo.activeCamera = camera;
    scene_Mundo.activeCamera.attachControl(canvas, true);// para usar o scrool deve estar habilitada

    camera.lowerRadiusLimit = 5; // Limite de zoom in
    camera.upperRadiusLimit = 100; // Limite de zoom out
    camera.wheelDeltaPercentage = 0.01; // Velocidade do zoom do mouse
    camera.radius = 30;
    // camera.lowerBetaLimit = 0.1; // Limite da visão inferior
    // camera.upperBetaLimit = (Math.PI / 2) * 0.9; // Limite da visão superior
    // camera.pinchDeltaPercentage = 0.01;
    // camera.minZ = 0.1;

    // camera.inputs.clear();

    // camera.ellipsoid = new BABYLON.Vector3(0.5,1, 0.5);
    // drawEllipsoid(camera);



    // Adiciona as fontes de LUZ 
    // var hemLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene_Mundo);
	// hemLight.intensity = 0.7;
	// hemLight.specular = BABYLON.Color3.Black();
    // hemLight.groundColor = scene_Mundo.clearColor.scale(0.75);

    // scene_Mundo.createDefaultCameraOrLight(false, false, false);// FUNCIONA BLZ

    // Adiciona as LUZES
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene_Mundo);
    light1.intensity = 0.6;
    light1.specular = BABYLON.Color3.Black();

    var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene_Mundo);
    light2.position = new BABYLON.Vector3(0, 5, 5);

    // var lightPoint = new BABYLON.PointLight("PointLight", new BABYLON.Vector3(20, 20, 10), scene_Mundo);
    // lightPoint.intensity = 0.7;


    // Adiciona as SOMBRAS
    // var shadowGenerator = new BABYLON.ShadowGenerator(3072, light2);
    // shadowGenerator.usePercentageCloserFiltering = true;
    
    
    
    
    
    if (som_Ambiente)
        var music = new BABYLON.Sound("Ambiente_Calmo", Ambiente_Calmo, scene_Mundo, null, { loop: true, autoplay: true });







    //------------------------------- Cria o plano do chão ----------------------------------
    var groundSize = 150;
    var ground = BABYLON.Mesh.CreateGround("ground", groundSize, groundSize, 5, scene_Mundo);
    // ground.position.y = -7;

    // Cria a textura do chão
    var grade = new BABYLON.GridMaterial("grade", scene_Mundo);
    grade.gridRatio = 1;
    // grade.lineColor = new BABYLON.Color3.White();
    // grade.mainColor = new BABYLON.Color3.Black();
    // grade.alpha = 0.3;
    // grade.majorUnitFrequency = 10;    
    // ground.fogEnabled = true;
    ground.material = grade;
    // ground.visibility = false; //Oculta o elemento

    // Cria uma repetição do material 
    // var texturaNitLab = new BABYLON.StandardMaterial("nitlab", scene_Mundo);
    // texturaNitLabw.diffuseTexture = new BABYLON.Texture("assets/textures/flare.png", scene_Mundo);
    // // texturaNitLab.diffuseTexture.uScale = 2.0;//Repeat 2 times on the Vertical Axes
    // texturaNitLab.diffuseTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
    // texturaNitLab.backFaceCulling = false;//Always show the front and the back of an element
    // ground.material = texturaNitLab;


    // var addShadows = function(mesh){
    //     mesh.receiveShadows = true;
    //     shadowGenerator.addShadowCaster(mesh);
    // }

    //tps ???
    const dsm = new BABYLON.DeviceSourceManager(engine);
    var deltaTime = 0;


    //character nodes ???
    var main = new BABYLON.Mesh("parent", scene_Mundo);
    // Posição do player
    main.position = new BABYLON.Vector3(15, 0, 0);
    
    var target = new BABYLON.TransformNode();

    // Posição do personagem
    var character = new BABYLON.Mesh("character", scene_Mundo);
    character.position = new BABYLON.Vector3(0, 0, 0);    



    // Configurações da camera
    var firstPersonCamera = {
        middle: {
            position: new BABYLON.Vector3(0, 1.75, 0.25),
            fov: 1.25, // # ??
            mouseMin: -45,
            mouseMax: 45
        },
        far: {
            position: new BABYLON.Vector3(0, 15, 0.25),
            fov: 1.5,
            mouseMin: -5,
            mouseMax: 45
        }
    };

    var thirdPersonCamera = {
        middle: {
            position: new BABYLON.Vector3(0, 1.35, -5),
            fov: 0.8,
            mouseMin: -5,
            mouseMax: 45
        },
        leftRun: {
            position: new BABYLON.Vector3(0.7, 1.35, -4),
            fov: 0.8,
            mouseMin: -35,
            mouseMax: 45
        },
        rightRun: {
            position: new BABYLON.Vector3(-0.7, 1.35, -4),
            fov: 0.8,
            mouseMin: -35,
            mouseMax: 45
        },
        far: {
            position: new BABYLON.Vector3(0, 4, -6),
            fov: 1.5,
            mouseMin: -5,
            mouseMax: 45
        }
    };

    function switchCamera(type){
        camera.position = type.position.divide(camera.parent.scaling);
        camera.fov = type.fov;
        mouseMin = type.mouseMin,
        mouseMax = type.mouseMax
    }



    // Animação de Carregando
    engine.displayLoadingUI();


    // Carrega o Player
    BABYLON.SceneLoader.ImportMesh("", "", player, scene_Mundo, function (mesh_Heroi, particleSystems, skeletons_Heroi){
        skeleton_Heroi = skeletons_Heroi[0];

        var body = mesh_Heroi[1];
        body.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
        body.rotation.y = BABYLON.Tools.ToRadians(180);
        // body.checkCollisions = true;
        //  body.collisionsEnabled = true;

        var joints = mesh_Heroi[0];
        joints.parent = body;
        // joints.checkCollisions = true;
        // joints.collisionsEnabled = true;

        body.parent = character;    

        character.checkCollisions = true; // NAO FAZ DIFERENÇA
        character.collisionsEnabled = true; // NAO FAZ DIFERENÇA

        // Textura do corpo do Player
        body.material = new BABYLON.StandardMaterial("character", scene_Mundo);
        body.material.diffuseColor = new BABYLON.Color3.Blue();// Cor
        // body.material.specularColor = BABYLON.Color3.White(); // Reflexo
        // body.material.emissiveColor = new BABYLON.Color3.Red();

        // body.material.ambientColor = new BABYLON.Color3.Blue();

        // body.material.alpha = 0.8;
        // body.material.wireframe = true;

        // Textura das juntas do Player
        joints.material = new BABYLON.StandardMaterial("joints", scene_Mundo);
        joints.material.emissiveColor = BABYLON.Color3.Green();
        joints.material.specularColor = BABYLON.Color3.Blue();
        // joints.material.alpha = 0.5;

        

        // addToMirror(character);
        // addShadows(character);

        var idleRange = skeleton_Heroi.getAnimationRange("None_Idle");
        var walkRange = skeleton_Heroi.getAnimationRange("None_Walk");
        var runRange = skeleton_Heroi.getAnimationRange("None_Run");
        var sprintRange = skeleton_Heroi.getAnimationRange("None_Sprint");
        var jumpRange = skeleton_Heroi.getAnimationRange("None_Jump");

        idleAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, idleRange.from+1, idleRange.to, 1.0, true);
        walkAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, walkRange.from+1, walkRange.to, 0, true);
		runAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, runRange.from+1, runRange.to, 0, true);
        sprintAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, sprintRange.from+1, sprintRange.to, 0, true);
        jumpAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, jumpRange.from+1, jumpRange.to, 0, true);
		
    
        // #TIRAR!!!!// Elipse para verificar as colisões 
        // main.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
        // main.ellipsoidOffset = new BABYLON.Vector3(0, 0.9, 0);
        // drawEllipsoid(main);

        main.checkCollisions = false;  
        
        // character.ellipsoidOffset = new BABYLON.Vector3(0, 0.9, 0);
        // drawEllipsoid(character);
        
        
        character.parent = main;
        target.parent = main;
        

        // Alterna a camera de acordo com a opção escolhida
        if (firstPerson == true){
            camera.parent = character;
            switchCamera(firstPersonCamera.middle); // Centralizado
            // switchCamera(firstPersonCamera.far); // Distante
        }else{
            camera.parent = target;
            // switchCamera(thirdPersonCamera.leftRun); // Lado esquerdo
            // switchCamera(thirdPersonCamera.rightRun);// Lado direito
            switchCamera(thirdPersonCamera.middle);     // Centralizado
            // switchCamera(thirdPersonCamera.far);     // Distante
        }




        // # Procurar o lcoal correto para isso.  Oculta a animação de carregando
        engine.hideLoadingUI();


        // Interação com Player usando a mão
        // control_Player(skeleton_Heroi, scene_Mundo);
        var mesh_Heroi = mesh_Heroi[1];


        var t = 0; // ?
        var j = 0; // Vetor com os pontos dos dedos
        var novoValor = 0;// ?
        
        pegar = function(p){
            j = p; 
        };
        
        // 4: polegar, 8: indicador, 12: maior de todos, 20: mindinho, 16: anelar
        // pq multiplica por 5? escala??
        // Usar o 4 para mover na horizontal (DESVIAR)
        // Usar o 8 para mover na vertical (SALTAR)
        // Usar o 12 para olhar para cima e baixo
        // Usar o 20 para  olhar para esquerda e direita
        // Usar o 16 para dar zoom da tela

        scene_Mundo.beforeRender = function(){
            // t += .1;
            if(j != 0){// pq verificar se é diferente de zero?
                //mesh_Heroi.rotation = new BABYLON.Vector3(0, 0, j[4].x * (5));//z
                // mesh_Heroi.position = new BABYLON.Vector3(0, 0, j[4].x * (5));//z
                // mesh_Heroi.position = new BABYLON.Vector3(0, j[4].y*(-0.5) + 0.5, 0);//y (saltar quando mover para cima)
                // mesh_Heroi.position = new BABYLON.Vector3(j[4].x * (5), 0, 0);//x (desloca ao mover horizontalmente)
                // mesh_Heroi.position = new BABYLON.Vector3(j[4].x*(6), 0, 0);//x (desloca ao mover horizontalmente)

                // mesh_Heroi.position = new BABYLON.Vector3(j[4].x*(3), j[8].y * 0.4, 0);
                            
                
                //# Habilitar o zoom para funcionas apenas com a mão esquerda!!!!!!!!!!
                // camera.position = new BABYLON.Vector3(1, 1.5, j[12].z * -60); // zoom quando aproxima ou afasta o dedo
                
                // 0: Pulso
                // camera.position = new BABYLON.Vector3(1, 1.5, j[0].z * -60); // zoom quando aproxima ou afasta o dedo


                console.log("j: ",j);
                console.log("j[4].x: ",j[4].x);
                console.log("j[8].y: ",j[8].y);
            }
        };

        // Interação com Camera usando a mão
        // control_Player(Camera, scene_Mundo);
        // mesh_Heroi = mesh_Heroi[1];
                
        // var j = 0;
        
        // pegar = function(p){
        //     j = p; 
        // };
        
        // // 12: maior de todos, 20: mindinho, 16: anelar
        // // Usar o 12 para olhar para cima e baixo
        // // Usar o 20 para  olhar para esquerda e direita
        // // Usar o 16 para dar zoom da tela

        // scene_Mundo.beforeRender = function(){
        //     if(j != 0){// pq verificar se é diferente de zero?
        //         // main.position = new BABYLON.Vector3(j[12].x, j[20].y, j[16].z);
        //        // camera.position = new BABYLON.Vector3(j[12].x, j[20].y, j[16].z);
        //     //    camera.position = new BABYLON.Vector3(j[12].x * 5, 5, 10);
        //     // camera.position = new BABYLON.Vector3(0, j[12].y *4 , 10);
        //     camera.position = new BABYLON.Vector3(1, 1.5, j[12].z * -60); // zoom quando aproxima ou afasta o dedo
            
        //     // move o player junto com a camera
        //     // main.position = new BABYLON.Vector3(1, 1.5, j[12].z * -60); // zoom quando aproxima ou afasta o dedo
            
            
        //         console.log("j[12].x: ",j[12].x);
        //         console.log("j[20].y: ",j[20].y);
        //         console.log("j[16].z: ",j[16].z);
        //     }
        // };

        
        
        
        // Fazer player mover para local do clique

//         scene_Mundo.registerBeforeRender(function (){
// // Obtém a malha do personagem
// // var character = scene_Mundo.getMeshByName("character");
// // var event;
// // Adiciona um evento de clique do mouse à cena
// scene_Mundo.onPointerObservable.add(function(event) {
//   // Verifica se o evento é um clique do mouse
//   if (event !== null && event !== undefined && event.type === BABYLON.PointerEventTypes.POINTERDOWN) {
//     // Obtém a posição do clique na tela
//   //  var clickPos = event.pointer.position;
//     // Imprime a posição do clique na tela
//     // console.log("Posição do clique: (" + clickPos.x + ", " + clickPos.y + ")");

//     // Converte a posição do clique para coordenadas de mundo
//     // var clickWorldPos = BABYLON.Vector3.Unproject(
//     //   new BABYLON.Vector3(clickPos.x, clickPos.y, 0),
//     //   scene_Mundo.getEngine().getRenderWidth(),
//     //   scene_Mundo.getEngine().getRenderHeight(),
//     //   BABYLON.Matrix.Identity()
//     // );

//     // Atualiza a posição do personagem para a posição do clique
//     body.position.x = 0;
//     joints.position.y += 0.01;
//     body.position.z = 0;

//     //main: move a camera e player juntos
//     //target: move a camera 
//     //body/character: move o player
//   }
// });
        // });
        //# Adiciona o LABIRINTO!!
        BABYLON.SceneLoader.ImportMesh("", "", labirinto, scene_Mundo, function (mesh_Labirinto){
            const Labirinto = mesh_Labirinto[0];

            // labirinto = BABYLON.Mesh.MergeMeshes([mesh_Labirinto, box]);
            // mesh_Labirinto[0].scaling = new BABYLON.Vector3(10, 1, 1);
            // mesh_Labirinto[0].position = new BABYLON.Vector3(0, 5.1, 0);
            // // addToMirror(mesh_Labirinto);
            // // addShadows(mesh_Labirinto);
            mesh_Labirinto.collisionsEnabled = true;
            mesh_Labirinto.checkCollisions = true;

    //         // Adicione colisão ao personagem
    // player.addPhysics(null, BABYLON.PhysicsEngine.BoxImpostor, { mass: 1, restitution: 0.5 });
    
            // Adicione um componente de física às paredes do labirinto
            // Labirinto.addPhysics(null, BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, restitution: 0.9 });
        });

});


    // Adiciona a ABELHA
        // var abelha = null;
        BABYLON.SceneLoader.ImportMesh("", "", abelha, scene_Mundo, function (mesh_Bee, particleSystems, skeletons_Bee) {
            mesh_Bee[0].scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
            mesh_Bee[0].position = new BABYLON.Vector3(0, 0, 25);

            mesh_Bee[0].collisionsEnabled = true;
            mesh_Bee[0].wireframe = true;


            // Elipse para verificar as colisões
            mesh_Bee[0].ellipsoid = new BABYLON.Vector3(9, 8, 8);
            mesh_Bee[0].ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
            mesh_Bee[0].checkCollisions = true;

            // Exibe a elipse que envolve a abelha
            // drawEllipsoid(mesh_Bee[0]);

            // skeleton_Bee = skeletons_Bee[];

            // var flyBee = skeleton_Bee.getAnimationRange("fly");
            // flyBee_Anim = scene_Mundo.beginWeightedAnimation(skeleton_Bee, flyBee.from, flyBee.to, 0, true);

            // flyBee_Anim;
    }); 


    // Determina as teclas das ações
    scene_Mundo.registerBeforeRender(function(){
        deltaTime = engine.getDeltaTime();

        updateCamera();
        // updateCameraPipe();
        
        if (character != null){
            var keyboard = dsm.getDeviceSource(BABYLON.DeviceType.Keyboard);
            var mouse = dsm.getDeviceSource(BABYLON.DeviceType.Mouse);
            if (keyboard){
                if (firstPerson == true){
                    firstPersonMovement(
                        keyboard.getInput(87), //W
                        keyboard.getInput(83), //S
                        keyboard.getInput(65), //A
                        keyboard.getInput(68), //D
                        keyboard.getInput(16), //Shift
                    );
                }else{
                    thirdPersonMovement(
                        keyboard.getInput(87), //W
                        keyboard.getInput(83), //S
                        keyboard.getInput(65), //A
                        keyboard.getInput(68), //D
                        keyboard.getInput(32), //Space
                        keyboard.getInput(16), //Shift
                    );
                }
            }
        }
    });


    // Movimentação do mouse
    var mouseMove = function(e){
        var movementX = e.movementX ||
                e.mozMovementX ||
                e.webkitMovementX ||
                0;

        var movementY = e.movementY ||
                e.mozMovementY ||
                e.webkitMovementY ||
                0;
        
        mouseX += movementX * mouseSensitivity * deltaTime;
        mouseY += movementY * mouseSensitivity * deltaTime;
        mouseY = clamp(mouseY, mouseMin, mouseMax);
    }


    function updateCamera(){
        target.rotation = lerp3(
            target.rotation, 
            new BABYLON.Vector3(
                BABYLON.Tools.ToRadians(mouseY),
                BABYLON.Tools.ToRadians(mouseX), 0
                // BABYLON.Tools.ToRadians(target.rotation.x),
                // BABYLON.Tools.ToRadians(target.rotation.y), 0
            ), cameraSpeed*deltaTime
        );
    }


    // function updateCamera(){
    //     main.rotation = lerp3(
    //         main.rotation, 
    //         new BABYLON.Vector3(
    //             BABYLON.Tools.ToRadians(mouseY),
    //             BABYLON.Tools.ToRadians(mouseX), 0
    //             // BABYLON.Tools.ToRadians(target.rotation.x),
    //             // BABYLON.Tools.ToRadians(target.rotation.y), 0
    //         ), cameraSpeed*deltaTime
    //     );
    // }



    function updateCameraPipe(){
        target.rotation = lerp3(
            target.rotation, 
            new BABYLON.Vector3(dedo, dedo, 0), 
            cameraSpeed*deltaTime
        );
    }



    // Movimentação em 3ª pessoa
    function thirdPersonMovement(up, down, left, right, jump, run){
        var directionZ = up-down;
        var directionX = right-left;

        var vectorMove = new BABYLON.Vector3.Zero();
        var direction = Math.atan2(directionX, directionZ);

        var currentState = idleAnim;
        

        //move
        if (directionX != 0 || directionZ != 0){
            if (run != 1){
                currentState = runAnim;
                speed = lerp(speed, runSpeed, runAnim.weight);
            }else{
                currentState = sprintAnim;
                speed = lerp(speed, sprintSpeed, sprintAnim.weight);
            }

            // Move o player nas 4 direções (OK)
            var rotation = (target.rotation.y+direction) % 360;
            character.rotation.y = lerp(
                character.rotation.y, rotation, 0.25
            );
            
            // # Move a camera na visão do player (Bug)
            //  var rotation = (target.rotation.y+direction) % 360;
            // main.rotation.y = lerp(
            //     main.rotation.y, rotation, 0.25
            // );
            
            // Anda no solo
            vectorMove = new BABYLON.Vector3(
                (Math.sin(rotation)), 0,
                (Math.cos(rotation))
            );

            // Anda para cima (subir escada, levitar...)
            // vectorMove = new BABYLON.Vector3(
            //     0, (Math.cos(rotation)),
            //     0
            // );

        }else{
            speed = lerp(speed, 0, 0.001);
        }


        //jump # Bug, não volta ao normal
        // if (jump == 1 && jumped == false){
        //     jumped = true;
        // }
        // if (jumped == true){
        //     if (vsp < jumpHeight){
        //         vsp += jumpHeight/10;
        //     }else{
        //         vsp += gravity.y/10;
        //         vsp = Math.min(vsp, gravity.y);
        //         if (vsp == gravity.y){
        //             // vsp = gravity.y;
        //             jumped = false;
        //         }
        //     }
        //     var rr = skeleton_Heroi.getAnimationRange("None_Jump");
        //     var a = scene_Mundo.beginAnimation(skeleton_Heroi, rr.from+1, rr.to, false, 1, function(){
        //         jumped = false;
        //         console.log("stopped "+rr.from+1+" "+rr.to);
        //     });
        // }else{
        //     vsp = gravity.y;
        // }


        var m = vectorMove.multiply(new BABYLON.Vector3().setAll( speed*deltaTime ));
        main.moveWithCollisions( m.add(new BABYLON.Vector3(0, vsp, 0)) ); // se pular, cai 
        // main.moveWithCollisions( m.add(new BABYLON.Vector3(0, 0, 0)) );// pula, mas não volta para andar normalmente
        

        switchAnimation(currentState);

        // camera.target = main.position;
    }



    // Movimentação em 1ª pessoa
    function firstPersonMovement(up, down, left, right, run){
        var directionZ = up-down;
        var directionX = right-left;

        var vectorMove = new BABYLON.Vector3.Zero();
        var direction = Math.atan2(directionX, directionZ);

        var currentState = idleAnim;


        if (directionX != 0 || directionZ != 0){
            if (up == 1){
                if (run != 1){
                    currentState = walkAnim;
                    speed = lerp(speed, walkSpeed, walkAnim.weight);
                }else{
                    currentState = runAnim;
                    speed = lerp(speed, runSpeed, runAnim.weight);
                }
            }else{ // Desnecessário
                currentState = "walk";
                speed = lerp(speed, walkSpeed, walkAnim.weight);
            }

            vectorMove = new BABYLON.Vector3(
                (Math.sin( (target.rotation.y + direction) - BABYLON.Tools.ToRadians(180) )), 0,
                (Math.cos( (target.rotation.y + direction) - BABYLON.Tools.ToRadians(180) ))
            );
        }

        character.rotation.y = target.rotation.y - BABYLON.Tools.ToRadians(180);
        camera.rotation.x = target.rotation.x;

        var m = vectorMove.multiply(new BABYLON.Vector3().setAll( speed*deltaTime ));
        main.moveWithCollisions( m.add(gravity) );

        switchAnimation(currentState);
    }



    // Alterna entre diferentes animações em um personagem ou modelo 3D. 
    // Ela recebe um parâmetro anim que é a animação para a qual deve mudar.
    // A função cria um array de animações chamado anims que armazena as animações
    //  idleAnim, runAnim, walkAnim e sprintAnim. 
    // Em seguida, ela itera sobre cada animação no array e atualiza o peso 
    // de cada animação de acordo com a animação passada como parâmetro. 
    // Se a animação atual for igual a anim, o peso da animação é aumentado 
    // usando a variável animationBlend e o delta time. Se não, o peso da animação 
    // é diminuído usando a mesma variável e o delta time.
    // Por fim, o peso de cada animação é limitado a um intervalo de 0 a 1 usando 
    // a função clamp. Isso garante que o peso de cada animação não exceda o 
    // intervalo permitido e evita erros.
    function switchAnimation(anim){
        var anims = [idleAnim, runAnim, walkAnim, sprintAnim];
        
        if (idleAnim != undefined){
            for (var i=0; i<anims.length; i++){
                if (anims[i] == anim){
                    anims[i].weight += animationBlend * deltaTime;
                }else{
                    anims[i].weight -= animationBlend * deltaTime;
                }

                anims[i].weight = clamp(anims[i].weight, 0.0, 1.0);
            }
        }
    }


    // Limita um valor a um intervalo específico, retornando o valor máximo 
    //se o valor for maior do que o máximo, o valor mínimo se o valor for menor 
    //do que o mínimo, e o próprio valor se estiver no intervalo. 
    function clamp(value, min, max){
        return (Math.max(Math.min(value, max), min));
    }

    // Retorna um valor interpolado entre um início e um fim, 
    // com base em uma velocidade específica
    function lerp(start, end, speed){
        return (start + ((end - start) * speed));
    }

    // Faz uma interpolação linear entre dois vetores 3D 
    // usando as funções lerp e BABYLON.Vector3.
    function lerp3(p1, p2, t){
        var x = lerp(p1.x, p2.x, t);
        var y = lerp(p1.y, p2.y, t);
        var z = lerp(p1.z, p2.z, t);

        return new BABYLON.Vector3(x, y, z);
    }


    // Trava o mouse
    // Configure all the pointer lock stuff
    function setupPointerLock(){
        // register the callback when a pointerlock event occurs
        document.addEventListener('pointerlockchange', changeCallback, false);
        document.addEventListener('mozpointerlockchange', changeCallback, false);
        document.addEventListener('webkitpointerlockchange', changeCallback, false);

        // when element is clicked, we're going to request a pointerlock
        canvas.onclick = function(){
            canvas.requestPointerLock = 
                canvas.requestPointerLock ||
                canvas.mozRequestPointerLock ||
                canvas.webkitRequestPointerLock
            ;

            // Ask the browser to lock the pointer
            canvas.requestPointerLock();
        };

    }


    // called when the pointer lock has changed. Here we check whether the
    // pointerlock was initiated on the element we want.
    function changeCallback(e) {
        if (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas ||
            document.webkitPointerLockElement === canvas
        ){
            // we've got a pointerlock for our element, add a mouselistener
            document.addEventListener("mousemove", mouseMove, false);
        } else {
            // pointer lock is no longer active, remove the callback
            document.removeEventListener("mousemove", mouseMove, false);
        }
    };

    // Trava o ponteiro do mouse
//    setupPointerLock();


    // Constrói elementos do cenário
    var box = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene_Mundo);
    box.position = new BABYLON.Vector3(20, 1, 8);
    // addShadows(box);
    box.material = new BABYLON.StandardMaterial("materialGround", scene_Mundo);
    // box.material.emissiveColor = new BABYLON.Color3.Blue();
    box.material.diffuseColor = new BABYLON.Color3.Red();
    box.material.alpha = 0.5;

     // Elipse para verificar as colisões
    //  box.ellipsoid = new BABYLON.Vector3(2.5, 0.2, 2.5);
    //  box.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
    //  drawEllipsoid(box);

     box.checkCollisions = true; // VERMELHA


     var box2 = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene_Mundo);
     box2.position = new BABYLON.Vector3(18, 1, 8);
     
     box2.material = new BABYLON.StandardMaterial("materialGround", scene_Mundo);
     //  box2.material.emissiveColor = new BABYLON.Color3.Green();
     box2.material.diffuseColor = new BABYLON.Color3.Green();
     box2.material.alpha = 0.5;

    //  box2.ellipsoid = new BABYLON.Vector3(2.5, 0.2, 2.5);
    //  box2.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
    //  drawEllipsoid(box2);

     box2.checkCollisions = false; // VERDE


     scene_Mundo.registerBeforeRender(function (){
        if (scene_Mundo.isReady()) {

            // # Optimizar para funcionar com todos os elementos  em um loop
            evento_Colidir(character, box, explode_);
            // evento_Colidir(character, box2, explode_);

            evento_Colidir(character, box2, queima_);

        }
     });

    // Adiciona brilho a tudo
    // var gl = new BABYLON.GlowLayer("gl", scene_Mundo);
    // var pipeline = new BABYLON.DefaultRenderingPipeline(
    //     "pipeline", true, scene_Mundo, [camera]
    // );
    // pipeline.samples = 4;
    // var ssao = new BABYLON.SSAORenderingPipeline('ssaopipeline', scene_Mundo, { ssaoRatio: 0.75, combineRatio: 1.0 }, [camera]);
    // var postProcess = new BABYLON.PostProcess("anamorphic effects", "anamorphicEffects", [], null, 1, camera);

    

    // ground_1.material = new BABYLON.GridMaterial("groundMat");
    
    


   

    var pause = false;

    scene_Mundo.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {
                    case "1": // 1ª visão
                        camera.lowerRadiusLimit = 5;
                        camera.upperRadiusLimit = 100;
                        camera.radius = 20;
                        break

                    case "2": // 2ª visão
                        camera.lowerRadiusLimit = 35;
                        camera.upperRadiusLimit = 200;
                        camera.radius = 20;
                        break
                    
                    case "3": // 3ª visão
                        camera.lowerRadiusLimit = 60;
                        camera.upperRadiusLimit = 600;
                        camera.radius = 30;
                        break

                    case "p": //Pausar/Despausar o jogo
                        if (!pause) {
                            // Rotaciona a camera orbitando o herói
                            scene_Mundo.activeCamera.useAutoRotationBehavior = true;
                            // Desabilitar controle?
                            //Desligar a câmera?
                            pause = true;
                        }
                        else {
                            // Para a rotação da camera
                            scene_Mundo.activeCamera.useAutoRotationBehavior = false;
                            // Resetar posição da camera
                            // Habilitar controle?
                            //Ligar a câmera?
                            pause = false;
                        }
                        break

                        // case "m": // Ativar/Desativar trilha sonora
                        // if (!mudo) {
                        //     //...
                        //     mudo = true;
                        // }
                        // else {
                        //     //...
                        //     mudo = false;
                        // }
                        // break
                }
        }
    });

//      //# Adiciona o LABIRINTO!!
//     BABYLON.SceneLoader.ImportMesh("", "", labirinto, scene_Mundo, function (mesh_Labirinto)
//     // BABYLON.SceneLoader.ImportMesh("", "./assets/ambiente/", "ambiente_01/scene.glb", scene_Mundo, function (mesh_Labirinto)
//     {
//         const Labirinto = mesh_Labirinto[0];

//         // labirinto = BABYLON.Mesh.MergeMeshes([mesh_Labirinto, box]);
//         // mesh_Labirinto[0].scaling = new BABYLON.Vector3(10, 1, 1);
//         // mesh_Labirinto[0].position = new BABYLON.Vector3(0, 5.1, 0);
//         // // addToMirror(mesh_Labirinto);
//         // // addShadows(mesh_Labirinto);
//         // mesh_Labirinto.collisionsEnabled = true;
//         // mesh_Labirinto.checkCollisions = true;

//           // Adicione colisão ao personagem
//   player.addPhysics(null, BABYLON.PhysicsEngine.BoxImpostor, { mass: 1, restitution: 0.5 });

//         // Adicione um componente de física às paredes do labirinto
//         Labirinto.addPhysics(null, BABYLON.PhysicsEngine.BoxImpostor, { mass: 0, restitution: 0.9 });
//     });



    // });

    //# Adiciona o PORTAL NORTE no LABIRINTO!!
     
    // });

    //# Adiciona o PORTAL SUL no LABIRINTO!!
     
    // });

    //# Adiciona o PORTAL SUDESTE no LABIRINTO!!
     
    // });

    //# Adiciona o PORTAL CENTRO-OESTE no LABIRINTO!!
     
    // });

    // Adiciona o GIGANTE
    // BABYLON.SceneLoader.ImportMesh("", Assets.meshes.Yeti.rootUrl, Assets.meshes.Yeti.filename, scene_Mundo, function (mesh_Gigante) {
    //     mesh_Gigante[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    //     mesh_Gigante[0].position = new BABYLON.Vector3(0, 0, 20);

    //     //mesh_Gigante.checkCollisions = true;
    // });

    // Adiciona o personagem personalizado GLTF OK!!
    // BABYLON.SceneLoader.ImportMesh("", "", mentor, scene_Mundo, function (mesh_Old_Man_Separado) {
    //     // mentor.scaling = new BABYLON.Vector3(5, 5, 5);
    //     // mentor.position = new BABYLON.Vector3(0, 3, 5); 

    //     // Elipse para verificar as colisões
    //     mentor.ellipsoid = new BABYLON.Vector3(9, 8, 8);
    //     mentor.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
    //     // mentor.checkCollisions = true;

    //     // Exibe a elipse que envolve o OldMan
    //     drawEllipsoid(mentor);

    // Adiciona o Bordo Japonês
    BABYLON.SceneLoader.ImportMesh("", "", bordo, scene_Mundo, function (mesh_Bordo) {
        mesh_Bordo[0].scaling = new BABYLON.Vector3(30, 30, 30);
        mesh_Bordo[0].position = new BABYLON.Vector3(25, 0, 0);

        mesh_Bordo[0].checkCollisions = true;

    });

    // Adiciona o Cacto simples
    BABYLON.SceneLoader.ImportMesh("", "", cacto_1, scene_Mundo, function (mesh_Cacto_2) {
        mesh_Cacto_2[0].scaling = new BABYLON.Vector3(20, 20, 20);
        mesh_Cacto_2[0].position = new BABYLON.Vector3(45, 0, -3);


    });

    // Adiciona o Cacto realista
    BABYLON.SceneLoader.ImportMesh("", "", cacto_2, scene_Mundo, function (mesh_Cacto_1) {
        mesh_Cacto_1[0].scaling = new BABYLON.Vector3(30, 30, 30);
        mesh_Cacto_1[0].position = new BABYLON.Vector3(45, 0, -2);

    });

    // // Adiciona as Folhas caindo
    // BABYLON.SceneLoader.ImportMesh("", "", folhas_caindo, scene_Mundo, function (mesh_Folhas) {
    //     mesh_Folhas[0].scaling = new BABYLON.Vector3(20, 20, 20);

    //# Adiciona o PORTAL NORDESTE no LABIRINTO!!
     
    //     mesh_Folhas[0].position = new BABYLON.Vector3(25, 0, 0);

    // });
    
    // Adiciona a Pilha de folhas
    BABYLON.SceneLoader.ImportMesh("", "", pilha_folhas, scene_Mundo, function (mesh_Pilha_Folhas) {
        mesh_Pilha_Folhas[0].scaling = new BABYLON.Vector3(50, 50, 50);
        mesh_Pilha_Folhas[0].position = new BABYLON.Vector3(23, 0, 0);
    });

    // Adiciona a Macieira
    BABYLON.SceneLoader.ImportMesh("", "", macieira, scene_Mundo, function (mesh_Macieira) {
        mesh_Macieira[0].scaling = new BABYLON.Vector3(8, 8, 8);
        mesh_Macieira[0].position = new BABYLON.Vector3(20, 0, -10);

        mesh_Macieira.checkCollisions = true;

    });

    // Adiciona a Pinheiro Nevado
    BABYLON.SceneLoader.ImportMesh("", "", pinheiro_nevado, scene_Mundo, function (mesh_Pinheiro) {
        mesh_Pinheiro[0].scaling = new BABYLON.Vector3(5, 5, 5);
        mesh_Pinheiro[0].position = new BABYLON.Vector3(30, 0, -15);

        mesh_Pinheiro.checkCollisions = true;

    });


     // Adiciona o NPC que acompanhará o herói
    //  BABYLON.SceneLoader.ImportMesh("", "./assets/personagens/npc/", "xx.glb", scene_Mundo, function (mesh_NPC, particleSystems, skeletons_NPC) {
    //     mesh_NPC[0].scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
    //     mesh_NPC[0].position = new BABYLON.Vector3(0, 0, 15);
    //     // mesh_NPC[0].position = main.position;

    //     // mesh_NPC[0].collisionsEnabled;
    //     // mesh_NPC[0].checkCollisions = true;
    
    //     // mesh_NPC[0].parent = main;

    //     main.moveWithCollisions(m.add(meshmesh_NPC_Bee[0]));



      // Adiciona elemento o item informativo
    //   BABYLON.SceneLoader.ImportMesh("", "./ambiente/", "parabens.glb", scene_Mundo, function(mesh_elemento){
    //     // mesh_elemento[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
    //     mesh_elemento[0].position = new BABYLON.Vector3(0, 2, -18);
    //  });  


    // Adiciona a MÃO
    //BABYLON.SceneLoader.ImportMesh("", "./scenes/", "hand.babylon", scene_Mundo, function (newMeshes, particleSystems, skeletons) {

    /* Sistemas de particulas utilizados como checkinpoint em 3 situações:
    1. Para salvar o progresso;
    2. Como gatilhos para disparar as cutscenes (videos que desenvolvem o enredo e geralmente
    são mostradas na conclusão de um nível, quando o personagem completa a fase e entre
    cada pequena missão, preenchendo as lacunas da história);
    3. Para executar os vídeos com instruções de como realizar a respectiva tarefa.*/
    
    // Deve haver um par de portal para cada dimenssão
    // Portal da dimensão da 1ª tarefa
    var portal_Azul = geraPortal("assets/textures/portal/blue_Portal1.png", new BABYLON.Vector3(0, 1, -10));
    var portal_Vermelho = geraPortal("assets/textures/portal/red_Portal1.png", new BABYLON.Vector3(0, -2, 0));

    // Portal da dimensão da 2ª tarefa
    var portal_Azul = geraPortal("assets/textures/portal/blue_Portal1.png", new BABYLON.Vector3(2, 1, -10));
    var portal_Vermelho = geraPortal("assets/textures/portal/red_Portal1.png", new BABYLON.Vector3(-2, -2, 0));

    // Portal da dimensão da 3ª tarefa
    var portal_Azul = geraPortal("assets/textures/portal/blue_Portal1.png", new BABYLON.Vector3(2, 1, -10));
    var portal_Vermelho = geraPortal("assets/textures/portal/red_Portal1.png", new BABYLON.Vector3(-2, -2, 0));

    

     // HUD (Heads-Up Display)>>>------------------------------------------------------------------------->
    
     var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");
    //  gui.idealWidth = 1000; // # Quanto maior o valor, menor ficam os textos

    
    // 2. Pontuação e tentativas
    // Cria um novo container para o HUD
    //E. Barra superior
    var barraSuperior = new BABYLON.GUI.StackPanel();
    barraSuperior.isVertical = false;
    barraSuperior.background = "black"; 
    barraSuperior.alpha = 0.5;
    // panel.background = "transparent";
    barraSuperior.horizontalAlignment = 1;
    barraSuperior.verticalAlignment = 0;
    barraSuperior.width = "100%";
    barraSuperior.height = "60px";

    // Botão que habilita a interação do usuário com a interface gráfica
    // var gui_ativado = false;
    activateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("ativar", "assets/gui/activateButton.png");
    activateBtn.width = "130px";
    activateBtn.height = "55px";
    activateBtn.thickness = 0;
    // activateBtn.VerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    // activateBtn.HorizontalAlignment = "right";
    // activateBtn.HorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_BOTTOM;

    activateBtn.onPointerClickObservable.add(function() {
        if(barraSuperior.isVisible){
            barraSuperior.isVisible = false;
        }
        else{
            barraSuperior.isVisible = true;
        }
    });

    
    
    // F. Barra inferior
    var barraInferior = new BABYLON.GUI.StackPanel();
    barraInferior.isVertical = true;
    barraInferior.background = "black"; 
    barraInferior.alpha = 0.5;
    barraInferior.horizontalAlignment = 0;
    barraInferior.verticalAlignment = 1;
    barraInferior.width = "100%";
    barraInferior.height = "W60px";
    

    // // Cria um componente de retângulo com cor transparente para o background
    // var rect = new BABYLON.GUI.Rectangle();
    // rect.width = "100%";
    // rect.height = "100%";
    // rect.color = "black";
    // rect.alpha = 0.5;

    // // Adiciona o componente de retângulo ao container
    // hud.addControl(rect);

    // // Cria uma imagem para o background
    // var image = new BABYLON.GUI.Image("image", "assets/textures/box/madeira_1.png");
    // image.width = "100%";
    // image.height = "100%";
    // image.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;

    // Adiciona a imagem ao container
    // hud.addControl(image);

    // Cria um componente de texto para exibir a pontuação
    var scoreText = new BABYLON.GUI.TextBlock();
    scoreText.text = "Pontuação: 0";
    scoreText.height = "30px";
    scoreText.color = "white";

    // Adiciona o componente de texto ao container
    barraSuperior.addControl(scoreText);

    // Cria um componente de texto para exibir o tempo restante
    var timeText = new BABYLON.GUI.TextBlock();
    timeText.text = "Tempo restante: 60";
    timeText.height = "30px";
    timeText.color = "white";
    timeText.textHorizontalAlignment = "right";

    // Adiciona o componente de texto ao container
    barraSuperior.addControl(timeText);

    // Cria um componente de texto para exibir a vida do jogador
    var healthText = new BABYLON.GUI.TextBlock();
    healthText.text = "Vida: 100";
    healthText.height = "30px";
    healthText.color = "white";
    // healthText.textHorizontalAlignment = "left";
    healthText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

    // Adiciona o componente de texto ao container
    barraSuperior.addControl(healthText);

    // Adiciona o container ao GUI
    gui.addControl(barraSuperior);
   
  
 


    
    // Instruções e atalhos
    var atalhos = new BABYLON.GUI.TextBlock();
    atalhos.text =  "Para controlar o personagem, use WASD do teclado.\n" +
                    "- P: pausar/continuar o jogo\n" +
                    "- 1, 2, 3: alternar os modos de visão da camera\n" +
                    "- M: ativar/Desativar trilha sonora\n" +
                    "- F: ativar habilidade especial 1 (fogo)";
                    "- C: ativar habilidade especial 2 (chuva)";
                    "- S: ativar habilidade especial 3 (fumaça)";
                    "- E: ativar habilidade especial 4 (explosão)";
    atalhos.color = "white";
    atalhos.fontSize = 12;
    atalhos.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    // atalhos.textHorizontalAlignment = "left";
    // atalhos.textVerticalAlignment = "bottom"; // não funciona!!
    atalhos.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    barraInferior.addControl(atalhos);
    gui.addControl(atalhos);

    barraInferior.addControl(activateBtn);
    gui.addControl(barraInferior);

   



    // Atmosfera 1
    var skySize = 512.0;
    // var skybox = BABYLON.MeshBuilder.CreateBox("SkyBox", {size:512.0}, scene_Mundo);
    // var skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene_Mundo);
    // skyboxMaterial.backFaceCulling = false;
    // //  skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets/skybox/9.hdr", scene_Mundo, 512);     
    // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/bosque1.hdr", scene_Mundo, 512);     
    // // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/bosque2.hdr", scene_Mundo, 512);     
    // // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/bancoBosque.hdr", scene_Mundo, 512);     
    // // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/ceuRosa.hdr", scene_Mundo, 512);     
    // // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/ceuTropical.hdr", scene_Mundo, 512);     
    // // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/ceuCarregado.hdr", scene_Mundo, 512);     
    // // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/ceuAzul.hdr", scene_Mundo, 512);     
    // // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/estacionamento.hdr", scene_Mundo, 512);     
    // // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/escadarias.hdr", scene_Mundo, 512);     
    // // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/predioNevoeiro.hdr", scene_Mundo, 512);     
    // // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/montanhasNeve.hdr", scene_Mundo, 512);     
    // // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets_ignorados/skybox/montanhasRocha.hdr", scene_Mundo, 512);     
    // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // skybox.material = skyboxMaterial;


    // Atmosfera 2
    var skybox = BABYLON.Mesh.CreateBox("Skybox", skySize, scene_Mundo, undefined, BABYLON.Mesh.BACKSIDE);
    var skyboxMaterial = new BABYLON.BackgroundMaterial("skyboxMaterial", scene_Mundo);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(atmosfera, scene_Mundo);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = skyboxMaterial;


    // IDENTIFICADORES DE ELEMENTOS NO AMBIENTE ------------------------------------------
    var identificadores = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    // identificadores.idealWidth = 1600;

    var etiqueta_1 = criaEtiqueta(identificadores, box, "Parede");
    var etiqueta_2 = criaEtiqueta(identificadores, box2, "Portal");  
    var etiqueta_3 = criaEtiqueta(identificadores, character, "Leinylson");  
    // var etiqueta_4 = criaEtiqueta(identificadores, mesh_Bee, "Me siga!");  

    // identificadores.addControl(etiqueta_3, etiqueta_2);

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

    scene_Mundo.registerBeforeRender(function (){
        
        // Rotação
        // box.rotation.x += 0.001;
        // box.rotation.y += 0.001;
        // box.rotation.z += 0.001;

        // zoomIn(camera,box); // Fica seguindo a caixa....
        // zoomIn(camera,bola); // Trava na bola


        // box.position = new BABYLON.Vector3(Math.cos(alpha)*30, 10, Math.sin(alpha)*30);
        // alpha += 0.01;

        // mesh_planeta_Lava.position = new BABYLON.Vector3(Math.cos(alpha)*30, 10, Math.sin(alpha)*30);

        // Localização
        // asteroide.position.x = 10*Math.cos(alpha);
        // asteroide.position.y = 1.0;
        // asteroide.position.z = 10*Math.sin(alpha);

        // Tamanho
        // asteroide.scaling.x = 10*Math.cos(alpha);
        // asteroide.scaling.y = 1.0;
        // asteroide.scaling.z = 10*Math.sin(alpha);

        alpha += 0.01 * scene_Mundo.getAnimationRatio();

    });

return scene_Mundo;

    //#  Executa vídeo automaticamente
function executaVideo(video) {
    var tela_Opts = {
        height: 80,
        width: 100,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    };

    var Video = BABYLON.MeshBuilder.CreatePlane("tela", tela_Opts, scene_Mundo);
    Video.position = new BABYLON.Vector3(0, 0, 0.1);

    var Video_Material = new BABYLON.StandardMaterial("m", scene_Mundo);
    var Video_Textura = new BABYLON.VideoTexture("vidtex", video, scene_Mundo);
    // var abertura_VideoTex = new BABYLON.VideoTexture("vidtex",video",
    //  scene_Mundo, false, false, {autoplay: false, loop: false, playsinline: false, poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"}
    // );
    Video_Material.diffuseTexture = Video_Textura;
    Video_Material.roughness = 1;
    Video_Material.emissiveColor = new BABYLON.Color3.White();
    Video.material = Video_Material;


    // Executa vídeo ao clicar na tela do vídeo
    scene_Mundo.onPointerObservable.add(function (evt) {
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
            BABYLON.ParticleHelper.CreateAsync("smoke", scene_Mundo).then((set) => {
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
            BABYLON.ParticleHelper.CreateAsync("rain", scene_Mundo).then((set) => {
                set.systems.forEach(s => {
                    s.disposeOnStop = true;
                });
                set.start();
                if (som_Efeitos)//
                    var chove = new BABYLON.Sound("chuva", chuva, scene_Mundo, null, { loop: false, autoplay: true });
                });
        }
    }

// Efeito de explosão ao pressionar a tecla E
    function explode(event){
        if(event.keyCode == 69){ 
            BABYLON.ParticleHelper.CreateAsync("explosion", scene_Mundo).then((set) => {
                set.systems.forEach(s => {
                    s.disposeOnStop = true;
                });
                set.start();
                if (som_Efeitos)
                    var explode = new BABYLON.Sound("explosao", explosao, scene_Mundo, null, { loop: false, autoplay: true });
            });
        }
    }

// Efeito de explosão automático
function explode_(){
    BABYLON.ParticleHelper.CreateAsync("explosion", scene_Mundo).then((set) => {
        set.systems.forEach(s => {
            s.disposeOnStop = true;
        });
        set.start();
        if (som_Efeitos)
            var explode = new BABYLON.Sound("explosao", explosao, scene_Mundo, null, { loop: false, autoplay: true });
    });
}


// Efeito de chamas ao pressionar a tecla F
    function queima(event){
        if(event.keyCode == 70){ 
            BABYLON.ParticleHelper.CreateAsync("fire", scene_Mundo).then((set) => {
                set.systems.forEach(s => {
                    s.disposeOnStop = true;
                });
                set.start();
                if (som_Efeitos)
                    var queima = new BABYLON.Sound("fogo", fogo, scene_Mundo, null, { loop: false, autoplay: true });
            });
        }
    }

    // Efeito de chamas automático
    function queima_(){
            BABYLON.ParticleHelper.CreateAsync("fire", scene_Mundo).then((set) => {
                set.systems.forEach(s => {
                    s.disposeOnStop = true;
                   // s.position = new BABYLON.Vector3(15, 2, 0);
                //    s.maxLifeTime = 2;
                   s.isVisible = false;
                });
                set.start();
                // s.dispose(); // Tem que colocar um time antes de desaparecer
                if (som_Efeitos)
                    var queima = new BABYLON.Sound("fogo", fogo, scene_Mundo, null, { loop: false, autoplay: true });
            });
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
        var emissor = BABYLON.Mesh.CreateBox("emissor", 0.1, scene_Mundo);
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
        var particleSystem = new BABYLON.ParticleSystem("particles", 40, scene_Mundo, effect);
        particleSystem.particleTexture = new BABYLON.Texture("assets/textures/flare.png", scene_Mundo);
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

    // # Cria a luz e a atmosfera
    function createSkyboxAndLight() {
        // Define a general environment texture
        hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/textures/environment.dds", scene_Mundo);
        scene_Mundo.environmentTexture = hdrTexture;

        // Let's create a color curve to play with background color
        var curve = new BABYLON.ColorCurves();
        curve.globalHue = 10;
        curve.globalDensity = 10;

        var box = scene_Mundo.createDefaultSkybox(hdrTexture, true, 200, 0.7);
        box.infiniteDistance = false;
        box.material.imageProcessingConfiguration = new BABYLON.ImageProcessingConfiguration();
        box.material.cameraColorCurvesEnabled = true;
        box.material.cameraColorCurves = curve;
        box.name = "MYMESHFORSKYBOX";
        box.isPickable = false;

        directionalLight = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(-0.2, -1, 0), scene_Mundo)
        directionalLight.position = new BABYLON.Vector3(100 * 0.2, 100 * 2, 0)
        directionalLight.intensity = 4.5;

    // Cria a ATMOSFERA # TROCAR POR UM CÉU NOTURNO
    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, scene_Mundo, undefined, BABYLON.Mesh.BACKSIDE);
    var skyboxMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene_Mundo);
    // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/TropicalSunnyDay", scene_Mundo);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/Cerebro", scene_Mundo);
    // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets/skybox/1.hdr", scene_Mundo, 512);
    // skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("assets/skybox/nebulaSky", scene_Mundo, 512);
    
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

        scene_Mundo.onPointerUp = function (evt, pickResult) {
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

    // Contrói a Elipse em torno do objeto 
    function drawEllipsoid(mesh) {
        mesh.computeWorldMatrix(true);
        var ellipsoidMat = mesh.getScene().getMaterialByName("__ellipsoidMat__");
        if (! ellipsoidMat) { 
            ellipsoidMat = new BABYLON.StandardMaterial("__ellipsoidMat__", mesh.getScene());
            ellipsoidMat.wireframe = true;
            ellipsoidMat.emissiveColor = BABYLON.Color3.Green();
            ellipsoidMat.specularColor = BABYLON.Color3.Black();
        }
        var ellipsoid = BABYLON.Mesh.CreateSphere("__ellipsoid__", 9, 1, mesh.getScene());
        ellipsoid.scaling = mesh.ellipsoid.clone();
        ellipsoid.scaling.y *= 2;
        ellipsoid.scaling.x *= 2;
        ellipsoid.scaling.z *= 2;
        ellipsoid.material = ellipsoidMat;
        ellipsoid.parent = mesh;
        ellipsoid.position = mesh.ellipsoidOffset.clone();
        ellipsoid.computeWorldMatrix(true);
    }


    // Gera número aleatorio entre um intervalo
    var randomNumber = function (min, max) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    };

};

function criaEtiqueta(identificadores, elemento, texto) {
    var etiqueta = new BABYLON.GUI.Rectangle();
    etiqueta.width = 0.1;
    etiqueta.height = "40px";
    etiqueta.cornerRadius = 15;
    etiqueta.color = "Yellow";
    etiqueta.alpha = 0.5;
    etiqueta.thickness = 2;
    etiqueta.background = "green";
    identificadores.addControl(etiqueta);
    etiqueta.linkWithMesh(elemento);
    etiqueta.linkOffsetY = -125; // altura da tag em relação ao elemento

    var label = new BABYLON.GUI.TextBlock();
    label.text = texto;
    // label.color = "Blue";
    etiqueta.addControl(label);

    var target = new BABYLON.GUI.Ellipse();
    target.width = "25px";
    target.height = "25px";
    target.color = "Yellow";
    target.alpha = 0.5;
    target.thickness = 5;
    target.background = "green";
    identificadores.addControl(target);
    target.linkWithMesh(elemento);

    var line = new BABYLON.GUI.Line();
    line.lineWidth = 3;
    line.color = "Yellow";
    line.y2 = 20;
    line.linkOffsetY = -13;
    identificadores.addControl(line);
    line.linkWithMesh(elemento);
    line.connectedControl = etiqueta;
    return target;
}

// Efeito Coletar item (ampulheta, chave, cristal)
// function evento_ColetarItem(player, item, som) {
//     if (player.intersectsMesh(item, true) && item.isVisible) {
//         som(); // troca um efeito sonoro
//         item.dispose();
//         item.isVisible = false;
//         console.log(player.name + ' coletou o ' + item.name);
//     }
// }

// Efeito ao Colidir com bloco (parede, portal)
function evento_Colidir(player, bloco, efeito) {
    if (player.intersectsMesh(bloco, true) && bloco.isVisible) {
        // efeito(); // efeito de acordo como o tipo de bloco
        bloco.material.emissiveColor = new BABYLON.Color3(0, 0, 1);
        bloco.material.alpha = 1;
        console.log(player.name + ' colidiu no ' + bloco.name);
    }
}

// Efeito ao Colidir com NPC
// function evento_Colidir(player, npc, video) {
//     if (player.intersectsMesh(npc, true) && npc.isVisible) {
//         // video();
//         // npc.material.emissiveColor = new BABYLON.Color3(0, 0, 1);
//         console.log(player.name + ' encontrou o(a) ' + npc.name);
//     }
// }


// Constrói portais de teletransporte entre dimenssões
function geraPortal(texture, position) {
    // Cria um sistema de partículas
    const origem_ParticleSystem = new BABYLON.ParticleSystem("particles", 25);

    // Textura de cada partícula
    origem_ParticleSystem.particleTexture = new BABYLON.Texture(texture);

    // Posição de onde as partículas são emitidas
    origem_ParticleSystem.emitter = position;

    // Gera e emite as partículas
    origem_ParticleSystem.start();
}


    //  scene_Mundo.activeCamera.beta -= 0.2; // Pociciona a camera em um ângulo especificado



//Refatorar para passar o objeto como parâmetro
function control_Player(skeleton_Heroi, scene_Mundo){
    
    // var mesh_Heroi = mesh_Heroi[0];// Juntas
    var mesh_Heroi = mesh_Heroi[1]; // Corpo

    // skeleton_Heroi.position = new BABYLON.Vector3(2, 4, -8);
    mesh_Heroi.position = new BABYLON.Vector3(0, 0, 0);
    var t = 0;
    var j = 0;
    var novoValor = 0;
    
    pegar = function(p){
        j = p;
    };
    
    scene_Mundo.beforeRender = function(){
        t += .1;
        if(j != 0){
            // skeleton_Heroi.rotation = new BABYLON.Vector3(0, 0, j[4].x * (5));
            mesh_Heroi.rotation = new BABYLON.Vector3(0, 0, j[4].x * (5));
        }
    };
}

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
    width: 310,
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
    window.scene = create_Mundo();
};
initFunction().then(() => {
    sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});