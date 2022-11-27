var Tarefa = document.getElementById("Tarefa");

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
var createDefaultEngine = function() { return new BABYLON.Engine(Tarefa, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = function () {

	// This creates a basic Babylon Scene object (non-mesh)
	var scene = new BABYLON.Scene(engine);

	// This creates and positions a free camera (non-mesh)
	var camera = new BABYLON.ArcRotateCamera("arcR", -Math.PI/2, Math.PI/2, 15, BABYLON.Vector3.Zero(), scene);

	// This attaches the camera to the canvas
	camera.attachControl(Tarefa, true);

	var planeOpts = {
			height: 5.4762, 
			width: 7.3967, 
			sideOrientation: BABYLON.Mesh.DOUBLESIDE
	};
	var ANote0Video = BABYLON.MeshBuilder.CreatePlane("plane", planeOpts, scene);
	var vidPos = (new BABYLON.Vector3(0,0,0.1))
	ANote0Video.position = vidPos;
	var ANote0VideoMat = new BABYLON.StandardMaterial("m", scene);
	var ANote0VideoVidTex = new BABYLON.VideoTexture("vidtex","textures/videos/video_02.mp4", scene);
	ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
	ANote0VideoMat.roughness = 1;
	ANote0VideoMat.emissiveColor = new BABYLON.Color3.White();
	ANote0Video.material = ANote0VideoMat;
	scene.onPointerObservable.add(function(evt){
			if(evt.pickInfo.pickedMesh === ANote0Video){
				//console.log("picked");
					if(ANote0VideoVidTex.video.paused)
						ANote0VideoVidTex.video.play();
					else
						ANote0VideoVidTex.video.pause();
					console.log(ANote0VideoVidTex.video.paused?"paused":"playing");
			}
	}, BABYLON.PointerEventTypes.POINTERPICK);
	//console.log(ANote0Video);
	return scene;

};
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
startRenderLoop(engine, Tarefa);
window.scene = createScene();};
initFunction().then(() => {sceneToRender = scene                    
});

// Resize
window.addEventListener("resize", function () {
	engine.resize();
});