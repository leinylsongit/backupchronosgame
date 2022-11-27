// Adicionar elementos no mundo que testem a percepção do tempo, além das tarefas

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

var createDefaultEngine = function () {
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
};

// Elementos 3d
// Player
const player = 'assets/personagens/players/ybot.babylon';

// Cidade
const towerURL = "assets/ambiente/tower/TowerHouse.obj";

// Ruas
const streetURL = 'assets/ambiente/street/Street.obj';

// 1ª ou 3ª pessoa
var firstPerson = false;

// Animações
var skeleton_Heroi = null;
var ak47 = null;

var idleAnim = null;
var walkAnim = null;
var runAnim = null;
var sprintAnim = null;
var jumpAnim = null;

//variables
var animationBlend = 0.005;
var mouseSensitivity = 0.0005;
var cameraSpeed = 0.0075;
var walkSpeed = 0.001;
var runSpeed = 0.005;
var sprintSpeed = 0.008;
var jumpSpeed = 0.1;
var jumpHeight = 0.5;
var gravity = new BABYLON.Vector3(0, -0.5, 0);

// Variáveis alteradas no jogo
var speed = 0;
var vsp = 0;
var jumped = false;
var mouseX = 0, mouseY = 0;
var mouseMin = -35, mouseMax = 45;

// Trilha sonora e efeitos de áudio
var sound = false;

// Cenário do Mundo Exploratório
var create_Mundo = function () {
    // engine.enableOfflineSupport = false;

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

    scene_Mundo.fogEnabled = true;
    scene_Mundo.fogMode = BABYLON.Scene.FOGMODE_EXP2;
	scene_Mundo.fogDensity = 0.01;
    scene_Mundo.fogColor = new BABYLON.Color3(0.8, 0.9, 1.0);
    scene_Mundo.clearColor = scene_Mundo.fogColor;



    // Adiciona a CÂMERA
    var camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3.Zero(0, 0, 0), scene_Mundo);
    camera.inputs.clear();
    
    camera.ellipsoid = new BABYLON.Vector3(0.5,1, 0.5);
    drawEllipsoid(camera);
    // camera.minZ = 0.1;


    // Adiciona as fontes de LUZ 
    var hemLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene_Mundo);
	hemLight.intensity = 0.7;
	hemLight.specular = BABYLON.Color3.Black();
    hemLight.groundColor = scene_Mundo.clearColor.scale(0.75);

    var dirLight = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene_Mundo);
    dirLight.position = new BABYLON.Vector3(0, 130, 130);

    // Adiciona as SOMBRAS
    var shadowGenerator = new BABYLON.ShadowGenerator(3072, dirLight);
    shadowGenerator.usePercentageCloserFiltering = true;
    
    if (sound)
        var music = new BABYLON.Sound("Ambiente", "assets/sounds/soundtracks/Ambiente_Calmo_01.mp3", scene_Mundo, null, { loop: true, autoplay: true });

    // Chão, a princípio desnecessário!!
    var helper = scene_Mundo.createDefaultEnvironment({
        enableGroundShadow: true,
        enableGroundMirror: true,
        groundMirrorFallOffDistance: 0,
        groundSize: 150,
        skyboxSize: 150,
    });
    helper.setMainColor(scene_Mundo.clearColor);
    helper.groundMaterial.diffuseTexture = null;
    helper.groundMaterial.alpha = 1;
    helper.groundMaterial.fogEnabled = true;


    var addShadows = function(mesh){
        mesh.receiveShadows = true;
        shadowGenerator.addShadowCaster(mesh);
    }

    var addToMirror = function(mesh){
        helper.groundMirrorRenderList.push(mesh);
    }

    //tps ???
    const dsm = new BABYLON.DeviceSourceManager(engine);
    var deltaTime = 0;


    //character nodes ???
    var main = new BABYLON.Mesh("parent", scene_Mundo);
    var target = new BABYLON.TransformNode();
    var character = new BABYLON.Mesh("character", scene_Mundo);


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

    var smallLight = new BABYLON.PointLight("boxLight", new BABYLON.Vector3.Zero(), scene_Mundo);
    smallLight.diffuse = new BABYLON.Color3(0.3, 0.5, 0.8);
    smallLight.specular = smallLight.specular;
    smallLight.intensity = 1;
    smallLight.range = 5;


    // Animação de Carregando
    engine.displayLoadingUI();

    //var player = null; 1ª tentatica

    // Import gltf  // 2ª tentativa
    //var mesh_Heroi = (await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/TrevorDev/gltfModels/master/weirdShape.glb", "", scene)).meshes;

    BABYLON.SceneLoader.ImportMesh("", "", player, scene_Mundo, function (mesh_Heroi, particleSystems, skeletons_Heroi){
        skeleton_Heroi = skeletons_Heroi[0];
        var body = mesh_Heroi[1];
        var joints = mesh_Heroi[0];
        body.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
        body.rotation.y = BABYLON.Tools.ToRadians(180);
        joints.parent = body;
        body.parent = character;    

        // Textura do Player
        body.material = new BABYLON.StandardMaterial("character", scene_Mundo);
        joints.material = new BABYLON.StandardMaterial("joints", scene_Mundo);
        body.material.diffuseColor = new BABYLON.Color3(0, 10, 10);
        joints.material.emissiveColor = new BABYLON.Color3(10, 100, 10);

        addToMirror(character);
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
        //jumpAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, jumpRange.from+1, jumpRange.to, 0, true);
		
    
        // Elipse para verificar as colisões
        main.ellipsoid = new BABYLON.Vector3(0.5, 0.9, 0.5);
        main.ellipsoidOffset = new BABYLON.Vector3(0, main.ellipsoid.y, 0);
        main.checkCollisions = true;

        // Exibe a elipse que envolve o player
        drawEllipsoid(main);


        smallLight.parent = main;
        character.parent = main;
        target.parent = main;

        // Alterna a camera de acordo com a opção escolhida
        if (firstPerson == true){
            camera.parent = character;
            // switchCamera(firstPersonCamera.middle);
            switchCamera(firstPersonCamera.far);
        }else{
            camera.parent = target;
            // switchCamera(thirdPersonCamera.leftRun); // Lado esquerdo
            // switchCamera(thirdPersonCamera.rightRun);// Lado direito
            // switchCamera(thirdPersonCamera.middle);     // Centralizado
            switchCamera(thirdPersonCamera.far);     // Distante
        }

        // Posição da câmera
        main.position = new BABYLON.Vector3(15,0,0);


        // Oculta a animação de carregando
        engine.hideLoadingUI();


        // Interação com Player usando a mão
        // control_Player(skeleton_Heroi, scene_Mundo);
        mesh_Heroi = mesh_Heroi[1];


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



        
        // Devo add aqui todos os elementos com que for haver interação 
        
        // Adiciona a ABELHA
        // var abelha = null;
        BABYLON.SceneLoader.ImportMesh("", "./assets/animais/", "Bee.glb", scene_Mundo, function (mesh_Bee, particleSystems, skeletons_Bee) {
            mesh_Bee[0].scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
            mesh_Bee[0].position = new BABYLON.Vector3(0, 0, 25);

            mesh_Bee[0].collisionsEnabled = true;
            mesh_Bee[0].wireframe = true;


            // Elipse para verificar as colisões
            mesh_Bee[0].ellipsoid = new BABYLON.Vector3(9, 8, 8);
            mesh_Bee[0].ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
            mesh_Bee[0].checkCollisions = true;

            // Exibe a elipse que envolve a abelha
            drawEllipsoid(mesh_Bee[0]);


            //mesh_Bee[0].parent = main;

            // scene_Mundo.registerBeforeRender(function () {

                // if (mesh_Heroi.intersectsMesh(character, true)) {
                //     console.log("Heroi colidiu no Character!")
                //  box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                //     // box.dispose();
                // }
                // else{
                //     console.log("Heroi não colidiu no Character!")
                //     box.material.emissiveColor = new BABYLON.Color3(0, 0, 0); 
                // }

                if (main.intersectsMesh(mentor, true)) {
                    console.log("MAIN colidiu na Abelha!")
                 box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                    // box.dispose();
                }
                else{
                    console.log("MAIN Não colidiu na Abelha!")
                    box.material.emissiveColor = new BABYLON.Color3(0, 1, 0); 
                }

                if (body.intersectsMesh(mentor, true)) {
                    console.log("Character colidiu na Abelha!")
                 box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                    // box.dispose();
                }
                else{
                    console.log("Character não colidiu na Abelha!")
                    box.material.emissiveColor = new BABYLON.Color3(0, 1, 0); 
                }

                if (body.intersectsMesh(mesh_Bee, true)) {
                    console.log("Heroi colidiu na Abelha!")
                 box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                    // box.dispose();
                }
                else{
                    console.log("Heroi não colidiu na Abelha!")
                    box.material.emissiveColor = new BABYLON.Color3(0, 1, 0); 
                }

                if (body.intersectsMesh(target, true)) {
                    console.log("Colidiu no Target!")
                 box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                    // box.dispose();
                }
                else{
                    console.log("Não colidiu no Target!")
                    box.material.emissiveColor = new BABYLON.Color3(0, 0, 1); 
                }

                if (body.intersectsMesh(box, true)) {
                    console.log("Colidiu na Caixa!")
                 box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                    // box.dispose();
                }
                else{
                    console.log("Não colidiu na Caixa!")
                    box.material.emissiveColor = new BABYLON.Color3(0, 1, 0); 
                }

                if (main.intersectsMesh(box, true)) {
                    console.log("MAIN colidiu na Caixa!")
                 box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                    // box.dispose();
                }
                else{
                    console.log("MAIN Não colidiu na Caixa!")
                    box.material.emissiveColor = new BABYLON.Color3(0, 1, 0); 
                }

                if (mesh_Heroi.intersectsMesh(box, true)) {
                    console.log("Colidiu na caixa!")
                 box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                    // box.dispose();
                }
                else{
                    console.log("Não colidiu na caixa!")
                    box.material.emissiveColor = new BABYLON.Color3(0, 0, 0); 
                }
            // }); 
            // }

            // skeleton_Bee = skeletons_Bee[];

            // var flyBee = skeleton_Bee.getAnimationRange("fly");
            // flyBee_Anim = scene_Mundo.beginWeightedAnimation(skeleton_Bee, flyBee.from, flyBee.to, 0, true);

            // flyBee_Anim;


            // if ((mesh_Bee[0].position.z - character.position.z) <= 20)
            //     console.log("character colidiu abelha!");
        
            // console.log("Abelha: ", mesh_Bee[0].position);
            // console.log("character: ", character.position);
            // console.log("character e abelha: ", mesh_Bee[0].position.z - character.position.z);



            // if ((mesh_Bee[0].position.z - target.position.z) <= 20)
            //     console.log("target colidiu abelha!");
            
            // console.log("Abelha: ", mesh_Bee[0].position);
            // console.log("target: ", target.position);
            // console.log("target e abelha: ", mesh_Bee[0].position.z - target.position.z);


            //# verificar o valor absoluto!!!
            // if ((mesh_Bee[0].position - main.position) <= 5){
            //     console.log("main colidiu abelha!");
            // }
            
            // console.log("Abelha: ", mesh_Bee[0].position);
            // console.log("main: ", main.position);
            // console.log("main e abelha: ", mesh_Bee[0].position - main.position);



            // if ((mesh_Bee[0].position.z - mesh_Heroi.position.z) <= 20)
            //     console.log("mesh_Bee colidiu abelha!");
            
            // console.log("Abelha: ", mesh_Bee[0].position);
            // console.log("mesh_heroi: ", mesh_Heroi.position);
            // console.log("mesh_heroi e abelha: ", mesh_Bee[0].position.z - mesh_Heroi.position.z);
    
            
            // if ((mesh_Bee[0].position.z - camera.position.z) <= 20)
            //     console.log("camera colidiu abelha!");
                
            // console.log("Abelha: ", mesh_Bee[0].position);
            // console.log("camera: ", camera.position);
            // console.log("camera e abelha: ", mesh_Bee[0].position.z - camera.position.z);



          // HUD (Heads-Up Display)>>>------------------------------------------------------------------------->

    var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");
    
    // 2. Pontuação e tentativas
    var textblockStatus = new BABYLON.GUI.TextBlock();
    textblockStatus.text = "Pontuação: 0\n Tentativas restantes: 1/3"; //add a variável da tentativa 1/3, 2/3...
    textblockStatus.fontSize = 20;
    textblockStatus.fontFamily = "Segoe UI"
    textblockStatus.height = "60px";
    textblockStatus.width = "30%";
    textblockStatus.top = 0;
    textblockStatus.color = "white";
    textblockStatus.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textblockStatus.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    gui.addControl(textblockStatus);

    // 3. Botão Start
    var Button_Start = BABYLON.GUI.Button.CreateSimpleButton("butStart", "W>> INTERAGIR <<");
    Button_Start.width = "400px";
    // Button_Start.width = "30%";
    Button_Start.height = "65px";
    Button_Start.color = "white";
    Button_Start.fontSize = 30;
    Button_Start.fontFamily = "Segoe UI"
    Button_Start.cornerRadius = 20;
    Button_Start.background = "green";
    Button_Start.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    Button_Start.onPointerUpObservable.add(function () {
        Button_Start.children[0].text = ">> INTERAGIR <<";
           
        // Sbtrair individualmente e depois soma os resultados de cada eixo
        var distancia_X = mesh_Bee[0].position.x - main.position.x;
        var distancia_Y = mesh_Bee[0].position.y - main.position.y;
        var distancia_Z = mesh_Bee[0].position.z - main.position.z;
        dist_Total = distancia_X + distancia_Y + distancia_Z;

        textblockStatus.text = dist_Total;

        if (dist_Total >= 1){
            if (dist_Total <= 3){
                console.log("Colidiu com distância ", dist_Total);
                textblockStatus.text = "Colisão com abelha";
            }

        }



        // var distancia_Y = mesh_Bee[0].position.y - main.position.y;
        // console.log(mesh_Bee[0].position);

        // var distancia_Y = character.position.y - main.position.y;
        // console.log(character.position);

        // var distancia_Y = target.position.y - main.position.y;
        // console.log(target.position);

        // var distancia_Y = camera.position.y - main.position.y;
        // console.log(camera.position);

        // var distancia_Y = mesh_Heroi.position.y - main.position.y;
        // console.log(mesh_Heroi.position);

        // textblockStatus.text = distancia_Y;

        // if (distancia_Y >= 1){
        //     if (distancia_Y <= 4){
        //         console.log("Colidiu!");
        //         textblockStatus.text = "Colisão com abelha";
        //     }

        // }
        
    });
    gui.addControl(Button_Start);

    
    // 5. Regras da tarefa
    var textblockRegras = new BABYLON.GUI.TextBlock();
    textblockRegras.text = "1. Aproxime-se de algum elemento\n 2.  Click no botão [INTERAGIR]\n";
    textblockRegras.fontSize = 30;
    textblockRegras.fontFamily = "Segoe UI"
    textblockRegras.height = "150px";
    textblockRegras.top = "80px";
    textblockRegras.color = "Yellow";
    // textblockRegras.background = "black";
    textblockRegras.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textblockRegras.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    gui.addControl(textblockRegras);

    });


    }, function(evt){} );


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


        // if (mesh_Heroi.intersectsMesh(mesh_Bee[0], true)) {
        //     console.log("Colidiu na 5!")
        // //  box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
        //     // box.dispose();
        // }





    });


    // Movimentação do mouse
    var mouseMove = function(e)
    {
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
            ), cameraSpeed*deltaTime
        );
    }




    function updateCameraPipe(){
        target.rotation = lerp3(
            target.rotation, 
            new BABYLON.Vector3(dedo, dedo, 0), 
            cameraSpeed*deltaTime
        );
    }
















    // Movimentação em 3ª pessoa
    function thirdPersonMovement(up, down, left, right, jump, run)
    {
        var directionZ = up-down;
        var directionX = right-left;

        var vectorMove = new BABYLON.Vector3.Zero();
        var direction = Math.atan2(directionX, directionZ);

        var currentState = idleAnim;
        

        //move
        if (directionX != 0 || directionZ != 0)
        {
            if (run != 1)
            {
                currentState = runAnim;
                speed = lerp(speed, runSpeed, runAnim.weight);
            }else{
                currentState = sprintAnim;
                speed = lerp(speed, sprintSpeed, sprintAnim.weight);
            }

            var rotation = (target.rotation.y+direction) % 360;
            character.rotation.y = lerp(
                character.rotation.y, rotation, 0.25
            );
            
            vectorMove = new BABYLON.Vector3(
                (Math.sin(rotation)), 0,
                (Math.cos(rotation))
            );
        }else{
            speed = lerp(speed, 0, 0.001);
        }


        //jump # Bug, não volta ao normal
        // if (jump == 1 && jumped == false)
        // {
        //     jumped = true;
        // }
        // if (jumped == true)
        // {
        //     // if (vsp < jumpHeight){
        //     //     vsp += jumpHeight/10;
        //     // }else{
        //     //     vsp += gravity.y/10;
        //     //     vsp = Math.min(vsp, gravity.y);
        //     //     if (vsp == gravity.y){
        //     //         vsp = gravity.y;
        //     //         jumped = false;
        //     //     }
        //     // }
        //     var rr = skeleton_Heroi.getAnimationRange("None_Jump");
        //     var a = scene_Mundo.beginAnimation(skeleton_Heroi, rr.from+1, rr.to, false, 1, function(){
        //         jumped = false;console.log("stopped "+rr.from+1+" "+rr.to);
        //     });
        // }else{
        //     vsp = gravity.y;
        // }


        var m = vectorMove.multiply(new BABYLON.Vector3().setAll( speed*deltaTime ));
        main.moveWithCollisions( m.add(new BABYLON.Vector3(0, vsp, 0)) );
        

        switchAnimation(currentState);
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
                // currentState = "walk";
                // speed = lerp(speed, walkSpeed, walkAnim.weight);
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


    //tools #????
    function clamp(value, min, max){
        return (Math.max(Math.min(value, max), min));
    }

    function lerp(start, end, speed){
        return (start + ((end - start) * speed));
    }

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
    function changeCallback(e)
    {
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


    setupPointerLock();
    // scene_Mundo.detachControl(); // Se habilitar, a camera do player fica aparecendo


    // Constrói elementos do cenário
    var box = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene_Mundo);
    box.position = new BABYLON.Vector3(20, 1, 8);
    addToMirror(box);
    addShadows(box);
    // box.material = new BABYLON.StandardMaterial("lightBox", scene_Mundo);
    box.material = new BABYLON.StandardMaterial("materialGround", scene_Mundo);
    box.material.emissiveColor = smallLight.diffuse;

    var boxLight = smallLight.clone();
    boxLight.parent = box;

    // Adiciona a TORRE
    // var tower = null;
    // BABYLON.SceneLoader.ImportMesh("", "", towerURL, scene_Mundo, function (newMeshes)
    // {
    //     tower = BABYLON.Mesh.MergeMeshes(newMeshes, true, true, false, false, false);
    //     tower.scaling = new BABYLON.Vector3(1.1, 1.1, 1.1);
    //     tower.position = new BABYLON.Vector3(0, -0.1, 2);
    //     addToMirror(tower);
    //     addShadows(tower);

    //     tower.checkCollisions = true;
    // });

    // Adiciona a RUA
    // var street = null;
    // BABYLON.SceneLoader.ImportMesh("", "", streetURL, scene_Mundo, function (newMeshes)
    // {
    //     street = BABYLON.Mesh.MergeMeshes(newMeshes, true, true, false, false, false);
    //     street.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
    //     street.position = new BABYLON.Vector3(0, -0.1, 0);
    //     addToMirror(street);
    //     addShadows(street);

    //     street.checkCollisions = true;
    // });


    helper.ground.checkCollisions = true;
    helper.skybox.checkCollisions = true;

     // Elipse para verificar as colisões
     box.ellipsoid = new BABYLON.Vector3(2.5, 0.2, 2.5);
     box.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
     box.checkCollisions = true;

     var box2 = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene_Mundo);
     box2.position = new BABYLON.Vector3(18, 1, 8);
     box2.checkCollisions = true;

     box2.material = new BABYLON.StandardMaterial("materialGround", scene_Mundo);
     box2.material.emissiveColor = smallLight.diffuse;
     // Exibe a elipse que envolve a caixa
     drawEllipsoid(box);

     drawEllipsoid(box2);

    


    // Adiciona brilho a tudo
    // var gl = new BABYLON.GlowLayer("gl", scene_Mundo);
    // var pipeline = new BABYLON.DefaultRenderingPipeline(
    //     "pipeline", true, scene_Mundo, [camera]
    // );
    // pipeline.samples = 4;
    // var ssao = new BABYLON.SSAORenderingPipeline('ssaopipeline', scene_Mundo, { ssaoRatio: 0.75, combineRatio: 1.0 }, [camera]);
    // var postProcess = new BABYLON.PostProcess("anamorphic effects", "anamorphicEffects", [], null, 1, camera);

    

    // ground_1.material = new BABYLON.GridMaterial("groundMat");
    
    
    // Definição da Interface do Usuário
    // var UiPanel = painelButtons();

   

    // var pause = false;

        // scene_Mundo.onKeyboardObservable.add((kbInfo) => {
        //     switch (kbInfo.type) {
        //         case BABYLON.KeyboardEventTypes.KEYDOWN:
        //             switch (kbInfo.event.key) {
        //                 case "w":
        //                     scene_Mundo.beginAnimation(skeleton_Heroi, walkRange.from, walkRange.to, true);
        //                     //mesh_Heroi[0].position.z += 0.1; // Move o herói ao inves da plataforma
        //                     ground_1.position.z -= 0.5;
        //                     ground_2.position.z -= 0.5;
        //                     ground_3.position.z -= 0.5;
        //                     ground_4.position.z -= 0.5;
        //                     button_Walk.background = "blue";
        //                     break

        //                 case "s":
        //                     scene_Mundo.beginAnimation(skeleton_Heroi, idleRange.from, idleRange.to, true);
        //                     button_Idle.background = "blue";
        //                     break

        //                 case "q":
        //                     if (walkRange && leftRange) {
        //                         scene_Mundo.stopAnimation(skeleton_Heroi);
        //                         var walkAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, walkRange.from, walkRange.to, 0.5, true);
        //                         var leftAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, leftRange.from, leftRange.to, 0.5, true);

        //                         walkAnim.syncWith(null);
        //                         leftAnim.syncWith(walkAnim);
        //                         button_Blend_Left.background = "blue";
        //                     }
        //                     break

        //                 case "e":
        //                     if (walkRange && rightRange) {
        //                         scene_Mundo.stopAnimation(skeleton_Heroi);
        //                         var walkAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, walkRange.from, walkRange.to, 0.5, true);
        //                         var rightAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, rightRange.from, rightRange.to, 0.5, true);

        //                         walkAnim.syncWith(null);
        //                         rightAnim.syncWith(walkAnim);
        //                         button_Blend_Right.background = "blue";
        //                     }
        //                     break

        //                 case "a":
        //                     scene_Mundo.beginAnimation(skeleton_Heroi, leftRange.from, leftRange.to, true);
        //                     button_Left.background = "blue";
        //                     break

        //                 case "d":
        //                     scene_Mundo.beginAnimation(skeleton_Heroi, rightRange.from, rightRange.to, true);
        //                     button_Right.background = "blue";
        //                     break

        //                 case "r":
        //                     scene_Mundo.beginAnimation(skeleton_Heroi, runRange.from, runRange.to, true);
        //                     button_Run.background = "blue";
        //                     break

        //                 case "1": //Alterna para 3ª pessoa
        //                     camera_3.lowerRadiusLimit = 4;
        //                     camera_3.upperRadiusLimit = 100;
        //                     camera_3.wheelDeltaPercentage = 0.01;
        //                     break

        //                 case "2": //Alterna para 1ª pessoa
        //                     camera_3.lowerRadiusLimit = 1;
        //                     camera_3.upperRadiusLimit = 0;
        //                     camera_3.wheelDeltaPercentage = 0.01;
        //                     break

        //                 case "3": //Alterna para visão lateral "2d" do ambiente
        //                     camera_3.lowerRadiusLimit = 60;
        //                     camera_3.upperRadiusLimit = 600;
        //                     camera_3.radius = 30;
        //                     break

        //                 // case "o": 
        //                 // // Adiciona o AMBIENTE
        //                 // BABYLON.SceneLoader.ImportMesh("", "./ambiente/", "estadio.glb", scene_Mundo, function(mesh_ambiente){
        //                 //     // mesh_ambiente[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
        //                 //     mesh_ambiente[0].position = new BABYLON.Vector3(0, 0, 0);
        //                 // });
        //                 // break

        //                 case "p": //Pausar/Despausar o jogo
        //                     if (!pause) {
        //                         // Rotaciona a camera orbitando o herói
        //                         scene_Mundo.activeCamera.useAutoRotationBehavior = true;
        //                         // Desabilitar controle?
        //                         //Desligar a câmera?
        //                         pause = true;
        //                     }
        //                     else {
        //                         // Para a rotação da camera
        //                         scene_Mundo.activeCamera.useAutoRotationBehavior = false;
        //                         // Resetar posição da camera
        //                         // Habilitar controle?
        //                         //Ligar a câmera?
        //                         pause = false;
        //                     }
        //                     break
        //             }
        //     }
        // });

    //     function heroiButtons() {
    //         // BOTÃO: Idle
    //         var button_Idle = BABYLON.GUI.Button.CreateSimpleButton("but_Idle", "Play Idle");
    //         button_Idle.paddingTop = "10px";
    //         button_Idle.width = "100px";
    //         button_Idle.height = "50px";
    //         button_Idle.color = "white";
    //         button_Idle.background = "black";
    //         button_Idle.onPointerDownObservable.add(() => {
    //             if (idleRange) {
    //                 scene_Mundo.beginAnimation(skeleton_Heroi, idleRange.from, idleRange.to, true);
    //                 button_Idle.background = "green";
    //             }
    //         });
    //         UiPanel.addControl(button_Idle);


    //         // BOTÃO: Walk
    //         var button_Walk = BABYLON.GUI.Button.CreateSimpleButton("but_Walk", "Play Walk");
    //         button_Walk.paddingTop = "10px";
    //         button_Walk.width = "100px";
    //         button_Walk.height = "50px";
    //         button_Walk.color = "white";
    //         button_Walk.background = "black";
    //         button_Walk.onPointerDownObservable.add(() => {
    //             if (walkRange) {
    //                 scene_Mundo.beginAnimation(skeleton_Heroi, walkRange.from, walkRange.to, true);
    //                 button_Walk.background = "green";
    //             }
    //         });
    //         UiPanel.addControl(button_Walk);

    //         // BOTÃO: Run
    //         var button_Run = BABYLON.GUI.Button.CreateSimpleButton("but_Run", "Play Run");
    //         button_Run.paddingTop = "10px";
    //         button_Run.width = "100px";
    //         button_Run.height = "50px";
    //         button_Run.color = "white";
    //         button_Run.background = "black";
    //         button_Run.onPointerDownObservable.add(() => {
    //             if (runRange) {
    //                 scene_Mundo.beginAnimation(skeleton_Heroi, runRange.from, runRange.to, true);
    //                 button_Run.background = "green";
    //             }
    //         });
    //         UiPanel.addControl(button_Run);

    //         // BOTÃO: Left
    //         var button_Left = BABYLON.GUI.Button.CreateSimpleButton("but_Left", "Play Left");
    //         button_Left.paddingTop = "10px";
    //         button_Left.width = "100px";
    //         button_Left.height = "50px";
    //         button_Left.color = "white";
    //         button_Left.background = "black";
    //         button_Left.onPointerDownObservable.add(() => {
    //             if (leftRange) {
    //                 scene_Mundo.beginAnimation(skeleton_Heroi, leftRange.from, leftRange.to, true);
    //                 button_Left.background = "green";
    //             }
    //         });
    //         UiPanel.addControl(button_Left);

    //         // BOTÃO: Right
    //         var button_Right = BABYLON.GUI.Button.CreateSimpleButton("but_Right", "Play Right");
    //         button_Right.paddingTop = "10px";
    //         button_Right.width = "100px";
    //         button_Right.height = "50px";
    //         button_Right.color = "white";
    //         button_Right.background = "black";
    //         button_Right.onPointerDownObservable.add(() => {
    //             if (rightRange) {
    //                 scene_Mundo.beginAnimation(skeleton_Heroi, rightRange.from, rightRange.to, true);
    //                 button_Right.background = "green";
    //             }
    //         });
    //         UiPanel.addControl(button_Right);

    //         // BOTÃO: Blend Left
    //         var button_Blend_Left = BABYLON.GUI.Button.CreateSimpleButton("but_Bl_left", "Blend Left");
    //         button_Blend_Left.paddingTop = "10px";
    //         button_Blend_Left.width = "100px";
    //         button_Blend_Left.height = "50px";
    //         button_Blend_Left.color = "white";
    //         button_Blend_Left.background = "black";
    //         button_Blend_Left.onPointerDownObservable.add(() => {
    //             if (walkRange && leftRange) {
    //                 scene_Mundo.stopAnimation(skeleton_Heroi);
    //                 var walkAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, walkRange.from, walkRange.to, 0.5, true);
    //                 var leftAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, leftRange.from, leftRange.to, 0.5, true);

    //                 // Note: Sync Speed Ratio With Master Walk Animation
    //                 walkAnim.syncWith(null);
    //                 leftAnim.syncWith(walkAnim);

    //                 button_Blend_Left.background = "green";
    //             }
    //         });
    //         UiPanel.addControl(button_Blend_Left);

    //         // BOTÃO: Blend Right
    //         var button_Blend_Right = BABYLON.GUI.Button.CreateSimpleButton("but_Bl_right", "Blend Right");
    //         button_Blend_Right.paddingTop = "10px";
    //         button_Blend_Right.width = "100px";
    //         button_Blend_Right.height = "50px";
    //         button_Blend_Right.color = "white";
    //         button_Blend_Right.background = "black";
    //         button_Blend_Right.onPointerDownObservable.add(() => {
    //             if (walkRange && rightRange) {
    //                 scene_Mundo.stopAnimation(skeleton_Heroi);
    //                 var walkAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, walkRange.from, walkRange.to, 0.5, true);
    //                 var rightAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, rightRange.from, rightRange.to, 0.5, true);

    //                 // Note: Sync Speed Ratio With Master Walk Animation
    //                 walkAnim.syncWith(null);
    //                 rightAnim.syncWith(walkAnim);

    //                 button_Blend_Right.background = "green";
    //             }
    //         });
    //         UiPanel.addControl(button_Blend_Right);

    //         return { button_Walk, button_Idle, button_Blend_Left, button_Blend_Right, button_Left, button_Right, button_Run };
    //     }
    // });

    // Adiciona o GIGANTE
    // BABYLON.SceneLoader.ImportMesh("", Assets.meshes.Yeti.rootUrl, Assets.meshes.Yeti.filename, scene_Mundo, function (mesh_Gigante) {
    //     mesh_Gigante[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    //     mesh_Gigante[0].position = new BABYLON.Vector3(0, 0, 20);

    //     //mesh_Gigante.checkCollisions = true;
    // });

     //# Adiciona o LABIRINTO!!
    var labirinto = null;
    BABYLON.SceneLoader.ImportMesh("", "./assets/ambiente/", "labirinto_01.glb", scene_Mundo, function (mesh_Labirinto)
    // BABYLON.SceneLoader.ImportMesh("", "./assets/ambiente/", "ambiente_01/scene.glb", scene_Mundo, function (mesh_Labirinto)
    {
        // labirinto = BABYLON.Mesh.MergeMeshes([mesh_Labirinto, box]);
        // mesh_Labirinto[0].scaling = new BABYLON.Vector3(10, 1, 1);
        // mesh_Labirinto[0].position = new BABYLON.Vector3(0, 5.1, 0);
        // // addToMirror(mesh_Labirinto);
        // // addShadows(mesh_Labirinto);
        // mesh_Labirinto[0].collisionsEnabled = true;
        // mesh_Labirinto[0].checkCollisions = true;
    });

    // });


    //# Adiciona o PORTAL NORDESTE no LABIRINTO!!
     
    // });

    //# Adiciona o PORTAL NORTE no LABIRINTO!!
     
    // });

    //# Adiciona o PORTAL SUL no LABIRINTO!!
     
    // });

    //# Adiciona o PORTAL SUDESTE no LABIRINTO!!
     
    // });

    //# Adiciona o PORTAL CENTRO-OESTE no LABIRINTO!!
     
    // });


    // Adiciona o personagem personalizado GLTF OK!!
    var mentor = null;
    BABYLON.SceneLoader.ImportMesh("", "./assets/personagens/npc/Old_Man_separado/", "Old_Man_convertido_separado.gltf", scene_Mundo, function (mesh_Old_Man_Separado) {
        mentor.scaling = new BABYLON.Vector3(5.5, 5.5, 5.5);
        mentor.position = new BABYLON.Vector3(-15, 0, 5);

        // Elipse para verificar as colisões
        mentor.ellipsoid = new BABYLON.Vector3(9, 8, 8);
        mentor.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
        mentor.checkCollisions = true;

        // Exibe a elipse que envolve o OldMan
        drawEllipsoid(mentor);

        if (box.intersectsMesh(box2, true)) {
            console.log("box com box 2!")
         box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            // box.dispose();
        }
        else{
            console.log("Box nao colidiu com box!")
            box.material.emissiveColor = new BABYLON.Color3(0, 1, 0); 
        }


        if (mesh_Heroi.intersectsMesh(mentor, true)) {
            console.log("Heroi colidiu no mentor!")
         box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            // box.dispose();
        }
        else{
            console.log("Heroi não colidiu no mentor!")
            box.material.emissiveColor = new BABYLON.Color3(0, 0, 0); 
        }

    });

    // // Adiciona o personagem Merlin
    // BABYLON.SceneLoader.ImportMesh("", "./assets/personagens/npc/", "Merlin.glb", scene_Mundo, function (mesh_Merlin) {
    //     mesh_Merlin[0].scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
    //     mesh_Merlin[0].position = new BABYLON.Vector3(21, 0, 5);

    //     // mesh_Merlin.checkCollisions = true;

    //     // Elipse para verificar as colisões
    //     mesh_Merlin[0].ellipsoid = new BABYLON.Vector3(9, 8, 8);
    //     mesh_Merlin[0].ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
    //     mesh_Merlin[0].checkCollisions = true;

    //     // Exibe a elipse que envolve o mesh_Merlin
    //     drawEllipsoid(mesh_Merlin[0]);

    //     if (mesh_Heroi.intersectsMesh(mesh_Merlin, true)) {
    //         console.log("Heroi colidiu no mesh_Merlin!")
    //      box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
    //         // box.dispose();
    //     }
    //     else{
    //         console.log("Heroi não colidiu no mesh_Merlin!")
    //         box.material.emissiveColor = new BABYLON.Color3(0, 0, 0); 
    //     }

    // });

    // Adiciona o EMOGI FELIZ
    BABYLON.SceneLoader.ImportMesh("", "./assets/itens/", "Carinha_Feliz.glb", scene_Mundo, function (mesh_Carinha_Feliz, particleSystems, skeletons_Carinha_Feliz) {
        mesh_Carinha_Feliz[0].scaling = new BABYLON.Vector3(150, 150, 150);
        mesh_Carinha_Feliz[0].position = new BABYLON.Vector3(0, 2, 40);

        // mesh_Carinha_Feliz.checkCollisions = true;
       
       
        mesh_Carinha_Feliz.collisionsEnabled = true;



         // Elipse para verificar as colisões
         mesh_Carinha_Feliz[0].ellipsoid = new BABYLON.Vector3(9, 8, 8);
         mesh_Carinha_Feliz[0].ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
         mesh_Carinha_Feliz[0].checkCollisions = true;
 
         // Exibe a elipse que envolve o mesh_Carinha_Feliz
         drawEllipsoid(mesh_Carinha_Feliz[0]);
 
         if (mesh_Heroi.intersectsMesh(mesh_Carinha_Feliz, true)) {
             console.log("Heroi colidiu no mesh_Carinha_Feliz!")
          box.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
             // box.dispose();
         }
         else{
             console.log("Heroi não colidiu no mesh_Carinha_Feliz!")
             box.material.emissiveColor = new BABYLON.Color3(0, 0, 0); 
         }
    });


    // Adiciona o EMOGI OLHOS
    BABYLON.SceneLoader.ImportMesh("", "./assets/itens/", "Carinha_Olhos.glb", scene_Mundo, function (mesh_Carinha_Olhos, particleSystems, skeletons_Carinha_cor) {
        mesh_Carinha_Olhos[0].scaling = new BABYLON.Vector3(150, 150, 150);
        mesh_Carinha_Olhos[0].position = new BABYLON.Vector3(10, 2, 20);

        mesh_Carinha_Olhos.checkCollisions = true;

    });

    // Adiciona o Bordo Japonês
    BABYLON.SceneLoader.ImportMesh("", "./assets/plantas/", "Bordo.glb", scene_Mundo, function (mesh_Bordo) {
        mesh_Bordo[0].scaling = new BABYLON.Vector3(30, 30, 30);
        mesh_Bordo[0].position = new BABYLON.Vector3(25, 0, 0);

        mesh_Bordo[0].checkCollisions = true;

    });

    // Adiciona o Cacto simples
    BABYLON.SceneLoader.ImportMesh("", "./assets/plantas/", "Cacto_2.glb", scene_Mundo, function (mesh_Cacto_2) {
        mesh_Cacto_2[0].scaling = new BABYLON.Vector3(20, 20, 20);
        mesh_Cacto_2[0].position = new BABYLON.Vector3(45, 0, -3);


    });

    // Adiciona o Cacto realista
    BABYLON.SceneLoader.ImportMesh("", "./assets/plantas/", "Cacto_1.glb", scene_Mundo, function (mesh_Cacto_1) {
        mesh_Cacto_1[0].scaling = new BABYLON.Vector3(30, 30, 30);
        mesh_Cacto_1[0].position = new BABYLON.Vector3(45, 0, -2);

    });

    // // Adiciona as Folhas caindo
    // BABYLON.SceneLoader.ImportMesh("", "./assets/plantas/", "Folhas_caindo.glb", scene_Mundo, function (mesh_Folhas) {
    //     mesh_Folhas[0].scaling = new BABYLON.Vector3(20, 20, 20);
    //     mesh_Folhas[0].position = new BABYLON.Vector3(25, 0, 0);

    // });
    
    // Adiciona a Pilha de folhas
    BABYLON.SceneLoader.ImportMesh("", "./assets/plantas/", "Pilha de folhas.glb", scene_Mundo, function (mesh_Pilha_Folhas) {
        mesh_Pilha_Folhas[0].scaling = new BABYLON.Vector3(50, 50, 50);
        mesh_Pilha_Folhas[0].position = new BABYLON.Vector3(23, 0, 0);
    });

    // Adiciona a Macieira
    BABYLON.SceneLoader.ImportMesh("", "./assets/plantas/", "Macieira.glb", scene_Mundo, function (mesh_Macieira) {
        mesh_Macieira[0].scaling = new BABYLON.Vector3(8, 8, 8);
        mesh_Macieira[0].position = new BABYLON.Vector3(20, 0, -10);

        mesh_Macieira.checkCollisions = true;

    });

    

    // Adiciona a Pinheiro Nevado
    BABYLON.SceneLoader.ImportMesh("", "./assets/plantas/", "Pinheiro Nevado.glb", scene_Mundo, function (mesh_Pinheiro) {
        mesh_Pinheiro[0].scaling = new BABYLON.Vector3(5, 5, 5);
        mesh_Pinheiro[0].position = new BABYLON.Vector3(30, 0, -15);

        mesh_Pinheiro.checkCollisions = true;

    });

    // // Adiciona a ABELHA
    // BABYLON.SceneLoader.ImportMesh("", "./assets/animais/", "Bee.glb", scene_Mundo, function (mesh_Bee, particleSystems, skeletons_Bee) {
    //     mesh_Bee[0].scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
    //     mesh_Bee[0].position = new BABYLON.Vector3(0, 0, 25);

    //     // skeleton_Bee = skeletons_Bee[];

    //     // var flyBee = skeleton_Bee.getAnimationRange("fly");
    //     // flyBee_Anim = scene_Mundo.beginWeightedAnimation(skeleton_Bee, flyBee.from, flyBee.to, 0, true);

    //     // flyBee_Anim;

    //     if ((mesh_Bee[0].position.z - mesh_Heroi.position.z) <= 20)
    //         console.log("colidiu abelha!");
    
    // console.log("Abelha: ", mesh_Bee[0].position);
    

    // });


     // Adiciona o NPC que acompanhará o herói
    //  BABYLON.SceneLoader.ImportMesh("", "./assets/personagens/npc/", "xx.glb", scene_Mundo, function (mesh_NPC, particleSystems, skeletons_NPC) {
    //     mesh_NPC[0].scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
    //     mesh_NPC[0].position = new BABYLON.Vector3(0, 0, 15);
    //     // mesh_NPC[0].position = main.position;

    //     // mesh_NPC[0].collisionsEnabled;
    //     // mesh_NPC[0].checkCollisions = true;
    
    //     // mesh_NPC[0].parent = main;

    //     main.moveWithCollisions(m.add(meshmesh_NPC_Bee[0]));


    // BABYLON.SceneLoader.ImportMesh("", "./assets//animais/", "Bee2.glb", scene_Mundo, function (mesh_Bee2) {
    //     mesh_Bee2[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    //     mesh_Bee2[0].position = new BABYLON.Vector3(10, 0, 25);

    //     mesh_Bee.checkCollisions = true;
    // });

      // Adiciona elemento do ambiente
    //   BABYLON.SceneLoader.ImportMesh("", "./ambiente/", "parabens.glb", scene_Mundo, function(mesh_elemento){
    //     // mesh_elemento[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
    //     mesh_elemento[0].position = new BABYLON.Vector3(0, 2, -18);
    //  });  

    



    // // Adiciona o AMBIENTE
    // BABYLON.SceneLoader.ImportMesh("", "./ambiente/", "estadio.glb", scene_Mundo, function(mesh_ambiente){
    //     // mesh_ambiente[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
    //      mesh_ambiente[0].position = new BABYLON.Vector3(0, 0, 0);
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
    var portal_Azul = geraPortal("assets/textures/item/blue_Portal1.png", new BABYLON.Vector3(0, 1, -10));
    var portal_Vermelho = geraPortal("assets/textures/item/red_Portal1.png", new BABYLON.Vector3(0, -2, 0));

    // Portal da dimensão da 2ª tarefa
    var portal_Azul = geraPortal("assets/textures/item/blue_Portal1.png", new BABYLON.Vector3(2, 1, -10));
    var portal_Vermelho = geraPortal("assets/textures//item/red_Portal1.png", new BABYLON.Vector3(-2, -2, 0));

    // Portal da dimensão da 3ª tarefa
    var portal_Azul = geraPortal("assets/textures/item/blue_Portal1.png", new BABYLON.Vector3(2, 1, -10));
    var portal_Vermelho = geraPortal("assets/textures/item/red_Portal1.png", new BABYLON.Vector3(-2, -2, 0));

    // Cria a ATMOSFERA
    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, scene_Mundo, undefined, BABYLON.Mesh.BACKSIDE);
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene_Mundo);
    backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/TropicalSunnyDay", scene_Mundo);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;
    

    return scene_Mundo;

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

// Painel com botões para testes
function painelButtons() {
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var UiPanel = new BABYLON.GUI.StackPanel();
    UiPanel.width = "220px";
    UiPanel.fontSize = "14px";
    UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(UiPanel);

    // Botão Menu
    var Button_Menu = BABYLON.GUI.Button.CreateSimpleButton("butMenu", "Menu");
    Button_Menu.paddingTop = "10px";
    Button_Menu.width = "100px";
    Button_Menu.height = "50px";
    Button_Menu.color = "white";
    Button_Menu.background = "black";
    Button_Menu.onPointerDownObservable.add(() => {
        if (Button_Menu) {
            document.write("<canvas id='canvasPrimario' width='1520' height='840'></canvas><script src='js/menuPrincipal.js'></script>");
            console.log("apertou MENU");
            Button_Menu = 0;
        }
    });
    UiPanel.addControl(Button_Menu);

    // Botão Camera do Player
    var Button_Camera = BABYLON.GUI.Button.CreateSimpleButton("butCam", "Camera");
    Button_Camera.paddingTop = "10px";
    Button_Camera.width = "100px";
    Button_Camera.height = "50px";
    Button_Camera.color = "white";
    Button_Camera.background = "black";
    // Button_Camera.onPointerDownObservable.add(() => {
    //     if (Button_Camera) {
    //         document.write("<canvas id='canvasPrimario' width='1520' height='840'></canvas><script src='js/menuPrincipal.js'></script>");
            
    //         // // Moldura da câmera
    //         document.write("<div class='divs divFixed' style='z-index': 999;'><img src='textures/hud/molduraCamera.png'></div>");
    //         document.write("<div style="position: fixed; top: 29px; left: 11px; z-index: 100;" top="50px" left="350px">
    //         <video class="input_video"></video>
    //         <canvas class="output_canvas" width="18%" height="20%"></canvas>
    //     </div>           ");
    
    //     {/* Camera do Player
        
            
    //         console.log("apertou CAMERA");
    //         Button_Camera = 0;
    //     }
    // });
    UiPanel.addControl(Button_Camera);

    // Botão Tarefa 01
    var Button_Job01 = BABYLON.GUI.Button.CreateSimpleButton("butTarefa", "Tarefa 01");
    Button_Job01.paddingTop = "10px";
    Button_Job01.width = "100px";
    Button_Job01.height = "50px";
    Button_Job01.color = "white";
    Button_Job01.background = "black";
    Button_Job01.onPointerDownObservable.add(() => {
        if (Button_Job01) {
            document.write("<canvas id='canvasPrimario' width='1520' height='840'></canvas><script src='js/job_01MTA.js'></script>");
            console.log("apertou Tarefa 01");
            Button_Job01 = 0;
        }
    });
    UiPanel.addControl(Button_Job01);

    

    return UiPanel;
}


    //  scene_Mundo.activeCamera.beta -= 0.2; // Pociciona a camera em um ângulo especificado



//Refatorar para passar o objeto como parâmetro
function control_Player(skeleton_Heroi, scene_Mundo){
    
    // var mesh_Heroi = mesh_Heroi[0];
    var mesh_Heroi = mesh_Heroi[1];

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
    window.scene = create_Mundo();
};
initFunction().then(() => {
    sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});