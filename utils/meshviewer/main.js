/******************************************************************************
 * Original code copy from http://stemkoski.github.io/Three.js/Model.html
 ******************************************************************************/

// Config

// The position of mesh after loading.
var G_MonkeyInitPosition = {};
G_MonkeyInitPosition.x = 0;
G_MonkeyInitPosition.y = 50;
G_MonkeyInitPosition.z = 0;

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
  
  //
  // GUI
  //
  
  gui = new dat.GUI();
  
  parameters = 
  {
    x: 0, y: G_MonkeyInitPosition.y, z: 0,
    color: "#ff0000", // color (change "#" to "0x")
    opacity: 1, 
    visible: true,
    material: "Phong",
    reset: function() { resetMonkey() }
  };

  var folder1 = gui.addFolder('Position');
  var monkeyX = folder1.add( parameters, 'x' ).min(-200).max(200).step(1).listen();
  var monkeyY = folder1.add( parameters, 'y' ).min(0).max(100).step(1).listen();
  var monkeyZ = folder1.add( parameters, 'z' ).min(-200).max(200).step(1).listen();
  folder1.open();
  
  monkeyX.onChange(function(value) {
    monkey.position.x = value;
  });
  monkeyY.onChange(function(value) {
    monkey.position.y = value;
  });
  monkeyZ.onChange(function(value) {
    monkey.position.z = value;
  });
  
  var monkeyColor = gui.addColor( parameters, 'color' ).name('Color').listen();
  // onFinishChange
  monkeyColor.onChange(function(value) {
    // Check single or multiple material.
    //monkey.material.color.setHex( value.replace("#", "0x") );
    monkey.material.materials[0].color.setHex( value.replace("#", "0x") );
  });
  
  var monkeyOpacity = gui.add( parameters, 'opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
  monkeyOpacity.onChange(function(value) {
    // Check single or multiple material.
    //monkey.material.opacity = value;
    monkey.material.materials[0].opacity = value;
  });
  
  var monkeyMaterial = gui.add( parameters, 'material', [ "Basic", "Lambert", "Phong", "Wireframe" ] ).name('Material Type').listen();
  monkeyMaterial.onChange(function(value) {
    updateMonkey();
  });
  
  var monkeyVisible = gui.add( parameters, 'visible' ).name('Visible?').listen();
  monkeyVisible.onChange(function(value) {
    monkey.visible = value;
  });
  
  gui.add( parameters, 'reset' ).name("Reset monkey Parameters");
  
  gui.open();
  
}

function updateMonkey()
{
  var value = parameters.material;
  var newMaterial;
  if (value == "Basic")
    newMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
  else if (value == "Lambert")
    newMaterial = new THREE.MeshLambertMaterial( { color: 0x000000 } );
  else if (value == "Phong")
    newMaterial = new THREE.MeshPhongMaterial( { color: 0x000000 } );
  else // (value == "Wireframe")
    newMaterial = new THREE.MeshBasicMaterial( { wireframe: true } );
  
  newMaterial.color.setHex( parameters.color.replace("#", "0x") );
  newMaterial.opacity = parameters.opacity;  
  newMaterial.transparent = true;
  
  monkey.material = new THREE.MeshFaceMaterial();
  monkey.material.materials = [];
  monkey.material.materials.push ( newMaterial ) ;
  
  monkey.position.x = parameters.x;
  monkey.position.y = parameters.y;
  monkey.position.z = parameters.z;

  monkey.visible = parameters.visible;
  
}

function resetMonkey()
{
  parameters.x = 0;
  parameters.y = G_MonkeyInitPosition.y;
  parameters.z = 0;
  parameters.color = "#ff0000";
  parameters.opacity = 1;
  parameters.visible = true;
  parameters.material = "Phong";
  updateMonkey();
}

function addModelToScene( geometry, materials ) 
{
  var material = new THREE.MeshFaceMaterial( materials );
  monkey = new THREE.Mesh( geometry, material );
  monkey.scale.set(10,10,10);
  monkey.position.y = G_MonkeyInitPosition.y;
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