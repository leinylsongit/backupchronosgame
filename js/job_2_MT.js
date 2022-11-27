var canvas = document.getElementById("canvasPrimario");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var job_1PT2 = null;
var sceneToRender = null;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();

var hdrTexture;
var directionalLight;

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

//Inicio da tarefa---------------------------------------------------------------------------------
var create_Tarefa = function () {
    // Cria a Cena
    job_1PT2 = new BABYLON.Scene(engine);

    job_1PT2.clearColor = new BABYLON.Color4(24/255, 0, 74/255, 1);

    // Cria a câmera
    var camera = new BABYLON.ArcRotateCamera("cam", 0, 0.7, 300, BABYLON.Vector3.Zero());
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.9; // Bloqueia o giro para cima
    
    var anchor = new BABYLON.TransformNode("");
    var light = new BABYLON.HemisphericLight("sun", new BABYLON.Vector3(0,1,0), job_1PT2);
    // light.intensity = 0.7;
    var index = 0;
   
    var pushButtonSound, sphereButtonSound; 

    createSkyboxAndLight();

    camera.wheelDeltaPercentage = 0.01; // Controle do Scrool do mouse (PROFUNDIDADE)
    // camera.minZ = 0.01;
    camera.attachControl(canvas, true);

    // Criando Interface 3D
    var manager = new BABYLON.GUI.GUI3DManager(job_1PT2);
    // manager.useRealisticScaling = true;// Coloca tudo numa escala real (enorme!)

    // Adiciona um cilindro onde ficarão os elementos
    var panelCylinder = new BABYLON.GUI.CylinderPanel();
    panelCylinder.margin = 0.3; // Espaçamento entre as esferas
    manager.addControl(panelCylinder);
    panelCylinder.linkToTransformNode(anchor); // #?
    panelCylinder.position.z = 0;

    // Adiciona Um pouco de brilho
    var gl = new BABYLON.GlowLayer("glow", job_1PT2, {
        mainTextureFixedSize: 512
    });
    gl.isEnabled = false; // # Testar após adicionar uma textura nas esferas!!

    // Adiciona um botão
    var pushButton_1; // Ação 01
    var pushButton_2; // Ação 02
    var qtd_Elementos = 4;

    // # Usar uma cor ao invés de textura!!!!
    BABYLON.SceneLoader.ImportMesh("", "https://david.blob.core.windows.net/babylonjs/MRTK/", "pushButton.glb", job_1PT2, function (newMeshes) {
        pushButton_1 = newMeshes[0];
        makePushButton(pushButton_1);        
            pushButtonSound = new BABYLON.Sound("pushButtonSound", "assets/sounds/effects/pushButtonSound.wav", job_1PT2, function() {
            pushButtonSound.attachToMesh(pushButton_1);
        });

        // pushButton_2 = newMeshes[0];
        // makePushButton(pushButton_2);        
        //     pushButtonSound = new BABYLON.Sound("pushButtonSound", "assets/sounds/effects/pushButtonSound.wav", job_1PT2, function() {
        //     pushButtonSound.attachToMesh(pushButton_2);

        //     // pushButton_2.position = new BABYLON.Vector3(20,20,200);
        // });

        sphereButtonSound = new BABYLON.Sound("sphereButtonSound", "assets/sounds/effects/sphereButtonSound.mp3", job_1PT2, function() {
            addSomeSpheres(qtd_Elementos);
        });
        var arhelper = job_1PT2.createDefaultARExperience();
        arhelper.enableInteractions();
    });

    // // Botão para adicionar mais elemento
    // var button = new BABYLON.GUI.HolographicButton("addMore");
    // button.text = "Adicionar Elementos";
    // // button.position.y = -30;
    // button.scaling = new BABYLON.Vector3(10, 10, 10);
    // button.onPointerDownObservable.add(() => {
    //     addSomeSpheres(qtd_Elementos+1);
    // });
    // manager.addControl(button);
    





    // HUD (Heads-Up Display)>>>------------------------------------------------------------------------->
//     var clicks = 0;

//     var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");
//     gui.renderScale = 1;

//     // 1. Barra superior
//     var panel = new BABYLON.GUI.StackPanel();
//     panel.isVertical = false;
//     // panel.background = "green"; // # Tentar colocar uma transparência na cor
//     // panel.background = "transparent";
//     panel.horizontalAlignment = 1;
//     panel.verticalAlignment = 0;
//     panel.width = "100%";
//     panel.height = "60px";
//     gui.addControl(panel);

//     // 1.1 Barra inferior
//     var panel = new BABYLON.GUI.StackPanel();
//     panel.isVertical = false;
//     // panel.background = "yellow"; // # Tentar colocar uma transparência na cor
//     panel.horizontalAlignment = 0;
//     panel.verticalAlignment = 1;
//     panel.width = "100%";
//     panel.height = "60px";
//     gui.addControl(panel);
    
//     // 2. Pontuação e tentativas
//     var textblockStatus = new BABYLON.GUI.TextBlock();
//     textblockStatus.text = "Pontuação: 0\n Tentativas restantes: 1/3"; //add a variável da tentativa 1/3, 2/3...
//     textblockStatus.fontSize = 20;
//     textblockStatus.fontFamily = "Segoe UI"
//     textblockStatus.height = "60px";
//     textblockStatus.width = "30%";
//     textblockStatus.top = 0;
//     textblockStatus.color = "white";
//     textblockStatus.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
//     textblockStatus.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
//     gui.addControl(textblockStatus);

//     // 3. Botão Start
//     var Button_Start = BABYLON.GUI.Button.CreateSimpleButton("butStart", ">> COMEÇAR <<");
//     Button_Start.width = "400px";
//     // Button_Start.width = "30%";
//     Button_Start.height = "65px";
//     Button_Start.color = "white";
//     Button_Start.fontSize = 30;
//     Button_Start.fontFamily = "Segoe UI"
//     Button_Start.cornerRadius = 20;
//     Button_Start.background = "green";
//     Button_Start.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

//     Button_Start.onPointerUpObservable.add(function () {
//         reconheceFala();
//         Button_Start.children[0].text = ">> COMEÇAR <<";
//         console.log('Aguardando resposta...');

//         clicks++;

//         textblockStatus.text = "Pontuação: " + clicks + "\n Tentativas restantes: 2/3"; // # add a variavel aqui

//         Button_Start.isEnabled = false;
//         Button_Start.children[0].text = "Memorize os " + qtd_sorteados + " elementos!";
//         console.log("Memorize os " + qtd_sorteados + " elementos!");
//     });
//     gui.addControl(Button_Start);

//     // 4. Nível da tarefa
//     var textblockNivel = new BABYLON.GUI.TextBlock();
//     textblockNivel.text = "Tarefa: 01 - MT - FÁCIL - LENTA\n Aspecto Observado: capacidade de memorização de curto prazo";
//     textblockNivel.fontSize = 15;
//     textblockNivel.height = "60px";
//     textblockNivel.width = "30%";
//     textblockNivel.top = 0;
//     textblockNivel.right = 0;
//     textblockNivel.color = "white";
//     textblockNivel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
//     textblockNivel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
//     gui.addControl(textblockNivel);

//     // 5. Local da Resposta
//     var textblockResposta = new BABYLON.GUI.TextBlock();
//     textblockResposta.text = ">> SUA RESPOSTA <<";
//     textblockResposta.fontSize = 40;
//     textblockResposta.fontFamily = "Segoe UI"
//     textblockResposta.height = "60px";
//     textblockResposta.top = "0px";
//     textblockResposta.color = "white";
//     textblockResposta.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
//     textblockResposta.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
//     gui.addControl(textblockResposta);

//     // 5. Regras da tarefa
//     var textblockRegras = new BABYLON.GUI.TextBlock();
//     textblockRegras.text = "1. Click no botão [COMEÇAR]\n 2. MEMORIZE os elementos que aparecerem\n 3. FALE os elementos que conseguir lembrar\n";
//     textblockRegras.fontSize = 30;
//     textblockRegras.fontFamily = "Segoe UI"
//     textblockRegras.height = "150px";
//     textblockRegras.top = "80px";
//     textblockRegras.color = "Yellow";
//     // textblockRegras.background = "black";
//     textblockRegras.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
//     textblockRegras.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
//     gui.addControl(textblockRegras);

//     // 6. Botão Menu
//     // var Button_Menu = BABYLON.GUI.Button.CreateSimpleButton("butMenu", "MENU");
//     // Button_Menu.paddingTop = "10px";
//     // Button_Menu.width = "100px";
//     // Button_Menu.height = "50px";
//     // Button_Menu.color = "white";
//     // Button_Menu.fontSize = 30;
//     // Button_Menu.fontFamily = "Segoe UI"
//     // Button_Menu.cornerRadius = 20;
//     // Button_Menu.background = "green";
//     // Button_Menu.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

//     // Button_Menu.onPointerDownObservable.add(() => {
//     //     Button_Menu.children[0].text = "Menuuu";
//     //     console.log('Voltando para o Menu...');

//     //     Button_Menu.isEnabled = false;
//     //     Button_Menu.children[0].text = "Voltei pro menuuuuuuuuuuuuuu!";

//     //     if (Button_Menu) {
//     //         document.write("<canvas id='canvasPrimario' width='1520' height='840'></canvas><script src='js/mundoExploratorio.js'></script>");
//     //         console.log("apertou MENU");
//     //         Button_Menu = 0;
//     //     }
//     // });

//     // gui.addControl(Button_Menu);

//     // HUD (Heads-Up Display) <-------------------------------------------------------------------------<<<

    // Cria o plano do chão
    var ground = BABYLON.Mesh.CreateGround("ground",50,50, 5, job_1PT2);
    ground.position.y = -7;

    // Cria a textura do chão
    var grade = new BABYLON.GridMaterial("grade", job_1PT2);
    grade.gridRatio = 1;
    grade.lineColor = new BABYLON.Color3.FromInts(42, 87, 154);
    grade.mainColor = new BABYLON.Color3.FromInts(230,230, 230);
    grade.majorUnitFrequency = 10;
    ground.material = grade;

    //ground.visibility = false; //Oculta o elemento

    // Cria uma repetição do material utilizado na textura da parede de fundo
    var texturaNitLab = new BABYLON.StandardMaterial("nitlab", job_1PT2);
    texturaNitLab.diffuseTexture = new BABYLON.Texture("assets/skybox/nitlab.png", job_1PT2);
    // texturaNitLab.diffuseTexture.uScale = 2.0;//Repeat 2 times on the Vertical Axes
    // texturaNitLab.diffuseTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
    texturaNitLab.backFaceCulling = false;//Always show the front and the back of an element
  //  ground.material = texturaNitLab;
    

    // Girar o cenário rapidamente e dá um zoom na tarefa
    zoomIn(camera,ground);
    // zoomOut(camera,ground);


//     // Determinar a posição de forma randômica
    var positions_Sorteadas = []; // Vetor da posições sorteadas
    var qtd_sorteados = qtd_Elementos-2; // Variar o tempo e a quantidade de acordo com o nível (1, 2 ou 3)
//     var tempo = 2000;

    numero_aleatorio(qtd_Elementos);

    
//     // Destaca os elementos sorteados
//     destacar();

//     // // Aguarda um tempo
//     // sleep1(tempo);

//     // for (var i = 0; i < qtd_sorteados; i++) {
//        // spheres[positions_Sorteadas[i]].isVisible = false;

//     //    createButtons(nearMenu, sphere, positions_Sorteadas);
//     // }
    

//     // Reverter para aspecto original
//    // reverter();


//     // Verifica se clicou nos itens corretos
//     //   console.time('Tempo utilizado: ');

//     //...

//     // console.timeEnd('Tempo utilizado --> ');


//     console.log('Posições sorteadas: ', positions_Sorteadas);
//     //console.log('Posições selecionadas: ', positions_Selecionadas);





    // Mensagem explicando a tarefa por meio de síntese








    return job_1PT2;

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
        var pushButton = new BABYLON.GUI.MeshButton3D(mesh, "Botão da ação " + index);
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
            console.log("Pressionou " + pushButton.name);
            if (pushButtonSound && pushButtonSound.isReady) {
                pushButtonSound.play();
                addSomeSpheres(qtd_Elementos);
            }
        });
        panelCylinder.addControl(pushButton);
        index++;
    }

    // Constrói as esferas metálicas
    function makeMetalSphereButtom(mesh) {
        var sphereButton = new BABYLON.GUI.MeshButton3D(mesh, "Esfera " + index);
        
        sphereButton.customIndex = index;

        var sphereSound = sphereButtonSound.clone();
        sphereSound.attachToMesh(mesh);

        sphereButton.pointerEnterAnimation = () => {
            sphereButton.mesh.material.emissiveColor = new BABYLON.Color3(0.32, 0.5, 0.25);
            gl.addIncludedOnlyMesh(sphereButton.mesh);
            gl.isEnabled = true;
        };

        sphereButton.pointerOutAnimation = () => {
            sphereButton.mesh.material.emissiveColor = new BABYLON.Color3(0,0,0);
            gl.removeIncludedOnlyMesh(sphereButton.mesh);
            gl.isEnabled = false;
        };
        
        sphereButton.onPointerDownObservable.add(() => {
            console.log("Pressionou " + sphereButton.name);
            if (sphereSound && sphereSound.isReady) {
                sphereSound.setPlaybackRate(1 + sphereButton.customIndex / 8);
                sphereSound.play();
            }
        });

        // Obtém e exibe no console a posição nas coordenadas do mouse enquanto ele se move sobre uma esfera
        sphereButton.onPointerMoveObservable.add((eventData, eventState) => {
            console.log(eventData.toString());
        });

        panelCylinder.addControl(sphereButton);
        index++;
    }


    // Adiciona esferas de acordo com a quantidade solicitada
    function addSomeSpheres(qtd_Elementos){
        panelCylinder.blockLayout = true;
        for (var i=0; i<qtd_Elementos; i++){
            
            // Esfera                                                  Tamanho
            var sphere = BABYLON.Mesh.CreateSphere("Sphere" + index, 36, 1, job_1PT2);
            
            // Hexágono
            //var sphere = BABYLON.Mesh.CreateSphere("Sphere" + index, 1, 1, job_1PT2);

            var metal = new BABYLON.PBRMaterial("metal", job_1PT2);
            metal.reflectionTexture = hdrTexture;
            
            metal.microSurface = 0.96; // Altera a intensidade do metal, mais claro/escuro
            
            metal.reflectivityColor = new BABYLON.Color3(0.85, 0.85, 0.85);
            metal.albedoColor = new BABYLON.Color3(0.01, 0.01, 0.01);
            metal.emissiveColor = new BABYLON.Color3(0,0,0);

            sphere.material = metal;
            makeMetalSphereButtom(sphere);
        }
        panelCylinder.blockLayout = false;
    }


    // Cria a luz e a atmosfera
    function createSkyboxAndLight() {
        // Define a general environment texture
        hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/textures/environment.dds", job_1PT2);
        job_1PT2.environmentTexture = hdrTexture;

        // Let's create a color curve to play with background color
        var curve = new BABYLON.ColorCurves();
        curve.globalHue = 10;
        curve.globalDensity = 10;

        var box = job_1PT2.createDefaultSkybox(hdrTexture, true, 200, 0.7);
        box.infiniteDistance = false;
        box.material.imageProcessingConfiguration = new BABYLON.ImageProcessingConfiguration();
        box.material.cameraColorCurvesEnabled = true;
        box.material.cameraColorCurves = curve;
        box.name = "MYMESHFORSKYBOX";
        box.isPickable = false;

        directionalLight = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(-0.2, -1, 0), job_1PT2)
        directionalLight.position = new BABYLON.Vector3(100 * 0.2, 100 * 2, 0)
        directionalLight.intensity = 4.5;





        // Cria a ATMOSFERA # TROCAR POR UM CÉU NOTURNO
    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, job_1PT2, undefined, BABYLON.Mesh.BACKSIDE);
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", job_1PT2);
    // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/TropicalSunnyDay", job_1MT1);
    backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/Cerebro", job_1PT2);
    // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/Cere", job_1MT1);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;







    }
   
    // Sorteia posições aleatoriamente
    function numero_aleatorio(qtd_Elementos) {
        while (positions_Sorteadas.length < qtd_sorteados) {
            var aleatorio = Math.floor(Math.random() * qtd_Elementos); // usar este!!!
            // var aleatorio = Math.floor(Math.random() * 5);

            if (positions_Sorteadas.indexOf(aleatorio) == -1)
                positions_Sorteadas.push(aleatorio);
        }
        console.log("Posições sorteadas: ", positions_Sorteadas)
    }

    function destacar() {
        for (var i = 0; i < qtd_sorteados; i++) {
            light0.excludedMeshes.push(spheres[positions_Sorteadas[i]]);
            light1.includedOnlyMeshes.push(spheres[positions_Sorteadas[i]]);
            // spheres[positions_Sorteadas[i]].isVisible = false;
        }

        // Outra possibilidade:  girar as esferas sorteadas, cada esfera tem um lado branco e outro preto
    }

    function reverter() { // reverter ao estado original aquelas que foram destacados!
        for (var i = 0; i < 20; i++) {
            spheres[i] = sphere.clone("sphere" + i);

            // depois atualizar para gerar na posição exata inicial
            spheres[i].position.x = -2.1 + i % 5;
            spheres[i].position.y = 2.1 - Math.floor(i / 5);
        }

        // for (var i = 0; i < qtd_sorteados; i++) {
        //     spheres[positions_Sorteadas[i]].isVisible = true;
        // }
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
            textblockResposta.text = elemento.toUpperCase();       
        };
    
        // Finaliza o reconhecimento
        recognition.onspeechend = function () {
            recognition.stop();
            console.log("Reconhecimento finalizado.");
            Button_Start.isEnabled = true;
            Button_Start.children[0].text = ">> COMEÇAR <<";
            textblockResposta.text = ">> SUA RESPOSTA <<";
        };
    
        // Caso o que reconheça bata com os elementos sorteados
        recognition.onmatch = function () {
            // # incrementar a pontuação

            
            textblockResposta.text = "Parabéns!";     
            // # add síntese de voz
            // # add alerta sonoro 
            console.log("Muito bem! Você conseguiu!!");
            Button_Start.children[0].text = elemento.toUpperCase();
        };


        // Caso não reconheça o que foi pronunciado
        recognition.onnomatch = function () {
            textblockResposta.text = "Palavra desconhecida!";     
            // # add síntese de voz
            // # add alerta sonoro 
            console.log("Não reconheci essa palavra.");
            Button_Start.children[0].text = "Tentar novamente!";
        };
    
        recognition.onerror = function (event) {
            console.log("Ocorreu um erro no reconhecimento: " + event.error);
            Button_Start.isEnabled = true;
            Button_Start.children[0].text = "Tentar novamente!";
            textblockResposta.text = ">> SUA RESPOSTA <<";
        };
        return recognition;
    }
};//Fim da tarefa <-----------------------------------------------------------------------<<<

//-----------------Início do MediaPipe---------------------------------

const videoInput = document.getElementsByClassName('input_video')[0];
const canvasOutput = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasOutput.getContext('3d');

// function onResults(results) {
//     // canvasCtx.save();
//     if (results.multiHandLandmarks) {
//         for (const landmarks of results.multiHandLandmarks) {

//             // Pega os pontos
//             pegarPontos(landmarks);
//             ponto = landmarks;

//             // Desenha os contornos
//             drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
//             drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
//         }
//     }
//     // canvasCtx.restore();
// }
// const hand = new Hands({
//     locateFile: (file) => {
//         return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
//     }
// });

// hand.setOptions({
//     selfieMode: true,
//     maxNumHands: 1,
//     modelComplexity: 1,
//     minDetectionConfidence: 0.5,
//     minTrackingConfidence: 0.5,
// });

// hand.onResults(onResults);

// const cameraPlayer = new Camera(videoInput, {
//     onFrame: async () => {
//         await hand.send({ image: videoInput });
//     },
//     width: 800,
//     height: 420
// });


// cameraPlayer.start();

// function pegarPontos(pontos) {
//     window.pegar(pontos);
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
    window.scene = create_Tarefa();
};
initFunction().then(() => { sceneToRender = scene });

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});


