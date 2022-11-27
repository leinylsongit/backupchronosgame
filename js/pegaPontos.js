const videoElement = document.getElementsByClassName('input_video')[0];
        const canvasElement = document.getElementsByClassName('output_canvas')[0];
        const canvasCtx = canvasElement.getContext('3d');
       
        let game = new Game();
        var ponto;
        function onResults(results) {
            // canvasCtx.save();
            if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                    pegarPontos(landmarks);
                    ponto = landmarks;
                }
            }
            // canvasCtx.restore();
        }
        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        hands.setOptions({
            selfieMode: true,
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        hands.onResults(onResults);
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({
                    image: videoElement
                });
            },

        });
        camera.start();

        function pegarPontos(pontos) {
            window.pegar(pontos);
        }

        window.initFunction = async function () {

            var asyncEngineCreation = async function () {
                try {
                    return game.createDefaultEngine();
                } catch (e) {
                    console.log("the available createEngine function failed. Creating the default engine instead");
                    return game.createDefaultEngine();
                }
            }

            window.engine = await asyncEngineCreation();
            if (!engine) throw 'engine should not be null.';
            window.scene = game.createScene();
        };
        initFunction().then(() => {
            sceneToRender = scene
            engine.runRenderLoop(function () {
                if (sceneToRender && sceneToRender.activeCamera) {
                    sceneToRender.render();
                    // if(ponto != 'undefined'){
                    //     game.createScene(ponto);
                    // }
                }
            });
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });