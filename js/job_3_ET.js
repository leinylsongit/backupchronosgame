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


var agents = [];

//Inicio da tarefa---------------------------------------------------------------------------------
var create_Tarefa = function () {
    // Cria a Cena
    job_2ET = new BABYLON.Scene(engine);

//     // Cria a câmera
//     var camera = new BABYLON.ArcRotateCamera("cam", 0, 0.7, 300, BABYLON.Vector3.Zero());
//     camera.lowerBetaLimit = 0.1;
//     camera.upperBetaLimit = (Math.PI / 2) * 0.9; // Bloqueia o giro para cima
    
//     var anchor = new BABYLON.TransformNode("");
//     var light = new BABYLON.HemisphericLight("sun", new BABYLON.Vector3(0,1,0), job_1ET2);
//     // light.intensity = 0.7;
//     var index = 0;
   
//     var pushButtonSound, sphereButtonSound; 

//     createSkyboxAndLight();

//     camera.wheelDeltaPercentage = 0.01; // Controle do Scrool do mouse (PROFUNDIDADE)
//     // camera.minZ = 0.01;
//     camera.attachControl(canvas, true);

//     // Criando Interface 3D
//     var manager = new BABYLON.GUI.GUI3DManager(job_1ET2);
//     // manager.useRealisticScaling = true;// Coloca tudo numa escala real (enorme!)


//     var panelCylinder = new BABYLON.GUI.CylinderPanel();
//     panelCylinder.margin = 0.3;
 
//     manager.addControl(panelCylinder);
//     panelCylinder.linkToTransformNode(anchor);
//     panelCylinder.position.z = 0;



//     // Um pouco de brilho
//     var gl = new BABYLON.GlowLayer("glow", job_1ET2, {
//         mainTextureFixedSize: 512
//     });
//     gl.isEnabled = false;



 let navigationPlugin = new BABYLON.RecastJSPlugin();





 var staticMesh = createStaticMesh(job_2ET);
 var navmeshParameters = {
     cs: 0.2,
     ch: 0.2,
     walkableSlopeAngle: 90,
     walkableHeight: 1.0,
     walkableClimb: 1,
     walkableRadius: 1,
     maxEdgeLen: 12.,
     maxSimplificationError: 1.3,
     minRegionArea: 8,
     mergeRegionArea: 20,
     maxVertsPerPoly: 6,
     detailSampleDist: 6,
     detailSampleMaxError: 1,
     };


    

    //# EXTRAIR FUNÇÃO DO HUD ABAIXO
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

//     // Cria o plano do chão
//     var ground = BABYLON.Mesh.CreateGround("ground",50,50, 5, job_1ET2);
//     ground.position.y = -7;

//     // Cria a textura do chão
//     var grade = new BABYLON.GridMaterial("grade", job_1ET2);
//     grade.gridRatio = 1;
//     grade.lineColor = new BABYLON.Color3.FromInts(42, 87, 154);
//     grade.mainColor = new BABYLON.Color3.FromInts(230,230, 230);
//     grade.majorUnitFrequency = 10;
//     ground.material = grade;

//     //ground.visibility = false; //Oculta o elemento

//     // Cria uma repetição do material utilizado na textura da parede de fundo
//     var texturaNitLab = new BABYLON.StandardMaterial("nitlab", job_1ET2);
//     texturaNitLab.diffuseTexture = new BABYLON.Texture("textures/ground/logoNitlab.png", job_1ET2);
//     // texturaNitLab.diffuseTexture.uScale = 2.0;//Repeat 2 times on the Vertical Axes
//     // texturaNitLab.diffuseTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
//     texturaNitLab.backFaceCulling = false;//Always show the front and the back of an element
//   //  ground.material = texturaNitLab;
    

//     // Girar o cenário rapidamente e dá um zoom na tarefa
//     zoomIn(camera,ground);
    // zoomOut(camera,ground);


//     //   console.time('Tempo utilizado: ');


//     // console.timeEnd('Tempo utilizado --> ');



    // Mensagem explicando a tarefa por meio de síntese



    // job_1RT2.clearColor = new BABYLON.Color4(24/255, 0, 74/255, 1);
    job_2ET.clearColor = new BABYLON.Color4(1, 0, 1, 1);
    
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), job_2ET);
    
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 100, new BABYLON.Vector3(0, 0, 0), job_2ET);
        camera.setPosition(new BABYLON.Vector3(20, 100, 100));
    
        camera.maxZ = 20000;
    
        camera.lowerRadiusLimit = 50;
        camera.attachControl(canvas, true);
    
    
        // camera 1
        var camera1 = new BABYLON.ArcRotateCamera("camera1",  3 * Math.PI / 8, 3 * Math.PI / 8, 15, new BABYLON.Vector3(0, 2, 0), job_2ET);
        camera1.attachControl(canvas, true);
        job_2ET.getCameraByID("camera1").alpha = 1.4233160050013756;
    job_2ET.getCameraByID("camera1").beta = 1.77290545417584;
    job_2ET.activeCameras.push(camera1);
    job_2ET.activeCameras.push(camera);
    
    camera.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 1.0);
    camera1.viewport = new BABYLON.Viewport(0, 0, 0.5, 1.0);
    
  //  job_1ET2.clearColor = new BABYLON.Color4(0, 0, 0,1);
  


 

  navigationPlugin.createNavMesh([staticMesh], navmeshParameters);
  var navmeshdebug = navigationPlugin.createDebugNavMesh(job_2ET);
  navmeshdebug.position = new BABYLON.Vector3(0, 0.01, 0);

  var matdebug = new BABYLON.StandardMaterial('matdebug', job_2ET);
  matdebug.diffuseColor = new BABYLON.Color3(0.1, 0.2, 1);
  matdebug.alpha = 0.2;
  navmeshdebug.material = matdebug;
  
  // crowd
  var crowd = navigationPlugin.createCrowd(10, 0.1, job_2ET);
  var i;
  var agentParams = {
      radius: 0.1,
      height: 0.2,
      maxAcceleration: 4.0,
      maxSpeed: 1.0,
      collisionQueryRange: 0.5,
      pathOptimizationRange: 0.0,
      separationWeight: 1.0};
      
  for (i = 0; i <1; i++) {
      var width = 0.20;
      var agentCube = BABYLON.MeshBuilder.CreateBox("cube", { size: width, height: width }, job_2ET);
      var targetCube = BABYLON.MeshBuilder.CreateBox("cube", { size: 0.1, height: 0.1 }, job_2ET);
      var matAgent = new BABYLON.StandardMaterial('mat2', job_2ET);
      var variation = Math.random();
      matAgent.diffuseColor = new BABYLON.Color3(0.4 + variation * 0.6, 0.3, 1.0 - variation * 0.3);
      agentCube.material = matAgent;
      var randomPos = navigationPlugin.getRandomPointAround(new BABYLON.Vector3(-2.0, 0.1, -1.8), 0.5);
      var transform = new BABYLON.TransformNode();
      //agentCube.parent = transform;
      var agentIndex = crowd.addAgent(randomPos, agentParams, transform);
      agents.push({idx:agentIndex, trf:transform, mesh:agentCube, target:targetCube});
  }
  
  var startingPoint;
  var currentMesh;
  var pathLine;
  var getGroundPosition = function () {
      var pickinfo = job_2ET.pick(job_2ET.pointerX, job_2ET.pointerY);
      if (pickinfo.hit) {
          return pickinfo.pickedPoint;
      }

      return null;
  }

  var pointerDown = function (mesh) {
          currentMesh = mesh;
          startingPoint = getGroundPosition();
          if (startingPoint) { // we need to disconnect camera from canvas
              setTimeout(function () {
                  camera.detachControl(canvas);
              }, 0);
              var agents = crowd.getAgents();
              var i;
              for (i=0;i<agents.length;i++) {
                  var randomPos = navigationPlugin.getRandomPointAround(startingPoint, 1.0);
                  crowd.agentGoto(agents[i], navigationPlugin.getClosestPoint(startingPoint));
              }
              var pathPoints = navigationPlugin.computePath(crowd.getAgentPosition(agents[0]), navigationPlugin.getClosestPoint(startingPoint));
              pathLine = BABYLON.MeshBuilder.CreateDashedLines("ribbon", {points: pathPoints, updatable: true, instance: pathLine}, job_2ET);
          }
  }
  
  scene.onPointerObservable.add((pointerInfo) => {      		
      switch (pointerInfo.type) {
          case BABYLON.PointerEventTypes.POINTERDOWN:
              if(pointerInfo.pickInfo.hit) {
                  pointerDown(pointerInfo.pickInfo.pickedMesh)
              }
              break;
              }
              });

job_2ET.onBeforeRenderObservable.add(()=> {
      var agentCount = agents.length;
      for(let i = 0;i<agentCount;i++)
      {
          var ag = agents[i];
          ag.mesh.position = crowd.getAgentPosition(ag.idx);
          let vel = crowd.getAgentVelocity(ag.idx);
          crowd.getAgentNextTargetPathToRef(ag.idx, ag.target.position);
          if (vel.length() > 0.2)
          {
              vel.normalize();
              var desiredRotation = Math.atan2(vel.x, vel.z);
              ag.mesh.rotation.y = ag.mesh.rotation.y + (desiredRotation - ag.mesh.rotation.y) * 0.05;
          }
      }
  });
    

    return job_2ET;

    function createStaticMesh(scene) {
        var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
    
     
    
        return ground;
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

    // Cria a luz e a atmosfera
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
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", job_2ET);
    // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/TropicalSunnyDay", job_1MT1);
    backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/Cerebro", job_2ET);
    // backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/Cere", job_1MT1);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;


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



