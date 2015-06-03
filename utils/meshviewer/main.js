/******************************************************************************
 * Original code copy from http://stemkoski.github.io/Three.js/Model.html
 ******************************************************************************/

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var clock = new THREE.Clock();

// custom global variables
var monkey;

init();
animate();

// FUNCTIONS
function init() 
{
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0,150,400);
  camera.lookAt(scene.position);
  // RENDERER
  if ( Detector.webgl )
    renderer = new THREE.WebGLRenderer( {antialias:true} );
  else
    renderer = new THREE.CanvasRenderer(); 
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById( 'ThreeJS' );
  container.appendChild( renderer.domElement );
  
  //
  // EVENTS
  //
  
  var window_resize_callback = function(){
    // notify the renderer of the size change
    renderer.setSize( window.innerWidth, window.innerHeight );
    // update the camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  // bind the resize event
  window.addEventListener('resize', window_resize_callback, false);
  
  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild( stats.domElement );
  // LIGHT
  var light = new THREE.PointLight(0xffffff);
  light.position.set(-100,200,100);
  scene.add(light);
  // FLOOR
  var floorTexture = new THREE.ImageUtils.loadTexture( './checkerboard.jpg' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
  floorTexture.repeat.set( 10, 10 );
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  var floorGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -0.5;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);
  // SKYBOX/FOG
  var skyBoxGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  // scene.add(skyBox);
  scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
  
  ////////////
  // CUSTOM //
  ////////////
  
  // Note: if imported model appears too dark,
  //   add an ambient light in this file
  //   and increase values in model's exported .js file
  //    to e.g. "colorAmbient" : [0.75, 0.75, 0.75]
  var jsonLoader = new THREE.JSONLoader();
  jsonLoader.load( "./monkey.json", addModelToScene );
  // addModelToScene function is called back after model has loaded
  
  var ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);
  
}

function addModelToScene( geometry, materials ) 
{
  var material = new THREE.MeshFaceMaterial( materials );
  monkey = new THREE.Mesh( geometry, material );
  monkey.scale.set(10,10,10);
  monkey.position.y = 50;
  scene.add( monkey );
}

function animate() 
{
  requestAnimationFrame( animate );
  render();
  update();
}

function update()
{
  controls.update();
  stats.update();
}

function render() 
{
  renderer.render( scene, camera );
}