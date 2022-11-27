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

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

//Inicio da tarefa---------------------------------------------------------------------------------
var create_Tarefa = function () {
    // Cria a Cena
    var job_1MT1 = new BABYLON.Scene(engine);

    // Cria a câmera
   //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1.7, -0.3), job_1MT1);
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), job_1MT1);
   camera.wheelDeltaPercentage = 0.01; // Controle do Scrool do mouse (PROFUNDIDADE)
    camera.minZ = 0.01;
    camera.attachControl(canvas, true);

    var anchor = new BABYLON.TransformNode("");

   // var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), job_1MT1);
   // var light = new BABYLON.HemisphericLight("sun", new BABYLON.Vector3(0, 1, 0), job_1MT1);
   var light0 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), job_1MT1);
    light0.intensity = 0.7; 
    light0.diffuse = new BABYLON.Color3(0.19, 0.19, 0.19);
    light0.specular = new BABYLON.Color3(0.21, 0.2, 0.2);
    light0.groundColor = new BABYLON.Color3(0, 0, 0);
    
    var light1 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), job_1MT1);
    light1.diffuse = new BABYLON.Color3(1, 1, 1);
    light1.specular = new BABYLON.Color3(1, 1, 1);
    light1.groundColor = new BABYLON.Color3(0, 0, 0);

    // Cria a ATMOSFERA # TROCAR POR UM CÉU NOTURNO
    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, job_1MT1, undefined, BABYLON.Mesh.BACKSIDE);
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", job_1MT1);
    // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/TropicalSunnyDay", job_1MT1);
    // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/Cerebro", job_1MT1);
    backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/Cere", job_1MT1);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;
    
    var pushButtonSound, sphereButtonSound; 

    // Criando Interface 3D
    var manager = new BABYLON.GUI.GUI3DManager();

    // manager.useRealisticScaling = true;// nao varia tanto

    // HUD (Heads-Up Display)>>>------------------------------------------------------------------------->
    var clicks = 0;

    var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");
    gui.renderScale = 1;

    // 1. Barra superior
    var panel = new BABYLON.GUI.StackPanel();
    panel.isVertical = false;
    // panel.background = "green"; // # Tentar colocar uma transparência na cor
    // panel.background = "transparent";
    panel.horizontalAlignment = 1;
    panel.verticalAlignment = 0;
    panel.width = "100%";
    panel.height = "60px";
    gui.addControl(panel);

    // 1.1 Barra inferior
    var panel = new BABYLON.GUI.StackPanel();
    panel.isVertical = false;
    // panel.background = "yellow"; // # Tentar colocar uma transparência na cor
    panel.horizontalAlignment = 0;
    panel.verticalAlignment = 1;
    panel.width = "100%";
    panel.height = "60px";
    gui.addControl(panel);
    
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
    var Button_Start = BABYLON.GUI.Button.CreateSimpleButton("butStart", ">> COMEÇAR <<");
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
        reconheceFala();
        Button_Start.children[0].text = ">> COMEÇAR <<";
        console.log('Aguardando resposta...');

        clicks++;

        textblockStatus.text = "Pontuação: " + clicks + "\n Tentativas restantes: 2/3"; // # add a variavel aqui

        Button_Start.isEnabled = false;
        Button_Start.children[0].text = "Memorize os " + qtd_sorteados + " elementos!";
        console.log("Memorize os " + qtd_sorteados + " elementos!");
    });
    gui.addControl(Button_Start);

    // 4. Nível da tarefa
    var textblockNivel = new BABYLON.GUI.TextBlock();
    textblockNivel.text = "Tarefa: 01 - MT - FÁCIL - LENTA\n Aspecto Observado: capacidade de memorização de curto prazo";
    textblockNivel.fontSize = 15;
    textblockNivel.height = "60px";
    textblockNivel.width = "30%";
    textblockNivel.top = 0;
    textblockNivel.right = 0;
    textblockNivel.color = "white";
    textblockNivel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textblockNivel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    gui.addControl(textblockNivel);

    // 5. Local da Resposta
    var textblockResposta = new BABYLON.GUI.TextBlock();
    textblockResposta.text = ">> SUA RESPOSTA <<";
    textblockResposta.fontSize = 40;
    textblockResposta.fontFamily = "Segoe UI"
    textblockResposta.height = "60px";
    textblockResposta.top = "0px";
    textblockResposta.color = "white";
    textblockResposta.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textblockResposta.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    gui.addControl(textblockResposta);

    // 5. Regras da tarefa
    var textblockRegras = new BABYLON.GUI.TextBlock();
    textblockRegras.text = "1. Click no botão [COMEÇAR]\n 2. MEMORIZE os elementos que aparecerem\n 3. FALE os elementos que conseguir lembrar\n";
    textblockRegras.fontSize = 30;
    textblockRegras.fontFamily = "Segoe UI"
    textblockRegras.height = "150px";
    textblockRegras.top = "80px";
    textblockRegras.color = "Yellow";
    // textblockRegras.background = "black";
    textblockRegras.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textblockRegras.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    gui.addControl(textblockRegras);

    // 6. Botão Menu
    // var Button_Menu = BABYLON.GUI.Button.CreateSimpleButton("butMenu", "MENU");
    // Button_Menu.paddingTop = "10px";
    // Button_Menu.width = "100px";
    // Button_Menu.height = "50px";
    // Button_Menu.color = "white";
    // Button_Menu.fontSize = 30;
    // Button_Menu.fontFamily = "Segoe UI"
    // Button_Menu.cornerRadius = 20;
    // Button_Menu.background = "green";
    // Button_Menu.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    // Button_Menu.onPointerDownObservable.add(() => {
    //     Button_Menu.children[0].text = "Menuuu";
    //     console.log('Voltando para o Menu...');

    //     Button_Menu.isEnabled = false;
    //     Button_Menu.children[0].text = "Voltei pro menuuuuuuuuuuuuuu!";

    //     if (Button_Menu) {
    //         document.write("<canvas id='canvasPrimario' width='1520' height='840'></canvas><script src='js/mundoExploratorio.js'></script>");
    //         console.log("apertou MENU");
    //         Button_Menu = 0;
    //     }
    // });

    // gui.addControl(Button_Menu);

    // HUD (Heads-Up Display) <-------------------------------------------------------------------------<<<


     // Girar o cenário rapidamente por 2 segundos e parar
    //... Usar o efeito ZOOM



    //Cria o plano do chão
    var ground = BABYLON.Mesh.CreatePlane("plane", 300, job_1MT1);
    ground.position.y = -10;
    ground.rotation.x = Math.PI / 2;

    //Creation of a repeated textured material
    var materialGround = new BABYLON.StandardMaterial("texturePlane", job_1MT1);
    materialGround.diffuseTexture = new BABYLON.Texture("textures/ground/logoNitlab.png", job_1MT1);
    // materialGround.diffuseTexture.uScale = 2.0;//Repeat 5 times on the Vertical Axes
    // materialGround.diffuseTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
    materialGround.backFaceCulling = false;//Always show the front and the back of an element
    ground.material = materialGround;


    // Cria a esfera inicial
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.1, segments: 32}, job_1MT1);
    // sphere.position = new BABYLON.Vector3(0, 1.7, 0.5);

    // Atribui material a esfera
    var mat = new BABYLON.StandardMaterial("mat", job_1MT1);
    sphere.material = mat;

    var spheres = [];
    var qtd_Elementos = 20; // Variar a quantidade de acordo com o nível (1, 2 ou 3)
    for (var i = 0; i < qtd_Elementos; i++) {
        spheres[i] = sphere.clone("sphere" + i);
        spheres[i].position.x = -2 + i % 5;
        spheres[i].position.y = 2 - Math.floor(i / 5);

        // Adicionar rótulos em cada esfera criada
        //...


    }
   
    // Cria um Menu próximo que irá seguir o alvo
    var nearMenu = new BABYLON.GUI.NearMenu("NearMenu");
    nearMenu.rows = 2;
    manager.addControl(nearMenu);
    nearMenu.isPinned = false;
    nearMenu.position.y = 1.61;
    nearMenu.scaling = new BABYLON.Vector3(0.03, 0.03, 0.1);

    // Determinar a posição de forma randômica
    var positions_Sorteadas = []; // Vetor da posições sorteadas
    var qtd_sorteados = 3; // Variar o tempo e a quantidade de acordo com o nível (1, 2 ou 3)
    var tempo = 2000;

    numero_aleatorio(qtd_Elementos);

    
    // Destaca os elementos sorteados
    destacar();

    // // Aguarda um tempo
    // sleep1(tempo);

    // for (var i = 0; i < qtd_sorteados; i++) {
       // spheres[positions_Sorteadas[i]].isVisible = false;

    //    createButtons(nearMenu, sphere, positions_Sorteadas);
    // }
    

    // Reverter para aspecto original
   // reverter();


    // Verifica se clicou nos itens corretos
    //   console.time('Tempo utilizado: ');

    //...

    // console.timeEnd('Tempo utilizado --> ');


    console.log('Posições sorteadas: ', positions_Sorteadas);
    //console.log('Posições selecionadas: ', positions_Selecionadas);



    // materialSphere6 = new BABYLON.StandardMaterial("texture6", job_1MT1);
    // materialSphere6.diffuseColor = new BABYLON.Color3(1, 0, 0);
    // materialSphere6.diffuseTexture = new BABYLON.Texture("textures/tree.png", job_1MT1);
    // materialSphere6.diffuseTexture.hasAlpha = true;//Have an alpha
    // materialSphere6.backFaceCulling = false;

    

    let qtdButton = 6; //quantidade de acordo com o nível (1, 2 ou 3)
    var index;
   for (index = 0; index < qtdButton; index++) {
        //createButtons(nearMenu, sphere, index, positions_Sorteadas);
        // if (index in positions_Sorteadas){
            //button.isVisible = false;
            createButtons(nearMenu, sphere, index, positions_Sorteadas);
            //setTimeout(console.log("oi"), 2000);
        // }

   }   

    return job_1MT1;

    // Constrói um painel com os botões
     function createButtons(menu, target, id, positions_Sorteadas) {
        
        var button = new BABYLON.GUI.TouchHolographicButton();    
        // var button = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click Me");
        
        //button.background = "green";
        button.text = id;  
        menu.addButton(button);
        
        // Adicionar rótulos em cada esfera criada
            //...
    
        // Ao clicar no botão
        button.onPointerDownObservable.add(()=>{
            target.material.diffuseColor = BABYLON.Color3.Green()
            // button.text = "";
            //button.isPinned = true;
            //button.isEnabled = true;


        });
        
         // Fazer aparecer somente os botões das posições sorteadas
        if (id in positions_Sorteadas){
            //button.isVisible = false;
            button.text = positions_Sorteadas[id];
          //  button.text = "";

          //button.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());

        //   button.children[0].text = "Iniciar!";

        //   button1.pointerDownAnimation = function() {
            // button.background = "red";
            //button.color = "white";
            // this.Remove();
     
        //  }

        }    
    };

    // Sorteia posições aleatoriamente
    function numero_aleatorio(qtd_Elementos) {
        while (positions_Sorteadas.length < qtd_sorteados) {
            //var aleatorio = Math.floor(Math.random() * qtd_Elementos); // usar este!!!
            var aleatorio = Math.floor(Math.random() * 5);

            if (positions_Sorteadas.indexOf(aleatorio) == -1)
                positions_Sorteadas.push(aleatorio);
        }
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

// const videoInput = document.getElementsByClassName('input_video')[0];
// const canvasOutput = document.getElementsByClassName('output_canvas')[0];
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


