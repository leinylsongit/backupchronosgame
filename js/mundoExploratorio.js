var canvas = document.getElementById("canvasPrimario");
var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene_Mundo = null;
var sceneToRender = null;

var createDefaultEngine = function () {
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
};

// Cenário do Mundo Exploratório
var create_Mundo = function () {
    engine.enableOfflineSupport = false;

    // Utilizado para decomposeLerp e interpolação de matrizes
    BABYLON.Animation.AllowMatricesInterpolation = true;

    // Animação de Carregando
    engine.displayLoadingUI();

    // Cria a cena do MUNDO
    var scene_Mundo = new BABYLON.Scene(engine);

    // Adiciona física ao cenário
    // var gravityVector = new BABYLON.Vector3(0,-9.81, 0); // opcional
    // var physicsPlugin = new BABYLON.CannonJSPlugin(); // opcional
    // scene_Mundo.enablePhysics(gravityVector, physicsPlugin);
    scene_Mundo.enablePhysics();

    // await Ammo();
    // scene_Mundo.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.AmmoJSPlugin());

    // Adiciona a CÂMERA
    var camera_3 = createCamera(scene_Mundo);

    // Adiciona as fontes de LUZ 
    var light = createLight(scene_Mundo);

    // Adiciona as SOMBRAS
    var shadow = createShadow(light);

    // Cria as dimenssões do mundo
    // Criar um novo chão sempre que o chão anterior sair metade do campo de visão do herói
    // fazer uma pista grande, fora dos limites do skybox e quando o heroi retornar do ambiente de tarefa
    // ele continua só que lá do inicio da pista, de forma que ele nao perceba que esta passando no mesmo lugar

    // Terão 4 níveis de chão, cada um representando uma dimenssão espacial
    // O heroi pode ir por qualquer um dos niveis usando os portais que forem aparecendo

    // Passar na função de criar o chão: a cor/textura, tamanho, pos_x, pos_y, pos_z
    // 1ª Dimenssão: portais levarão a tarefas de MEMÓRIA de trabalho 
    var ground_1 = createGround(
        scene_Mundo,
        { width: 10, height: 300 },
        new BABYLON.Color3(1, 0, 0),
        new BABYLON.Vector3(1, 0, 1)
    );

    // 2ª Dimenssão: portais levarão a tarefas de REPRODUÇÃO do tempo
    var ground_2 = createGround(
        scene_Mundo,
        { width: 10, height: 20 },
        new BABYLON.Color3(0, 1, 0),
        new BABYLON.Vector3(1, 10, 1)
    );

    // 3ª Dimenssão: portais levarão a tarefas de PRODUÇÃO do tempo
    var ground_3 = createGround(
        scene_Mundo,
        { width: 10, height: 30 },
        new BABYLON.Color3(0, 0, 1),
        new BABYLON.Vector3(1, 20, 1)
    );

    // 4ª Dimenssão: portais levarão a tarefas de ESTIMATIVA de tempo
    var ground_4 = createGround(
        scene_Mundo,
        { width: 10, height: 40 },
        new BABYLON.Color3(1, 1, 1),
        new BABYLON.Vector3(1, 30, 1)
    );

    ground_1.material = new BABYLON.GridMaterial("groundMat");
    
    
    
    // var helper = scene_Mundo.createDefaultEnvironment({
    //     enableGroundShadow: true
    // });
    // helper.setMainColor(BABYLON.Color3.Gray());
    // helper.ground.position.y += 0.01;


    // Definição da Interface do Usuário
    var UiPanel = painelButtons();

    // Adiciona o HERÓI
    BABYLON.SceneLoader.ImportMesh("", "./player/", "heroi.babylon", scene_Mundo, function (mesh_Heroi, particleSystems, skeletons_Heroi) {

        // Tamanho do Herói
        escala_Heroi = 1;
        mesh_Heroi[0].scaling = new BABYLON.Vector3(escala_Heroi, escala_Heroi, escala_Heroi);

        // Posição inicial do Herói
        posHoriz_Heroi = 0
        posVert_Heroi = 0;
        posProfund_Heroi = -140;

        mesh_Heroi[0].position = new BABYLON.Vector3(posHoriz_Heroi, posVert_Heroi, posProfund_Heroi);

        // Adiciona sombra ao herói?
        shadow.addShadowCaster(scene_Mundo.meshes[0], true);
        for (var index = 0; index < mesh_Heroi.length; index++) {
            mesh_Heroi[index].receiveShadows = false;;
        }

        // Adiciona física ao herói?
        mesh_Heroi.physicsImpostor = new BABYLON.PhysicsImpostor(
            mesh_Heroi,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 2, restitution: .6 }
        );

        // Propriedades das animações do Herói
        var skeleton_Heroi = skeletons_Heroi[0];
        skeleton_Heroi.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
        skeleton_Heroi.animationPropertiesOverride.enableBlending = true;
        skeleton_Heroi.animationPropertiesOverride.blendingSpeed = 0.05;
        skeleton_Heroi.animationPropertiesOverride.loopMode = 1;

        // Carrega as animações do Herói
        var idleRange = skeleton_Heroi.getAnimationRange("YBot_Idle");
        var walkRange = skeleton_Heroi.getAnimationRange("YBot_Walk");
        var runRange = skeleton_Heroi.getAnimationRange("YBot_Run");
        var leftRange = skeleton_Heroi.getAnimationRange("YBot_LeftStrafeWalk");
        var rightRange = skeleton_Heroi.getAnimationRange("YBot_RightStrafeWalk");

        // IDLE
        if (idleRange) {
            scene_Mundo.beginAnimation(skeleton_Heroi, idleRange.from, idleRange.to, true);

            // Rotaciona a camera orbitando o herói
            // scene_Mundo.activeCamera.useAutoRotationBehavior = true;
        }

        // Botões de controle do Herói
        var { button_Walk, button_Idle, button_Blend_Left, button_Blend_Right, button_Left, button_Right, button_Run } = heroiButtons();

        // Oculta a animação de carregando
        engine.hideLoadingUI();

        pause = false;

        scene_Mundo.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    switch (kbInfo.event.key) {
                        case "w":
                            scene_Mundo.beginAnimation(skeleton_Heroi, walkRange.from, walkRange.to, true);
                            //mesh_Heroi[0].position.z += 0.1; // Move o herói ao inves da plataforma
                            ground_1.position.z -= 0.5;
                            ground_2.position.z -= 0.5;
                            ground_3.position.z -= 0.5;
                            ground_4.position.z -= 0.5;
                            button_Walk.background = "blue";
                            break

                        case "s":
                            scene_Mundo.beginAnimation(skeleton_Heroi, idleRange.from, idleRange.to, true);
                            button_Idle.background = "blue";
                            break

                        case "q":
                            if (walkRange && leftRange) {
                                scene_Mundo.stopAnimation(skeleton_Heroi);
                                var walkAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, walkRange.from, walkRange.to, 0.5, true);
                                var leftAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, leftRange.from, leftRange.to, 0.5, true);

                                walkAnim.syncWith(null);
                                leftAnim.syncWith(walkAnim);
                                button_Blend_Left.background = "blue";
                            }
                            break

                        case "e":
                            if (walkRange && rightRange) {
                                scene_Mundo.stopAnimation(skeleton_Heroi);
                                var walkAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, walkRange.from, walkRange.to, 0.5, true);
                                var rightAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, rightRange.from, rightRange.to, 0.5, true);

                                walkAnim.syncWith(null);
                                rightAnim.syncWith(walkAnim);
                                button_Blend_Right.background = "blue";
                            }
                            break

                        case "a":
                            scene_Mundo.beginAnimation(skeleton_Heroi, leftRange.from, leftRange.to, true);
                            button_Left.background = "blue";
                            break

                        case "d":
                            scene_Mundo.beginAnimation(skeleton_Heroi, rightRange.from, rightRange.to, true);
                            button_Right.background = "blue";
                            break

                        case "r":
                            scene_Mundo.beginAnimation(skeleton_Heroi, runRange.from, runRange.to, true);
                            button_Run.background = "blue";
                            break

                        case "1": //Alterna para 3ª pessoa
                            camera_3.lowerRadiusLimit = 4;
                            camera_3.upperRadiusLimit = 100;
                            camera_3.wheelDeltaPercentage = 0.01;
                            break

                        case "2": //Alterna para 1ª pessoa
                            camera_3.lowerRadiusLimit = 1;
                            camera_3.upperRadiusLimit = 0;
                            camera_3.wheelDeltaPercentage = 0.01;
                            break

                        case "3": //Alterna para visão lateral "2d" do ambiente
                            camera_3.lowerRadiusLimit = 60;
                            camera_3.upperRadiusLimit = 600;
                            camera_3.radius = 30;
                            break

                        // case "o": 
                        // // Adiciona o AMBIENTE
                        // BABYLON.SceneLoader.ImportMesh("", "./ambiente/", "estadio.glb", scene_Mundo, function(mesh_ambiente){
                        //     // mesh_ambiente[0].scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
                        //     mesh_ambiente[0].position = new BABYLON.Vector3(0, 0, 0);
                        // });
                        // break

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
                    }
            }
        });

        function heroiButtons() {
            // BOTÃO: Idle
            var button_Idle = BABYLON.GUI.Button.CreateSimpleButton("but_Idle", "Play Idle");
            button_Idle.paddingTop = "10px";
            button_Idle.width = "100px";
            button_Idle.height = "50px";
            button_Idle.color = "white";
            button_Idle.background = "black";
            button_Idle.onPointerDownObservable.add(() => {
                if (idleRange) {
                    scene_Mundo.beginAnimation(skeleton_Heroi, idleRange.from, idleRange.to, true);
                    button_Idle.background = "green";
                }
            });
            UiPanel.addControl(button_Idle);


            // BOTÃO: Walk
            var button_Walk = BABYLON.GUI.Button.CreateSimpleButton("but_Walk", "Play Walk");
            button_Walk.paddingTop = "10px";
            button_Walk.width = "100px";
            button_Walk.height = "50px";
            button_Walk.color = "white";
            button_Walk.background = "black";
            button_Walk.onPointerDownObservable.add(() => {
                if (walkRange) {
                    scene_Mundo.beginAnimation(skeleton_Heroi, walkRange.from, walkRange.to, true);
                    button_Walk.background = "green";
                }
            });
            UiPanel.addControl(button_Walk);

            // BOTÃO: Run
            var button_Run = BABYLON.GUI.Button.CreateSimpleButton("but_Run", "Play Run");
            button_Run.paddingTop = "10px";
            button_Run.width = "100px";
            button_Run.height = "50px";
            button_Run.color = "white";
            button_Run.background = "black";
            button_Run.onPointerDownObservable.add(() => {
                if (runRange) {
                    scene_Mundo.beginAnimation(skeleton_Heroi, runRange.from, runRange.to, true);
                    button_Run.background = "green";
                }
            });
            UiPanel.addControl(button_Run);

            // BOTÃO: Left
            var button_Left = BABYLON.GUI.Button.CreateSimpleButton("but_Left", "Play Left");
            button_Left.paddingTop = "10px";
            button_Left.width = "100px";
            button_Left.height = "50px";
            button_Left.color = "white";
            button_Left.background = "black";
            button_Left.onPointerDownObservable.add(() => {
                if (leftRange) {
                    scene_Mundo.beginAnimation(skeleton_Heroi, leftRange.from, leftRange.to, true);
                    button_Left.background = "green";
                }
            });
            UiPanel.addControl(button_Left);

            // BOTÃO: Right
            var button_Right = BABYLON.GUI.Button.CreateSimpleButton("but_Right", "Play Right");
            button_Right.paddingTop = "10px";
            button_Right.width = "100px";
            button_Right.height = "50px";
            button_Right.color = "white";
            button_Right.background = "black";
            button_Right.onPointerDownObservable.add(() => {
                if (rightRange) {
                    scene_Mundo.beginAnimation(skeleton_Heroi, rightRange.from, rightRange.to, true);
                    button_Right.background = "green";
                }
            });
            UiPanel.addControl(button_Right);

            // BOTÃO: Blend Left
            var button_Blend_Left = BABYLON.GUI.Button.CreateSimpleButton("but_Bl_left", "Blend Left");
            button_Blend_Left.paddingTop = "10px";
            button_Blend_Left.width = "100px";
            button_Blend_Left.height = "50px";
            button_Blend_Left.color = "white";
            button_Blend_Left.background = "black";
            button_Blend_Left.onPointerDownObservable.add(() => {
                if (walkRange && leftRange) {
                    scene_Mundo.stopAnimation(skeleton_Heroi);
                    var walkAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, walkRange.from, walkRange.to, 0.5, true);
                    var leftAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, leftRange.from, leftRange.to, 0.5, true);

                    // Note: Sync Speed Ratio With Master Walk Animation
                    walkAnim.syncWith(null);
                    leftAnim.syncWith(walkAnim);

                    button_Blend_Left.background = "green";
                }
            });
            UiPanel.addControl(button_Blend_Left);

            // BOTÃO: Blend Right
            var button_Blend_Right = BABYLON.GUI.Button.CreateSimpleButton("but_Bl_right", "Blend Right");
            button_Blend_Right.paddingTop = "10px";
            button_Blend_Right.width = "100px";
            button_Blend_Right.height = "50px";
            button_Blend_Right.color = "white";
            button_Blend_Right.background = "black";
            button_Blend_Right.onPointerDownObservable.add(() => {
                if (walkRange && rightRange) {
                    scene_Mundo.stopAnimation(skeleton_Heroi);
                    var walkAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, walkRange.from, walkRange.to, 0.5, true);
                    var rightAnim = scene_Mundo.beginWeightedAnimation(skeleton_Heroi, rightRange.from, rightRange.to, 0.5, true);

                    // Note: Sync Speed Ratio With Master Walk Animation
                    walkAnim.syncWith(null);
                    rightAnim.syncWith(walkAnim);

                    button_Blend_Right.background = "green";
                }
            });
            UiPanel.addControl(button_Blend_Right);

            return { button_Walk, button_Idle, button_Blend_Left, button_Blend_Right, button_Left, button_Right, button_Run };
        }
    });

    // Adiciona o GIGANTE
    BABYLON.SceneLoader.ImportMesh("", Assets.meshes.Yeti.rootUrl, Assets.meshes.Yeti.filename, scene_Mundo, function (mesh_Gigante) {
        mesh_Gigante[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        mesh_Gigante[0].position = new BABYLON.Vector3(0, 0, 20);
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

    // Adiciona a MÃO
    //BABYLON.SceneLoader.ImportMesh("", "./scenes/", "hand.babylon", scene_Mundo, function (newMeshes, particleSystems, skeletons) {

    /* Sistemas de particulas utilizados como checkinpoint em 3 situações:
    1. Para salvar o progresso;
    2. Como gatilhos para disparar as cutscenes (videos que desenvolvem o enredo e geralmente
    são mostradas na conclusão de um nível, quando o personagem completa a fase e entre
    cada pequena missão, preenchendo as lacunas da história);
    3. Para executar os vídeos com instruções de como realizar a respectiva tarefa.*/
    
    // Deve haver um par de portal para cada dimenssão
    // Portal da 1ª dimensão
    var portal_Azul = geraPortal("textures/blue_Portal1.png", new BABYLON.Vector3(0, 1, -10));
    var portal_Vermelho = geraPortal("textures/red_Portal1.png", new BABYLON.Vector3(0, -2, 0));

    // Portal da 2ª dimensão
    var portal_Azul = geraPortal("textures/blue_Portal1.png", new BABYLON.Vector3(2, 1, -10));
    var portal_Vermelho = geraPortal("textures/red_Portal1.png", new BABYLON.Vector3(-2, -2, 0));

    // Portal da 3ª dimensão
    var portal_Azul = geraPortal("textures/blue_Portal1.png", new BABYLON.Vector3(2, 1, -10));
    var portal_Vermelho = geraPortal("textures/red_Portal1.png", new BABYLON.Vector3(-2, -2, 0));

    // Portal da 4ª dimensão
    var portal_Azul = geraPortal("textures/blue_Portal1.png", new BABYLON.Vector3(2, 1, -10));
    var portal_Vermelho = geraPortal("textures/red_Portal1.png", new BABYLON.Vector3(-2, -2, 0));

    // Cria a ATMOSFERA
    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, scene_Mundo, undefined, BABYLON.Mesh.BACKSIDE);
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene_Mundo);
    backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/TropicalSunnyDay", scene_Mundo);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;
    
    // Cria caixas em posições aleatórias
    // build_Boxes();
    
    // Interação com objeto usando a mão
    //gira_Objeto(scene_Mundo);

    return scene_Mundo;




    // Gera número aleatorio entre um intervalo
    var randomNumber = function (min, max) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    };



    //Refatorar para criar caixas conforme a quantidade solicitada
    // Usar a função de clonar objetos
    // var box = BABYLON.MeshBuilder.CreateBox("box", {size: 7}, snece);
    // var box2 = box.clone(box);
    // box2.position.x = 20;
    // box2.position.y = 20;
    // boxe.position = new BABYLON.Vector3(1, 1, 1);
    function build_Boxes() {
        var boxes = new Array(10);
        boxes = [BABYLON.MeshBuilder.CreateBox("Box", { size: 0.5 }, scene_Mundo),
        BABYLON.MeshBuilder.CreateBox("Box", { size: 0.5 }, scene_Mundo),
        BABYLON.MeshBuilder.CreateBox("Box", { size: 0.5 }, scene_Mundo),
        BABYLON.MeshBuilder.CreateBox("Box", { size: 0.5 }, scene_Mundo),
        BABYLON.MeshBuilder.CreateBox("Box", { size: 0.5 }, scene_Mundo),
        BABYLON.MeshBuilder.CreateBox("Box", { size: 0.5 }, scene_Mundo),
        BABYLON.MeshBuilder.CreateBox("Box", { size: 0.5 }, scene_Mundo),
        BABYLON.MeshBuilder.CreateBox("Box", { size: 0.5 }, scene_Mundo),
        BABYLON.MeshBuilder.CreateBox("Box", { size: 0.5 }, scene_Mundo),
        BABYLON.MeshBuilder.CreateBox("Box", { size: 7 }, scene_Mundo),
        BABYLON.MeshBuilder.CreateBox("Box", { size: 7 }, scene_Mundo)];
        console.log("Quant. de caixas: ", boxes);

        boxes.checkCollisions = true;

        // Box 1
        horizontal_Box = parseInt(Math.random() * 3);
        altura_Box = parseInt(Math.random() * 3);
        vertical_Box = parseInt(Math.random() * 3);

        boxes[0].position = new BABYLON.Vector3(horizontal_Box, altura_Box, vertical_Box);
        var materialWood = new BABYLON.StandardMaterial("wood", scene_Mundo);
        materialWood.diffuseTexture = new BABYLON.Texture("textures/background/background_04.jpg", scene_Mundo);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boxes[0].material = materialWood;
        shadow.addShadowCaster(boxes[0]);

        // Box 2
        horizontal_Box = parseInt(Math.random() * 3);
        altura_Box = parseInt(Math.random() * 3);
        vertical_Box = parseInt(Math.random() * 3);

        boxes[1].position = new BABYLON.Vector3(horizontal_Box, altura_Box, vertical_Box);
        var materialWood = new BABYLON.StandardMaterial("wood", scene_Mundo);
        materialWood.diffuseTexture = new BABYLON.Texture("textures/background/background_03.png", scene_Mundo);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boxes[1].material = materialWood;
        shadow.addShadowCaster(boxes[1]);

        // Box 3
        horizontal_Box = parseInt(Math.random() * 3);
        altura_Box = parseInt(Math.random() * 3);
        vertical_Box = parseInt(Math.random() * 3);

        boxes[2].position = new BABYLON.Vector3(horizontal_Box, altura_Box, vertical_Box);
        var materialWood = new BABYLON.StandardMaterial("wood", scene_Mundo);
        materialWood.diffuseTexture = new BABYLON.Texture("textures/background/background_02.jpg", scene_Mundo);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boxes[2].material = materialWood;
        shadow.addShadowCaster(boxes[2]);

        // Box 4
        horizontal_Box = parseInt(Math.random() * 3);
        altura_Box = parseInt(Math.random() * 3);
        vertical_Box = parseInt(Math.random() * 3);

        boxes[3].position = new BABYLON.Vector3(horizontal_Box, altura_Box, vertical_Box);
        var materialWood = new BABYLON.StandardMaterial("wood", scene_Mundo);
        materialWood.diffuseTexture = new BABYLON.Texture("textures/tarefa01.png", scene_Mundo);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boxes[3].material = materialWood;
        shadow.addShadowCaster(boxes[3]);

        // Box 5
        horizontal_Box = parseInt(Math.random() * 3);
        altura_Box = parseInt(Math.random() * 3);
        vertical_Box = parseInt(Math.random() * 3);

        boxes[4].position = new BABYLON.Vector3(horizontal_Box, altura_Box, vertical_Box);
        var materialWood = new BABYLON.StandardMaterial("wood", scene_Mundo);
        materialWood.diffuseTexture = new BABYLON.Texture("textures/cerebro.jpeg", scene_Mundo);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boxes[4].material = materialWood;
        shadow.addShadowCaster(boxes[4]);

        // Box 6
        horizontal_Box = parseInt(Math.random() * 3);
        altura_Box = parseInt(Math.random() * 3);
        vertical_Box = parseInt(Math.random() * 3);

        boxes[5].position = new BABYLON.Vector3(horizontal_Box, altura_Box, vertical_Box);
        var materialWood = new BABYLON.StandardMaterial("wood", scene_Mundo);
        materialWood.diffuseTexture = new BABYLON.Texture("textures/background/background_06.jpg", scene_Mundo);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boxes[5].material = materialWood;
        shadow.addShadowCaster(boxes[4]);

        // Box 7
        horizontal_Box = parseInt(Math.random() * 3);
        altura_Box = parseInt(Math.random() * 3);
        vertical_Box = parseInt(Math.random() * 3);

        boxes[6].position = new BABYLON.Vector3(horizontal_Box, altura_Box, vertical_Box);
        var materialWood = new BABYLON.StandardMaterial("wood", scene_Mundo);
        materialWood.diffuseTexture = new BABYLON.Texture("textures/background/background_08.jpg", scene_Mundo);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boxes[6].material = materialWood;
        shadow.addShadowCaster(boxes[4]);

        // Box 8
        horizontal_Box = parseInt(Math.random() * 3);
        altura_Box = parseInt(Math.random() * 3);
        vertical_Box = parseInt(Math.random() * 3);

        boxes[7].position = new BABYLON.Vector3(horizontal_Box, altura_Box, vertical_Box);
        var materialWood = new BABYLON.StandardMaterial("wood", scene_Mundo);
        materialWood.diffuseTexture = new BABYLON.Texture("textures/background/brazil_00.jpg", scene_Mundo);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boxes[7].material = materialWood;
        shadow.addShadowCaster(boxes[4]);

        // Box 9
        horizontal_Box = parseInt(Math.random() * 3);
        altura_Box = parseInt(Math.random() * 3);
        vertical_Box = parseInt(Math.random() * 3);

        boxes[8].position = new BABYLON.Vector3(horizontal_Box, altura_Box, vertical_Box);
        var materialWood = new BABYLON.StandardMaterial("wood", scene_Mundo);
        materialWood.diffuseTexture = new BABYLON.Texture("textures/background/background_12.jpg", scene_Mundo);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boxes[8].material = materialWood;
        shadow.addShadowCaster(boxes[4]);

        // Box limite da parte traseira
        horizontal_Background_Box = 0;
        altura_Background_Box = 3.5;
        vertical_Background_Box = -20;

        boxes[9].position = new BABYLON.Vector3(horizontal_Background_Box, altura_Background_Box, vertical_Background_Box);
        var materialWood = new BABYLON.StandardMaterial("wood", scene_Mundo);
        materialWood.diffuseTexture = new BABYLON.Texture("textures/tarefa01.jpg", scene_Mundo);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boxes[9].material = materialWood;
        shadow.addShadowCaster(boxes[5]);

        // Box limite da parte dianteira
        horizontal_Front_Box = 0;
        altura_Front_Box = 3.5;
        vertical_Front_Box = 20;

        boxes[10].position = new BABYLON.Vector3(horizontal_Front_Box, altura_Front_Box, vertical_Front_Box);
        var materialWood = new BABYLON.StandardMaterial("wood", scene_Mundo);
        materialWood.diffuseTexture = new BABYLON.Texture("textures/logoNitlab.png", scene_Mundo);
        materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        boxes[10].material = materialWood;
        shadow.addShadowCaster(boxes[6]);
    }
};

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

    // BOTÃO: Câmera
    var Button_Camera = BABYLON.GUI.Button.CreateSimpleButton("butCam", "Camera");
    Button_Camera.paddingTop = "10px";
    Button_Camera.width = "100px";
    Button_Camera.height = "50px";
    Button_Camera.color = "white";
    Button_Camera.background = "black";

    var camera_Off = true;
    Button_Camera.onPointerDownObservable.add(() => {
        if (Button_Camera) {
            // if (camera_Off) {
                cameraPlayer.start();
                console.log("ligou CÂMERA");
                // camera_Off = false;
            // }
            // if (!camera_Off) {
            //     cameraPlayer.stop();
            //     console.log("Desligou CÂMERA");
            //     camera_Off = true;
            // }
            Button_Camera = 0;
        }
    });
    UiPanel.addControl(Button_Camera);

    return UiPanel;
}

function createGround(scene_Mundo, tamanho, cor, position) {
    var ground = BABYLON.MeshBuilder.CreateGround("ground", tamanho, scene_Mundo);

    // Atribui uma grade ao material
   //  var ground_Material = new BABYLON.GridMaterial("groundMat");

    // Atribui um material padrão
    var ground_Material = new BABYLON.StandardMaterial("groundMaterial");

    // Atribui uma cor ao chão                        
    ground_Material.diffuseColor = cor;
    ground.material = ground_Material;

   // ground.receiveShadows = true;
    ground.material.backFaceCulling = false; // Se true oculta a face de baixo do ground

    // Posição do chão                    
    ground.position = position;

    // Adiciona física ao chão (Gravidade, Colisão ?)
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: .6 } // Massa >= 1 (objeto cai)
    );

    return ground;
}

function createCamera(scene_Mundo) {
    // Camera em 3ª pessoa
    //---> Age como um satélite em órbita ao redor de um alvo e sempre aponta para a posição do alvo.
    var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / -2, Math.PI / 2, 3.5, new BABYLON.Vector3(0, 2, -143), scene_Mundo);

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

//Refatorar para passar o objeto como parâmetro
function control_Player(scene_Mundo) {
    BABYLON.SceneLoader.ImportMesh("", "", "Itens/retangulo/retangulo.babylon", scene_Mundo, function (mesh_Objeto, particleSystems) {
        var mesh_Objeto = mesh_Objeto[0];
        //var mesh_Objeto = mesh_ambiente;
        //mesh_Objeto.scaling = new BABYLON.Vector3(2, 2, 2);        
        mesh_Objeto.position = new BABYLON.Vector3(2, 4, -8);
        var t = 0;
        var j = 0;
        var novoValor = 0;
        pegar = function (p) {
            j = p;
        };
        scene_Mundo.beforeRender = function () {
            t += .1;
            if (j != 0) {
                mesh_Objeto.rotation = new BABYLON.Vector3(0, 0, j[4].x * (5));
                //testar mover o céu, chão, caixas, gibante, herói, portal...
            }

        };
    });
}

//-----------------Início do MediaPipe---------------------------------

const videoInput = document.getElementsByClassName('input_video')[0];
const canvasOutput = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasOutput.getContext('3d');

function onResults(results) {
    // canvasCtx.save();
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {

            // Pega os pontos
            pegarPontos(landmarks);
            ponto = landmarks;

            // Desenha os contornos
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
            drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
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


// cameraPlayer.start();

//  function pegarPontos(pontos) {
//      window.pegar(pontos);
// }
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