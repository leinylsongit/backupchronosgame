//import { Engine, Scene, Color4, Color3, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, StandardMaterial, Texture } from 'babylonjs';
//import { CharacterController } from 'babylonjs-charactercontroller';

const BLACK=new BABYLON.Color3(0, 0, 0),
      WHITE=new BABYLON.Color3(1, 1, 1),
      SILVER_OPACITY_PERCENT=100,
      SILVER=new BABYLON.Color4(0.75, 0.75, 0.75, SILVER_OPACITY_PERCENT/100),
      CORAL_RED=new BABYLON.Color3(1.0, 0.25, 0.25),
      APRICOT=new BABYLON.Color3(0.9, 0.6, 0.4);

const CLEAR_COLOR=SILVER,
      AMBIENT_COLOR=WHITE;

const CANVAS_ID='canvas',
      SMOOTHING=true, // antialiasing for the Babylon Engine...
      DONT_DELETE_FRAMES=false;

const FALL_STARTING_NUMBER=0,
      FALL_ENDING_NUMBER=16;

const IDLE_STARTING_NUMBER=21,
      IDLE_ENDING_NUMBER=65;
      
const JUMP_STARTING_NUMBER=70,
      JUMP_ENDING_NUMBER=94;

const RUN_STARTING_NUMBER=100,
      RUN_ENDING_NUMBER=121;

const SLIDEBACK_STARTING_NUMBER=125,
      SLIDEBACK_ENDING_NUMBER=129;

const STRAFE_LEFT_STARTING_NUMBER=135,
      STRAFE_LEFT_ENDING_NUMBER=179,
      STRAFE_RIGHT_STARTING_NUMBER=185,
      STRAFE_RIGHT_ENDING_NUMBER=229;

const TURN_LEFT_STARTING_NUMBER=240,
      TURN_LEFT_ENDING_NUMBER=262,
      TURN_RIGHT_STARTING_NUMBER=270,
      TURN_RIGHT_ENDING_NUMBER=292;

const WALK_STARTING_NUMBER=300,
      WALK_ENDING_NUMBER=335;

const STEPS_WIDTH=5,
      STEPS_HEIGHT=0.25,
      STEPS_DEPTH=5,
      STEPS_X=0,
      STEPS_Y=6.25,
      STEPS_Z=5;
      
const WALKBACK_STARTING_NUMBER=340,
      WALKBACK_ENDING_NUMBER=366;
      
const GROUND_PATH='meshes/ground/',
      GROUND_TEXTURE=GROUND_PATH+'ground.jpg',
      GROUND_NORMAL_TEXTURE=GROUND_PATH+'ground-normal.png',
      GROUND_HEIGHTMAP=GROUND_PATH+'ground_heightMap.png',
      GROUND_CHECK_COLLISIONS=true,
      GROUND_IS_PICKABLE=true,
      GROUND_MATERIAL_DIFFUSE_COLOR=APRICOT,
      GROUND_MATERIAL_SPECULAR_COLOR=BLACK,
      GROUND_WIDTH=128,
      GROUND_HEIGHT=128,
      GROUND_MINHEIGHT=0,
      GROUND_MAXHEIGHT=10,
      GROUND_SUBDIVISIONS=32,
      BUMP_TEXTURE_X=12.0,
      BUMP_TEXTURE_Y=12.0,
      DIFFUSE_TEXTURE_X=4.0,
      DIFFUSE_TEXTURE_Y=4.0;
      
const PLAYER_POSITION_X=0,
      PLAYER_POSITION_Y=12,
      PLAYER_POSITION_Z=0,
      PLAYER_WIDTH=0.5,
      PLAYER_HEIGHT=1,
      PLAYER_DEPTH=0.5,
      PLAYER_OFFSET_X=0,
      PLAYER_OFFSET_Y=1,
      PLAYER_OFFSET_Z=0;
      
const WHEEL_PRECISION=15,
      DONT_CHECK_FOR_COLLISIONS=false;
      
const CAMERA_RADIUS=5,
      CAMERA_TARGET_X=0,
      CAMERA_TARGET_Y=1.5,
      CAMERA_TARGET_Z=0,
      CAMERA_MAX_PROXIMITY_TO_PLAYER=2,
      CAMERA_MAX_DISTANCE_FROM_PLAYER=20,
      CAMERA_ROTATE_RADIANS_ALPHA_OFFSET=(-4.69),
      CAMERA_ROTATE_RADIANS_BETA=Math.PI/2.5;

const PREVENT_DEFAULT_FUNCTION=false;

const DONT_PREVENT_THIRD_PERSON=false,
      DONT_CLIMB_HIGHER_THAN=0.4;

const LOWEST_SLOPE_CAN_CLIMB=30,
      HIGHEST_SLOPE_CAN_CLIMB=60;
      
const RATE_OF_IDLE=1,
      RATE_OF_TURN_LEFT=0.5,
      RATE_OF_TURN_RIGHT=0.5,
      RATE_OF_WALKBACK=0.5,
      RATE_OF_IDLE_JUMP=0.5,
      RATE_OF_RUN_JUMP=0.6;

const LOOP_IDLE=true,
      LOOP_TURN__LEFT=true,
      LOOP_TURN__RIGHT=true,
      LOOP_WALKBACK=true,
      DONT_LOOP_IDLE_JUMP=false,
      DONT_LOOP_RUN_JUMP=false;
      
const FALL_PLAYBACK_RATE=2,
      SLIDEBACK_PLAYBACK_RATE=1,
      DONT_LOOP_FALL=false,
      DONT_LOOP_SLIDEBACK=false;
      
const MESH_PATH='meshes/player/',
      MESH_FILE='Vincent.babylon';
            
const HEMISPHERIC_LIGHT_X=0,
      HEMISPHERIC_LIGHT_Y=1,
      HEMISPHERIC_LIGHT_Z=0,
      LIGHT_INTENSITY=0.3,
      DIRECTIONAL_LIGHT_X=(-1),
      DIRECTIONAL_LIGHT_Y=(-1),
      DIRECTIONAL_LIGHT_Z=(-1),
      LIGHT_POSITION_X=0,
      LIGHT_POSITION_Y=128,
      LIGHT_POSITION_Z=0,
      LIGHT2_INTENSITY=0.7;

const DEFAULT_SKYBOX_TEXTURE='pine_clouds',
      SKYBOXES=['clouds', 'pine_clouds'],
      SKYBOX_TEXTURE_ROOT='skyboxes/',
      SKYBOX_SIZE=800,
      SKYBOX_COLOR_DIFFUSE=BLACK,
      SKYBOX_COLOR_SPECULAR=BLACK,
      SKYBOX_BACKFACE_CULLING=false,
      SKYBOX_MENU_HEIGHT='40px',
      SKYBOX_MENU_WIDTH='180px',
      SKYBOX_MENU_TOP='10px',
      SKYBOX_MENU_LEFT='10px';
      
const CAR_BODY_BACK_FACE_CULLING=false;

const TRAPEZIUM_SIDE_ONE_X=(-4),
      TRAPEZIUM_SIDE_ONE_Y=2,
      TRAPEZIUM_SIDE_ONE_Z=(-2),
      TRAPEZIUM_SIDE_TWO_X=4,
      TRAPEZIUM_SIDE_TWO_Y=2,
      TRAPEZIUM_SIDE_TWO_Z=-2,
      TRAPEZIUM_SIDE_THREE_X=5,
      TRAPEZIUM_SIDE_THREE_Y=(-2),
      TRAPEZIUM_SIDE_THREE_Z=(-2),
      TRAPEZIUM_SIDE_FOUR_X=(-7),
      TRAPEZIUM_SIDE_FOUR_Y=(-2),
      TRAPEZIUM_SIDE_FOUR_Z=(-2); 
      
const FIRST_CAR_EXTRUDE_PATH_X=0,
      FIRST_CAR_EXTRUDE_PATH_Y=0,
      FIRST_CAR_EXTRUDE_PATH_Z=0,
      SECOND_CAR_EXTRUDE_PATH_X=0,
      SECOND_CAR_EXTRUDE_PATH_Y=0,
      SECOND_CAR_EXTRUDE_PATH_Z=4;
      
const WHEEL_TEXTURE_IMAGE_LINK='http://i.imgur.com/ZUWbT6L.png';
      
const WHEEL_FACE_INDEX_ZERO_X=0,
      WHEEL_FACE_INDEX_ZERO_Y=0,
      WHEEL_FACE_INDEX_ZERO_Z=1,
      WHEEL_FACE_INDEX_ZERO_W=1,
      WHEEL_FACE_INDEX_TWO_X=0,
      WHEEL_FACE_INDEX_TWO_Y=0,
      WHEEL_FACE_INDEX_TWO_Z=1,
      WHEEL_FACE_INDEX_TWO_W=1;
      
const WHEEL_FI_DIAMETER=3,
      WHEEL_FI_HEIGHT=1,
      WHEEL_FI_TESSELLATION=24;
      
const WHEEL_FO_POSITION_X=(-4.5),
      WHEEL_FO_POSITION_Y=(-2),
      WHEEL_FO_POSITION_Z=2.8,
      WHEEL_RI_POSITION_X=(2.5),
      WHEEL_RI_POSITION_Y=(-2),
      WHEEL_RI_POSIITON_Z=(-2.8),
      WHEEL_RO_POSITION_X=2.5,
      WHEEL_RO_POSITION_Y=(-2),
      WHEEL_RO_POSITION_Z=2.8,
      WHEEL_FI_POSITION_X=(-4.5),
      WHEEL_FI_POSITION_Y=(-2),
      WHEEL_FI_POSITION_Z=(-2.8);

const CAR_BODY_POSITION_Y=4;

var skyboxTexture=DEFAULT_SKYBOX_TEXTURE;

const SOME_BIG_Z_VALUE=555;

function autonomous(scene, ground)
{



 //Car Body Material 
 var bodyMaterial=new BABYLON.StandardMaterial('body_mat', scene);

 bodyMaterial.diffuseColor=CORAL_RED;
 bodyMaterial.backFaceCulling=CAR_BODY_BACK_FACE_CULLING;
	
 //Array of points for trapezium side of car.

 var side=[new BABYLON.Vector3(TRAPEZIUM_SIDE_ONE_X,
                               TRAPEZIUM_SIDE_ONE_Y,
                               TRAPEZIUM_SIDE_ONE_Z
                              ),
           new BABYLON.Vector3(TRAPEZIUM_SIDE_TWO_X,
                               TRAPEZIUM_SIDE_TWO_Y,
                               TRAPEZIUM_SIDE_TWO_Z
                              ),
           new BABYLON.Vector3(TRAPEZIUM_SIDE_THREE_X,
                               TRAPEZIUM_SIDE_THREE_Y,
                               TRAPEZIUM_SIDE_THREE_Z
                              ),
           new BABYLON.Vector3(TRAPEZIUM_SIDE_FOUR_X, 
                               TRAPEZIUM_SIDE_FOUR_Y,
                               TRAPEZIUM_SIDE_FOUR_Z
                              )				
          ];
	
 side.push(side[0]);	//close trapezium
	
 //Array of points for the extrusion path

 var extrudePath=[new BABYLON.Vector3(FIRST_CAR_EXTRUDE_PATH_X,
                                      FIRST_CAR_EXTRUDE_PATH_Y,
                                      FIRST_CAR_EXTRUDE_PATH_Z
                                     ),
                  new BABYLON.Vector3(SECOND_CAR_EXTRUDE_PATH_X,
                                      SECOND_CAR_EXTRUDE_PATH_Y,
                                      SECOND_CAR_EXTRUDE_PATH_Z
                                     )
                 ];
	
 //Create body and apply material
 var carBody=BABYLON.MeshBuilder.ExtrudeShape('body',
                                              {shape: side,
                                               path: extrudePath,
                                               cap : BABYLON.Mesh.CAP_ALL
                                              },
                                              scene
                                             );
     carBody.material=bodyMaterial;
	 //-----------------------End Car Body------------------------------------------
	
	 //-----------------------Wheel------------------------------------------ 
	
 //Wheel Material 
 var wheelMaterial=new BABYLON.StandardMaterial('wheel_mat', 
                                                scene
                                               ),
     wheelTexture=new BABYLON.Texture(WHEEL_TEXTURE_IMAGE_LINK,
                                      scene
                                     );

 wheelMaterial.diffuseTexture=wheelTexture;
	
 //Set color for wheel tread as black
 var faceColors=[];
 faceColors[1]=BLACK;
	
 //set texture for flat face of wheel 
 var faceUV=[];
 
 faceUV[0]=new BABYLON.Vector4(WHEEL_FACE_INDEX_ZERO_X,
                               WHEEL_FACE_INDEX_ZERO_Y,
                               WHEEL_FACE_INDEX_ZERO_Z,
                               WHEEL_FACE_INDEX_ZERO_W
                              );
 faceUV[2]=new BABYLON.Vector4(WHEEL_FACE_INDEX_TWO_X,
                               WHEEL_FACE_INDEX_TWO_Y,
                               WHEEL_FACE_INDEX_TWO_Z,
                               WHEEL_FACE_INDEX_TWO_W
                              );
	
 //create wheel front inside and apply material

 var wheelFI=BABYLON.MeshBuilder.CreateCylinder('wheelFI', 
                                                {diameter: WHEEL_FI_DIAMETER,
                                                 height: WHEEL_FI_HEIGHT,
                                                 tessellation: WHEEL_FI_TESSELLATION,
                                                 faceColors:faceColors,
                                                 faceUV:faceUV
                                                },
                                                scene
                                               );
  	 wheelFI.material=wheelMaterial;
	  
 //rotate wheel so tread in xz plane  
 wheelFI.rotate(BABYLON.Axis.X, 
                Math.PI/2,
                BABYLON.Space.WORLD
               );
 wheelFI.parent=carBody;  
	
	
 //-----------------------End Wheel------------------------------------------ 
  
 //------------Create other Wheels as Instances, Parent and Position----------
 var wheelFO=wheelFI.createInstance('FO');
 wheelFO.parent=carBody;
 wheelFO.position=new BABYLON.Vector3(WHEEL_FO_POSITION_X,
                                      WHEEL_FO_POSITION_Y,
                                      WHEEL_FO_POSITION_Z
                                     );
  
 var wheelRI=wheelFI.createInstance('RI');
 wheelRI.parent = carBody;

 wheelRI.position = new BABYLON.Vector3(WHEEL_RI_POSITION_X,
                                        WHEEL_RI_POSITION_Y,
                                        WHEEL_RI_POSIITON_Z
                                       );
  
 var wheelRO=wheelFI.createInstance('RO');
 wheelRO.parent=carBody;

 wheelRO.position=new BABYLON.Vector3(WHEEL_RO_POSITION_X, 
                                      WHEEL_RO_POSITION_Y,
                                      WHEEL_RO_POSITION_Z
                                     );
  
 
 wheelFI.position=new BABYLON.Vector3(WHEEL_FI_POSITION_X,
                                      WHEEL_FI_POSITION_Y,
                                      WHEEL_FI_POSITION_Z
                                     );
   
 //------------End Create other Wheels as Instances, Parent and Position----------
   
 //-----------------------Path------------------------------------------ 
	
 // Create array of points to describe the curve
 var points=[],
     n=450, // number of points
 	 r=50; //radius
 for (var i=0; i<n+1; i++) 
     {points.push
      (new BABYLON.Vector3
       ((r + (r/5)*Math.sin(8*i*Math.PI/n)
        )
        * Math.sin(2*i*Math.PI/n),
        0,
        (r + (r/10)*Math.sin(6*i*Math.PI/n)
        )
        * Math.cos(2*i*Math.PI/n)
       )
      );
     }	
	
 //Draw the curve
 var track=BABYLON.MeshBuilder.CreateLines('track', 
                                           {points: points
                                           },
                                           scene
                                          );
 track.color=BLACK;
 //-----------------------End Path------------------------------------------ 
	
 //-----------------------Ground------------------------------------------ 	
 //??var ground = BABYLON.MeshBuilder.CreateGround('ground', {width: 3*r, height: 3*r}, scene);
 //-----------------------End Ground------------------------------------------ 	
  
 //----------------Position and Rotate Car at Start---------------------------
 
 carBody.position.y=CAR_BODY_POSITION_Y;
 carBody.position.z=r;
  
 var path3d=new BABYLON.Path3D(points
                              ),
     normals=path3d.getNormals(),
     theta=Math.acos(BABYLON.Vector3.Dot
                     (BABYLON.Axis.Z,normals[0]
                     )
                    );
 carBody.rotate(BABYLON.Axis.Y,
                theta,
                BABYLON.Space.WORLD
               ); 
 var startRotation=carBody.rotationQuaternion;
 //----------------End Position and Rotate Car at Start---------------------
   
 //----------------Animation Loop---------------------------
 var i=0;

 function registerFuncAfterFrameRender()
 {carBody.position.x=points[i].x;
  carBody.position.z=points[i].z;
  wheelFI.rotate(normals[i],
                 Math.PI/32,
                 BABYLON.Space.WORLD
                ); 
  wheelFO.rotate(normals[i],
                 Math.PI/32,
                 BABYLON.Space.WORLD
                );
  wheelRI.rotate(normals[i],
                 Math.PI/32,
                 BABYLON.Space.WORLD
                );
  wheelRO.rotate(normals[i], 
                 Math.PI/32,
                 BABYLON.Space.WORLD
                );

  theta=Math.acos(BABYLON.Vector3.Dot
                  (normals[i],
                   normals[i+1]
                  )
                 );
  var dir=BABYLON.Vector3.Cross(normals[i],
                                normals[i+1]
                               ).y;
  var dir=dir/Math.abs(dir);
  carBody.rotate(BABYLON.Axis.Y,
                 dir * theta,
                 BABYLON.Space.WORLD
                );
 
  i=(i + 1) % (n-1);	//continuous looping  
 
  if(i == 0
    ) 
  {carBody.rotationQuaternion=startRotation;
  }
 }//function registerFuncAfterFrameRender()
 scene.registerAfterRender(registerFuncAfterFrameRender
                          );


} // function autonomous(scene, ground)










class Dropdown
{
 constructor(advancedTexture, height, width)
 {
  this.height=height;
  this.width=width;
  this.color='black';
  this.background='white';

  this.advancedTexture=advancedTexture;

  this.container=new BABYLON.GUI.Container();
  this.container.width=this.width;
  this.container.verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  this.container.horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  this.container.isHitTestVisible=false;
        
  // Primary button...
  this.button=BABYLON.GUI.Button.CreateSimpleButton(null, 'Please Select');
  this.button.height=this.height;
  this.button.background=this.background;
  this.button.color=this.color;
  this.button.verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

  // Options panel...
  this.options=new BABYLON.GUI.StackPanel();
  this.options.verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  this.options.top=this.height;
  this.options.isVisible=false;
  this.options.isVertical=true;

  var _this=this;

  this.button.onPointerUpObservable.add(function()
                                        {
                                         _this.options.isVisible=!_this.options.isVisible;
                                        }
                                       );

  this.container.onPointerEnterObservable.add(function()
                                              {_this.container.zIndex=SOME_BIG_Z_VALUE;            
                                              }
                                             ); // custom hack to make dropdown visible...

  this.container.onPointerOutObservable.add(function()
                                            {
                                             _this.container.zIndex=0;
                                            }
                                           ); // back to original...

  this.advancedTexture.addControl(this.container);
  this.container.addControl(this.button);
  this.container.addControl(this.options);        
 } // constructor(advancedTexture, height, width)

 get top()
 {return this.container.top;
 }

 set top(value)
 {this.container.top=value;     
 }

 get left()
 {return this.container.left;
 }

 set left(value)
 {this.container.left=value;     
 } 
	
 addOption(text, callback)
 {var button=BABYLON.GUI.Button.CreateSimpleButton(text, text);

  button.height=this.height;
  button.paddingTop='-1px';
  button.background=this.background;
  button.color=this.color;
  button.alpha=1.0;
  button.onPointerUpObservable.add(() => {this.options.isVisible=false;            
                                         }
                                  );        
  button.onPointerClickObservable.add(callback); 
  this.options.addControl(button);
 } // addOption(text, callback)
} // class Dropdown




function delAnimRanges(skel)
{var ars=skel.getAnimationRanges(),
     length=ars.length;

 for (let index=0; index<length; index++)
     {let ar=ars[index];
         
      console.log(ar.name+','+ar.from+','+ar.to);
      skel.deleteAnimationRange(ar.name, DONT_DELETE_FRAMES);
     } // for (let index=0; index<length; index++)
} // function delAnimRanges(skel)

function setAnimationRanges(skel)
// this is how you might set the animation ranges for a skeleton...
{delAnimRanges(skel);
 skel.createAnimationRange('fall',
                           FALL_STARTING_NUMBER,
                           FALL_ENDING_NUMBER
                          );
 skel.createAnimationRange('idle',
                           IDLE_STARTING_NUMBER,
                           IDLE_ENDING_NUMBER
                          );
 skel.createAnimationRange('jump',
                           JUMP_STARTING_NUMBER,
                           JUMP_ENDING_NUMBER
                          );
 skel.createAnimationRange('run',
                           RUN_STARTING_NUMBER,
                           RUN_ENDING_NUMBER
                          );
 skel.createAnimationRange('slideBack',
                           SLIDEBACK_STARTING_NUMBER,
                           SLIDEBACK_ENDING_NUMBER
                          );
 skel.createAnimationRange('strafeLeft',
                           STRAFE_LEFT_STARTING_NUMBER,
                           STRAFE_LEFT_ENDING_NUMBER
                          );
 skel.createAnimationRange('strafeRight',
                           STRAFE_RIGHT_STARTING_NUMBER,
                           STRAFE_RIGHT_ENDING_NUMBER
                          );
 skel.createAnimationRange('turnLeft',
                           TURN_LEFT_STARTING_NUMBER,
                           TURN_LEFT_ENDING_NUMBER
                          );
 skel.createAnimationRange('turnRight',
                           TURN_RIGHT_STARTING_NUMBER,
                           TURN_RIGHT_ENDING_NUMBER
                          );
 skel.createAnimationRange('walk',
                           WALK_STARTING_NUMBER,
                           WALK_ENDING_NUMBER
                          );
 skel.createAnimationRange('walkBack',
                           WALKBACK_STARTING_NUMBER,
                           WALKBACK_ENDING_NUMBER
                          );
} // function setAnimationRanges(skel)

function createGround(scene)
{
 function createGroundMaterial(scene)
 {var groundMaterial=new BABYLON.StandardMaterial('groundMat',
                                                  scene
                                                 ),
      diffuseTexture=new BABYLON.Texture(GROUND_TEXTURE,
                                         scene
                                        );

  diffuseTexture.uScale=DIFFUSE_TEXTURE_X;
  diffuseTexture.vScale=DIFFUSE_TEXTURE_Y;
  groundMaterial.diffuseTexture=diffuseTexture;

  var bumpTexture=new BABYLON.Texture(GROUND_NORMAL_TEXTURE,
                                      scene
                                     );
                            
  bumpTexture.uScale=BUMP_TEXTURE_X;
  bumpTexture.vScale=BUMP_TEXTURE_Y;
  groundMaterial.bumpTexture=bumpTexture;
  groundMaterial.diffuseColor=GROUND_MATERIAL_DIFFUSE_COLOR;
  groundMaterial.specularColor=GROUND_MATERIAL_SPECULAR_COLOR;
  return groundMaterial;
 } // function createGroundMaterial(scene)

 function groundReady(ground)
 {
  ground.material=groundMaterial;
  ground.checkCollisions=GROUND_CHECK_COLLISIONS;
  ground.isPickable=GROUND_IS_PICKABLE;
  ground.freezeWorldMatrix();
 } // function groundReady()
 
 var groundMaterial=createGroundMaterial(scene);

 BABYLON.MeshBuilder.CreateGroundFromHeightMap('ground',
                                               GROUND_HEIGHTMAP,
                                               {width: GROUND_WIDTH,
                                                height: GROUND_HEIGHT,
                                                minHeight: GROUND_MINHEIGHT,
                                                maxHeight: GROUND_MAXHEIGHT,
                                                subdivisions: GROUND_SUBDIVISIONS,
                                                onReady: groundReady
                                               },
                                               scene
                                              );
} // function createGround(scene)

function loadPlayer(scene, engine, canvas)
{
 function importer (meshes, particleSystems, skeletons)
 {
  function render ()
  {scene.render();
  }

  var player=meshes[0],
      skeleton=skeletons[0];
      
  player.skeleton=skeleton;
  skeleton.enableBlending(0.1);
  
  // If the skeleton does not have any animation ranges then set them as below...
  //setAnimationRanges(skeleton);
  var sm=player.material;
  
  if (sm.diffuseTexture!=null)
     {sm.backFaceCulling=true;
      sm.ambientColor=AMBIENT_COLOR;
     } // sm.diffuseTexture!=null

  player.position=new BABYLON.Vector3(PLAYER_POSITION_X,
                                      PLAYER_POSITION_Y,
                                      PLAYER_POSITION_Z
                                     );
  player.checkCollisions=true;
  player.ellipsoid=new BABYLON.Vector3(PLAYER_WIDTH,
                                       PLAYER_HEIGHT,
                                       PLAYER_DEPTH
                                      );
  player.ellipsoidOffset=new BABYLON.Vector3(PLAYER_OFFSET_X,
                                             PLAYER_OFFSET_Y,
                                             PLAYER_OFFSET_Z
                                            );

  // rotate the camera behind the player...
  var alpha=(-player.rotation.y+CAMERA_ROTATE_RADIANS_ALPHA_OFFSET),
      beta=Math.PI/2.5,
      target=new BABYLON.Vector3(player.position.x,
                                 player.position.y+1.5,
                                 player.position.z
                                );

  console.log ('loading meshes 1.1');

  var camera=new BABYLON.ArcRotateCamera('ArcRotateCamera',
                                         alpha, // radians...
                                         CAMERA_ROTATE_RADIANS_BETA,
                                         CAMERA_RADIUS,
                                         target,
                                         scene
                                        ); // standard camera setting...

  camera.wheelPrecision=WHEEL_PRECISION;
  camera.checkCollisions=DONT_CHECK_FOR_COLLISIONS;
 
  // Make sure the keyboard keys controlling camera are different from those controlling player
  // here we will not use any keyboard keys to control camera...
  camera.keysLeft=[];
  camera.keysRight=[];
  camera.keysUp=[];
  camera.keysDown=[];
  
  camera.lowerRadiusLimit=CAMERA_MAX_PROXIMITY_TO_PLAYER; // How close can the camera come to player...
  camera.upperRadiusLimit=CAMERA_MAX_DISTANCE_FROM_PLAYER; // How far can the camera go from the player...
  camera.attachControl(canvas, PREVENT_DEFAULT_FUNCTION);
  //let CharacterController=org.ssatguru.babylonjs.component.CharacterController;
 
  var cc=new CharacterController(player, camera, scene);

  // below makes the controller point the camera at the player head
  // which is approx 1.5m above the player origin
  cc.setCameraTarget(new BABYLON.Vector3(CAMERA_TARGET_X,
                                         CAMERA_TARGET_Y,
                                         CAMERA_TARGET_Z
                                        )
                    );

  // If the camera comes close to the player we want to enter first person mode...
  
  cc.setNoFirstPerson(DONT_PREVENT_THIRD_PERSON); //not working regardless. can't switch back from first-person

  cc.setStepOffset(DONT_CLIMB_HIGHER_THAN); // the height of steps which the player can climb...
 
  // The minimum and maximum slope the player can go up
  // between the two the player will start sliding down if it stops...
 
  cc.setSlopeLimit(LOWEST_SLOPE_CAN_CLIMB,
                   HIGHEST_SLOPE_CAN_CLIMB
                  );

  // Tell controller:
  //
  // - which animation range should be used for which player animation
  // - rate at which to play that animation range
  // - whether the animation range should be looped
  //   (use this if name, rate or looping is different from default...)
  
  cc.setIdleAnim('idle',
                 RATE_OF_IDLE,
                 LOOP_IDLE
                );
  cc.setTurnLeftAnim('turnLeft',
                     RATE_OF_TURN_LEFT,
                     LOOP_TURN__LEFT
                    );
  cc.setTurnRightAnim('turnRight',
                      RATE_OF_TURN_RIGHT,
                      LOOP_TURN__RIGHT
                     );
  cc.setWalkBackAnim('walkBack',
                     RATE_OF_WALKBACK,
                     LOOP_WALKBACK
                    );
  cc.setIdleJumpAnim('idleJump',
                     RATE_OF_IDLE_JUMP,
                     DONT_LOOP_IDLE_JUMP
                    );
  cc.setRunJumpAnim('runJump',
                    RATE_OF_RUN_JUMP,
                    DONT_LOOP_RUN_JUMP
                   );
 
  // Set the animation range name to 'null'
  // to prevent the controller from playing a player animation
  // here even though we have an animation range called 'fall',
  // we do not want to play the fall animation...
  
  cc.setFallAnim('fall',
                 FALL_PLAYBACK_RATE,
                 DONT_LOOP_FALL
                );
  cc.setSlideBackAnim('slideBack',
                      SLIDEBACK_PLAYBACK_RATE,
                      DONT_LOOP_SLIDEBACK
                     );
  cc.start();
  engine.runRenderLoop(render);
 } // function importer (meshes, particleSystems, skeletons)

 BABYLON.SceneLoader.ImportMesh('',
                                MESH_PATH,
                                MESH_FILE,
                                scene,
                                importer
                               );
} // function loadPlayer(scene, engine, canvas)

var skybox=null, skyboxMaterial=null; //??

function main()
{var canvas=document.querySelector('#'+CANVAS_ID),
     engine=new BABYLON.Engine(canvas, SMOOTHING),
     scene=new BABYLON.Scene(engine);

 function resize()
 {engine.resize();
 }

 function setSkybox(skyboxTexture)
 {
// What about the last one? We need to deallocate it...
  if (skyboxMaterial!==null)//??
     skyboxMaterial.dispose();
  if (skybox!==null)//??
     skybox.dispose();//??
  skybox=BABYLON.Mesh.CreateBox('skyBox',
                                SKYBOX_SIZE,
                                scene
                               ),
  skyboxMaterial=new BABYLON.StandardMaterial('skyBox',
                                              scene
                                             );

  skyboxMaterial.backFaceCulling=SKYBOX_BACKFACE_CULLING;
  skyboxMaterial.reflectionTexture=new BABYLON.CubeTexture(SKYBOX_TEXTURE_ROOT+skyboxTexture+'/'+skyboxTexture,
                                                           scene
                                                          );
  skyboxMaterial.reflectionTexture.coordinatesMode=BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor=SKYBOX_COLOR_DIFFUSE;
  skyboxMaterial.specularColor=SKYBOX_COLOR_SPECULAR;
  skybox.material=skyboxMaterial;
 } // function setSkybox(skyboxTexture)

 function addSkyboxMenu()
 {
  function menuLabel(menuValue)
  {return menuValue.replace('_', ' ');
  } // menuLabel(menuValue)
  
  function menuValue(menuLabel)
  {return menuLabel.replace(' ', '_');
  } // menuLabel(menuLabel)
  
  function skybox(menuEvent, state)
  {var menuLabel=state.currentTarget.name;

   skyboxTexture=menuValue(menuLabel);
   setSkybox (skyboxTexture);
  } // function skybox(menuEvent, state)
/*
  function clouds()
  {
   skyboxTexture='clouds';//??
   setSkybox (skyboxTexture);//??
  } // function clouds()
  
  function pine_clouds()
  {skyboxTexture='pine_clouds';
   setSkybox (skyboxTexture);
  } // function pine_clouds()
*/  
  if (BABYLON.GUI===undefined)
     {console.log ('Cannot presently load menu with this version of Babylon...');
      return;
     }

  var advancedTexture=BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI'),
      dropdown=new Dropdown(advancedTexture, SKYBOX_MENU_HEIGHT, SKYBOX_MENU_WIDTH);

  dropdown.button.children[0].text='Background';
  dropdown.top=SKYBOX_MENU_TOP;
  dropdown.left=SKYBOX_MENU_LEFT;
/*
  dropdown.addOption('clouds', clouds);
  dropdown.addOption('pine clouds', pine_clouds);
*/
  for (let index=0; index<SKYBOXES.length; index++)
      dropdown.addOption (menuLabel(SKYBOXES[index]), skybox); 
 } // function addSkyboxMenu()

 scene.clearColor=CLEAR_COLOR;
 scene.ambientColor=AMBIENT_COLOR;

 setSkybox (skyboxTexture);
 addSkyboxMenu();

 var light=new BABYLON.HemisphericLight('light1',
                                        new BABYLON.Vector3(HEMISPHERIC_LIGHT_X,
                                                            HEMISPHERIC_LIGHT_Y,
                                                            HEMISPHERIC_LIGHT_Z
                                                           ),
                                        scene
                                       );

 light.intensity=LIGHT_INTENSITY;

 var light2=new BABYLON.DirectionalLight('light2',
                                         new BABYLON.Vector3(DIRECTIONAL_LIGHT_X,
                                                             DIRECTIONAL_LIGHT_Y,
                                                             DIRECTIONAL_LIGHT_Z
                                                            ),
                                         scene
                                        );

 light2.position=new BABYLON.Vector3(LIGHT_POSITION_X,
                                     LIGHT_POSITION_Y,
                                     LIGHT_POSITION_Z
                                    );
 light2.intensity=LIGHT2_INTENSITY;
 
 var ground=createGround(scene),
     steps=BABYLON.MeshBuilder.CreateBox('Steps',
                                         {'width': STEPS_WIDTH,
                                          'height': STEPS_HEIGHT,
                                          'depth': STEPS_DEPTH
                                         }, 
                                         scene
                                        );
 steps.position=new BABYLON.Vector3(STEPS_X, STEPS_Y, STEPS_Z);
 steps.checkCollisions=true;
 loadPlayer (scene, engine, canvas);
 
 autonomous(scene, ground);//????
 
 window.addEventListener('resize', resize);
} // function main()

//## sourceMappingURL=index.js.map

window.onload=main;