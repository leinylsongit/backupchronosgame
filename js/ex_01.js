/* Práticas*/

var canvas = document.getElementById("canvasPrimario");

var engine = null;
var scene = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Adiciona física ao cenário
    scene.collisionsEnabled = true;
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    // scene.enablePhysics();

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);
    // var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
    light1.intensity = 0.8;

   //Array of points to construct a spiral with lines
//    criaEspiral(scene);

    exibeEixos(scene);
   

    // Adiciona a caixa
    var b = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    b.material = new BABYLON.StandardMaterial("materialGround", scene);

    b.position.x = 0;
    b.position.y = 0.5;
    // b.position.z = 30;
    
    b.ellipsoid = new BABYLON.Vector3(0.7, 0.7, 0.7);
    b.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
    b.checkCollisions = true;

    drawEllipsoid(b);

    // Adiciona a esfera
    var s = BABYLON.MeshBuilder.CreateSphere("sph", { size: 1  }, scene);
    s.material = new BABYLON.StandardMaterial("materialGround", scene);
    
    s.position.x = 0.5;
    // s.position.y = 0;
    // s.position.z = 0;

    s.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
    s.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0);
    s.checkCollisions = true;

    drawEllipsoid(s);


    // Adiciona a abelha
    BABYLON.SceneLoader.ImportMesh("", "./assets/animais/", "Bee.glb", scene, function (mesh_Bee, particleSystems, skeletons_Bee) {
        mesh_Bee[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
        mesh_Bee[0].position = new BABYLON.Vector3(0, 0, 0);

        mesh_Bee[0].collisionsEnabled = true;
        // mesh_Bee[0].wireframe = true;

        // Elipse para verificar as colisões
        mesh_Bee[0].ellipsoid = new BABYLON.Vector3(8, 8, 8);
        mesh_Bee[0].ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);
        mesh_Bee[0].checkCollisions = true;

        // Exibe a elipse que envolve a abelha
        drawEllipsoid(mesh_Bee[0]);

        // Verifica as colisões
        if (mesh_Bee[0].intersectsMesh(s, true)) {
            console.log("abelha com esfera Colidiu!")
            s.material.emissiveColor = new BABYLON.Color3.Red();
            // s.dispose();
        }
        else{
            console.log("abelha com esfera Não colidiu!")
            s.material.specularColor = BABYLON.Color3.Blue();
        }

        if (mesh_Bee[0].intersectsMesh(b, true)) {
            console.log("abelha com caixa Colidiu!")
            b.material.emissiveColor = BABYLON.Color3.Red();
            // b.dispose();
        }
        else{
            console.log("abelha com caixa Não colidiu!")
            b.material.emissiveColor = BABYLON.Color3.Blue();
        }

        if (b.intersectsMesh(s, true)) {
            console.log("caixa com esfera Colidiu!")
            s.material.emissiveColor = BABYLON.Color3.White();
        }
        else{
            console.log("caixa com esfera Não colidiu!")
            b.material.emissiveColor = new BABYLON.Color3.Green(); 
        }

    }
);
    return scene;
};

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

function loop(){
    // var b;
   b.position.y += 0.5;
};

engine = createDefaultEngine();
if (!engine) throw 'engine should not be null.';
scene = createScene();

engine.runRenderLoop(function () {
    if (scene) {
        // loop();
        scene.render();
    }
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});



// Cria Espiral------------------------------------------------------------------------------------
function criaEspiral(scene) {
    var myPoints = [];

    var deltaTheta = 0.1;
    var deltaY = 0.005;

    var radius = 1;
    var theta = 0;
    var Y = 0;
    for (var i = 0; i < 400; i++) {
        myPoints.push(new BABYLON.Vector3(radius * Math.cos(theta), Y, radius * Math.sin(theta)));
        theta += deltaTheta;
        Y += deltaY;
    }

    //Create lines 
    var lines = BABYLON.MeshBuilder.CreateLines("lines", { points: myPoints }, scene);
}

// Exibe eixos ---------------------------------------------------------------------------
function exibeEixos(scene) {
    var body = BABYLON.MeshBuilder.CreateCylinder("body", { height: 0.75, diameterTop: 0.2, diameterBottom: 0.5, tessellation: 6, subdivisions: 1 }, scene);
    var arm = BABYLON.MeshBuilder.CreateBox("arm", { height: 0.75, width: 0.3, depth: 0.1875 }, scene);
    arm.position.x = 0.125;
    var pilot = BABYLON.Mesh.MergeMeshes([body, arm], true);

    pilot.position = new BABYLON.Vector3(0, 0, 0);
    pilot.isVisible = false;

    showAxis(8);
}

// Cria eixos --------------------------------------------------------------------------
 function showAxis(size) {
    var makeTextPlane = function (text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
        var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
        return plane;
    };

    var axisX = BABYLON.Mesh.CreateLines("axisX", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
    ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

