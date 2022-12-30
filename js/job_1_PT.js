var canvas = document.getElementById("canvasPrimario");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var job_2PT = null;
var sceneToRender = null;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();

var hdrTexture;
var directionalLight;

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

//Inicio da tarefa---------------------------------------------------------------------------------
var create_Tarefa = function () {
    // Cria a Cena
    job_2PT = new BABYLON.Scene(engine);

    //job_1PT2.clearColor = new BABYLON.Color4(24/255, 0, 74/255, 1);

    // Cria a câmera
    var camera = new BABYLON.ArcRotateCamera("cam", 0, 0.7, 300, BABYLON.Vector3.Zero());
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.9; // Bloqueia o giro para cima
    
    var anchor = new BABYLON.TransformNode("");
    var light = new BABYLON.HemisphericLight("sun", new BABYLON.Vector3(0,1,0), job_2PT);
    // light.intensity = 0.7;
    var index = 0;
   
    var pushButtonSound, sphereButtonSound; 

    createSkyboxAndLight();

    camera.wheelDeltaPercentage = 0.01; // Controle do Scrool do mouse (PROFUNDIDADE)
    // camera.minZ = 0.01;
    camera.attachControl(canvas, true);

    // Criando Interface 3D
    var manager = new BABYLON.GUI.GUI3DManager(job_2PT);
    // manager.useRealisticScaling = true;// Coloca tudo numa escala real (enorme!)


    var panelCylinder = new BABYLON.GUI.CylinderPanel();
    panelCylinder.margin = 0.3;
 
    manager.addControl(panelCylinder);
    panelCylinder.linkToTransformNode(anchor);
    panelCylinder.position.z = 0;



    // Um pouco de brilho
    var gl = new BABYLON.GlowLayer("glow", job_2PT, {
        mainTextureFixedSize: 512
    });
    gl.isEnabled = false;

    // Adiciona um botão
    var pushButton;
    var qtd_Elementos = 9;

    // # Usar uma cor ao invés de textura!!!!
    BABYLON.SceneLoader.ImportMesh("", "https://david.blob.core.windows.net/babylonjs/MRTK/", "pushButton.glb", job_2PT, function (newMeshes) {
        pushButton = newMeshes[0];
        makePushButton(pushButton);        
            pushButtonSound = new BABYLON.Sound("pushButtonSound", "assets/sound/effects/pushButtonSound.wav", job_2PT, function() {
            pushButtonSound.attachToMesh(pushButton);
        });
        sphereButtonSound = new BABYLON.Sound("sphereButtonSound", "audios/sound/effects/sphereButtonSound.mp3", job_2PT, function() {
            addSomeSpheres(qtd_Elementos);
        });
        var arhelper = job_2PT.createDefaultARExperience();
        arhelper.enableInteractions();
    });

   
  //  manager.addControl(button);
    





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
    var ground = BABYLON.Mesh.CreateGround("ground",50,50, 5, job_2PT);
    ground.position.y = -7;

    // Cria a textura do chão
    var grade = new BABYLON.GridMaterial("grade", job_2PT);
    grade.gridRatio = 1;
    grade.lineColor = new BABYLON.Color3.FromInts(42, 87, 154);
    grade.mainColor = new BABYLON.Color3.FromInts(230,230, 230);
    grade.majorUnitFrequency = 10;
    ground.material = grade;

    //ground.visibility = false; //Oculta o elemento

    // Cria uma repetição do material utilizado na textura da parede de fundo
    var texturaNitLab = new BABYLON.StandardMaterial("nitlab", job_2PT);
    texturaNitLab.diffuseTexture = new BABYLON.Texture("textures/ground/logoNitlab.png", job_2PT);
    // texturaNitLab.diffuseTexture.uScale = 2.0;//Repeat 2 times on the Vertical Axes
    // texturaNitLab.diffuseTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
    texturaNitLab.backFaceCulling = false;//Always show the front and the back of an element
  //  ground.material = texturaNitLab;
    

    // Girar o cenário rapidamente e dá um zoom na tarefa
    zoomIn(camera,ground);
    // zoomOut(camera,ground);


    //   console.time('Tempo utilizado: ');



    // console.timeEnd('Tempo utilizado --> ');


    // Mensagem explicando a tarefa por meio de síntese





















    return job_2PT;

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

    

    // Cria a luz e a atmosfera
    function createSkyboxAndLight() {
        // Define a general environment texture
        hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/textures/environment.dds", job_2PT);
        job_2PT.environmentTexture = hdrTexture;

        // Let's create a color curve to play with background color
        var curve = new BABYLON.ColorCurves();
        curve.globalHue = 10;
        curve.globalDensity = 10;

        var box = job_2PT.createDefaultSkybox(hdrTexture, true, 200, 0.7);
        box.infiniteDistance = false;
        box.material.imageProcessingConfiguration = new BABYLON.ImageProcessingConfiguration();
        box.material.cameraColorCurvesEnabled = true;
        box.material.cameraColorCurves = curve;
        box.name = "MYMESHFORSKYBOX";
        box.isPickable = false;

        directionalLight = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(-0.2, -1, 0), job_2PT)
        directionalLight.position = new BABYLON.Vector3(100 * 0.2, 100 * 2, 0)
        directionalLight.intensity = 4.5;





        // Cria a ATMOSFERA # TROCAR POR UM CÉU NOTURNO
    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, job_2PT, undefined, BABYLON.Mesh.BACKSIDE);
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", job_2PT);
    // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/TropicalSunnyDay", job_1MT1);
    backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/Cerebro", job_2PT);
    // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/Cere", job_1MT1);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;







    }
   
    // Sorteia posições aleatoriamente
    function numero_aleatorio(qtd_Elementos) {
        while (positions_Sorteadas.length < qtd_sorteados) {
            //var aleatorio = Math.floor(Math.random() * qtd_Elementos); // usar este!!!
            var aleatorio = Math.floor(Math.random() * 5);

            if (positions_Sorteadas.indexOf(aleatorio) == -1)
                positions_Sorteadas.push(aleatorio);
        }
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
// const canvasCtx = canvasOutput.getContext('3d');

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


