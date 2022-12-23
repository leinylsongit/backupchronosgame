var canvas = document.getElementById("canvasPrimario");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var job_TesteMT = null;

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };


//Inicio da tarefa---------------------------------------------------------------------------------
var create_Tarefa = function () {
  // Cria a Cena
  job_TesteMT = new BABYLON.Scene(engine);

  // Adiciona uma luz
  const light = new BABYLON.PointLight('light1', new BABYLON.Vector3(0, 10, 0), job_TesteMT);

//   // Cria quatro esferas
//   const sphere1 = BABYLON.MeshBuilder.CreateSphere('1', { diameter: 1 }, job_TesteMT);
//   sphere1.position.x = -2;

//   const sphere2 = BABYLON.MeshBuilder.CreateSphere('2', { diameter: 1 }, job_TesteMT);
//   sphere2.position.x = -1;

//   const sphere3 = BABYLON.MeshBuilder.CreateSphere('3', { diameter: 1 }, job_TesteMT);
//   sphere3.position.x = 1;

//   const sphere4 = BABYLON.MeshBuilder.CreateSphere('4', { diameter: 1 }, job_TesteMT);
//   sphere4.position.x = 2;
  
//   // while(true){
//   // Sorteia uma esfera
//   const randomSphereIndex = Math.floor(Math.random() * 1);
//   let selectedSphere;

//   if (randomSphereIndex === 0) {
//     selectedSphere = sphere1.name;
//   } else if (randomSphereIndex === 1) {
//     selectedSphere = sphere2.name;
//   } else if (randomSphereIndex === 2) {
//     selectedSphere = sphere3.name;
//   } else {
//     selectedSphere = sphere4.name;
//   }
//   // Pergunta ao usuário qual esfera foi sorteada
//   const answer = prompt('Qual esfera foi sorteada?');

//   // Verifica se a resposta do usuário está correta
//   if (selectedSphere.name === answer) {
//     alert('Resposta correta!');
//   } else {
//     alert('Resposta incorreta. A esfera sorteada foi: ' + selectedSphere);
//   }
// // }


// // Variáveis globais
// var number; // Número aleatório gerado
// var count = 0; // Contador de quadros

// // Gerar um número aleatório e exibi-lo na tela
// function generateNumber() {
//   number = Math.floor(Math.random() * 100);
//   document.getElementById("number").innerHTML = number;
// }

// // Loop de animação
// job_TesteMT.registerBeforeRender(function() {
//   count++;
//   generateNumber(); // Gerar novo número aleatório
//   if (count > 100) { // Interromper o loop após 100 quadros
//     job_TesteMT.unregisterBeforeRender(this);
//     var input = prompt("Qual era o último número exibido?");
//     if (input == number) {
//       alert("Acerto!");
//     } else {
//       alert("Errado. O último número era " + number);
//     }
//   }
// });

//   const sphere = BABYLON.MeshBuilder.CreateSphere('1', { diameter: 1 }, job_TesteMT);
//   sphere.position.x = -2;

// // Cria um relógio para medir o tempo
// var clock = new BABYLON.Clock();

// // Animação da esfera
// job_TesteMT.onBeforeRenderObservable.add(function() {
//     // Atualiza o relógio e obtém a diferença de tempo em segundos
//     var dt = clock.getDelta();

//     // Rotaciona a esfera em torno de seu próprio eixo y com base na diferença de tempo
//     sphere.rotation.y += dt;
// });


// Adicionando uma câmera
let camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), job_TesteMT);
camera.setPosition(new BABYLON.Vector3(0, 5, -10));
camera.attachControl(canvas, true);

// Adicionando luzes
let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), job_TesteMT);
let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), job_TesteMT);

// Adicionando esferas
let sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere1", {diameter: 1}, job_TesteMT);
let sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere2", {diameter: 1}, job_TesteMT);

// Posicionando as esferas
sphere1.position.x = -2;
sphere2.position.x = 2;

// Criando uma animação para fazer as esferas aparecerem e desaparecerem
let showHideAnimation = new BABYLON.Animation("showHide", "material.alpha", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

// Definindo os "keyframes" da animação
let keys = [];
keys.push({
  frame: 0,
  value: 0
});
keys.push({
  frame: 30,
  value: 1
});
keys.push({
  frame: 60,
  value: 1
});
keys.push({
  frame: 90,
  value: 0
});

// Adicionando os keyframes à animação
showHideAnimation.setKeys(keys);

// Aplicando a animação às esferas
sphere1.animations = [showHideAnimation];
sphere2.animations = [showHideAnimation];

// Iniciando a animação
job_TesteMT.beginAnimation(sphere1, 0, 90, true);
job_TesteMT.beginAnimation(sphere2, 0, 90, true);

};//Fim da tarefa <-----------------------------------------------------------------------<<<

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
