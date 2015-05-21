// Check webgl env.
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer;
var pointLight;

var clock = new THREE.Clock();

container = document.createElement( 'div' );
document.body.appendChild( container );

camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.set( -20, 40, -50 );

scene = new THREE.Scene();

var loader = new THREE.JSONLoader();

// Put the mesh loaded to scene.
var add_to_scene = function ( geometry, materials ) {

  var faceMaterial = new THREE.MeshFaceMaterial( materials );
  
  mesh = new THREE.Mesh( geometry, faceMaterial );

  mesh.position.set( 0, 0, 0 );

  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();

  scene.add( mesh );
  
  // Show bounding box.
  //var bbox = new THREE.BoundingBoxHelper( mesh, 0xff0000 );
  //bbox.update();
  //scene.add( bbox );
};

loader.load( './models/school_small_scene/gnd25_1.json', add_to_scene );
loader.load( './models/school_small_scene/gnd13_1.json', add_to_scene );
loader.load( './models/school_small_scene/plant77_1.json', add_to_scene );//building
loader.load( './models/school_small_scene/plant9915_2.json', add_to_scene );

// Lights

scene.add( new THREE.AmbientLight( 0xffffff ) );

pointLight = new THREE.PointLight( 0xffffff, 5, 300 );
pointLight.position.set( 5, 0, 0 );
scene.add( pointLight );

// Renderer

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

// Start

animate();

function animate() {

  requestAnimationFrame( animate );

  var delta = clock.getDelta();

  // animate Collada model

  THREE.AnimationHandler.update( delta );

  render();

}

function render() {

  camera.lookAt( scene.position );

  renderer.render( scene, camera );

}