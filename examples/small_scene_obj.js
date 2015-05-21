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

// models

var onProgress = function ( xhr ) {
  if ( xhr.lengthComputable ) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log( Math.round(percentComplete, 2) + '% downloaded' );
  }
};

var onError = function ( xhr ) {
};


THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

var loader = new THREE.OBJMTLLoader();
loader.load( '../obj/map.obj', '../obj/map.mtl', function ( object ) {

  //object.position.y = - 80;
  scene.add( object );

}, onProgress, onError );

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