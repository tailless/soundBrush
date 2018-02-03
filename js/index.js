WEBVR.checkAvailability().catch( function( message ) {

  document.body.appendChild( WEBVR.getMessageContainer( message ) );

} );

//

var container;
var camera, scene, renderer;
var controller1, controller2;

var line;
var shapes = {};

var up = new THREE.Vector3( 0, 1, 0 );
var vector = new THREE.Vector3();

var vector1 = new THREE.Vector3();
var vector2 = new THREE.Vector3();
var vector3 = new THREE.Vector3();
var vector4 = new THREE.Vector3();

var point4 = new THREE.Vector3();
var point5 = new THREE.Vector3();

var controllerLog = 0;

init();
initGeometry();
//initSound():
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x872365 );

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 50 );
  scene.add( camera );


  var geometry = new THREE.PlaneGeometry( 4, 4 );
  var material = new THREE.MeshStandardMaterial( {
    color: 0x222222,
    roughness: 1.0,
    metalness: 0.0,
    transparent: true,
    opacity: 0.5
  } );

  var floor = new THREE.Mesh( geometry, material );
  floor.position.y = -2.5;
  floor.rotation.x = - Math.PI / 2;
  floor.receiveShadow = true;
  scene.add( floor );


  var grid = new THREE.GridHelper( 20, 40, 0x111111, 0x111111 );
  grid.position.y = -2.5;
  scene.add( grid );

  scene.add( new THREE.HemisphereLight( 0x888877, 0x777788 ) );

  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 6, 0 );
  light.castShadow = true;
  light.shadow.camera.top = 2;
  light.shadow.camera.bottom = -2;
  light.shadow.camera.right = 2;
  light.shadow.camera.left = -2;
  light.shadow.mapSize.set( 4096, 4096 );
  scene.add( light );

  // scene.add( new THREE.DirectionalLightHelper( light ) );
  // scene.add( new THREE.CameraHelper( light.shadow.camera ) );

  //

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  container.appendChild( renderer.domElement );

  renderer.vr.enabled = true;
  renderer.vr.standing = true;

  initControllers();

  createPanorama();



  WEBVR.getVRDisplay( function ( display ) {

    renderer.vr.setDevice( display );

    document.body.appendChild( WEBVR.getButton( display, renderer.domElement ) );

  } );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function initSound(){
// init audio here code in here
 sound = new SoundController();
}


function initControllers(){
  // controllers

  controller1 = new THREE.PaintViveController( 0 );
  controller1.standingMatrix = renderer.vr.getStandingMatrix();
  controller1.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
  controller1.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
  scene.add( controller1 );

  controller2 = new THREE.PaintViveController( 1 );
  controller2.standingMatrix = renderer.vr.getStandingMatrix();
  controller2.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
  controller2.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
  scene.add( controller2 );

  var loader = new THREE.OBJLoader();
  loader.setPath( '../models/vive-controller/' );
  loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {

    var loader = new THREE.TextureLoader();
    loader.setPath( '../models/vive-controller/' );

    var controller = object.children[ 0 ];
    controller.material.map = loader.load( 'onepointfive_texture.png' );
    controller.material.specularMap = loader.load( 'onepointfive_spec.png' );
    controller.castShadow = true;
    controller.receiveShadow = true;

    var pivot = new THREE.Mesh( new THREE.IcosahedronGeometry( 0.01, 2 ) );
    pivot.name = 'pivot';
    pivot.position.y = -0.016;
    pivot.position.z = -0.043;
    pivot.rotation.x = Math.PI / 5.5;
    controller.add( pivot );

    controller1.add( controller.clone() );

    pivot.material = pivot.material.clone();
    controller2.add( controller.clone() );
  });
}

function createPanorama() {

  var geometry = new THREE.SphereBufferGeometry( 49, 60, 40 );
  geometry.scale( - 1, 1, 1 );

  var material = new THREE.MeshBasicMaterial( {
    map: new THREE.TextureLoader().load( '../textures/south_bank_skate_park_small.jpg' )
  } );

  panorama = new THREE.Mesh( geometry, material );
  panorama.matrixAutoUpdate = false;
  scene.add( panorama );
}

function initGeometry() {

  var geometry = new THREE.BufferGeometry();

  var positions = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );
  positions.dynamic = true;
  geometry.addAttribute( 'position', positions );

  var normals = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );
  normals.dynamic = true;
  geometry.addAttribute( 'normal', normals );

  var colors = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );
  colors.dynamic = true;
  geometry.addAttribute( 'color', colors );

  geometry.drawRange.count = 0;

  var material = new THREE.MeshStandardMaterial( {
    roughness: 0.9,
    metalness: 0.0,
    vertexColors: THREE.VertexColors,
    side: THREE.DoubleSide
  } );

  line = new THREE.Mesh( geometry, material );
  line.frustumCulled = false;
  line.castShadow = true;
  line.receiveShadow = true;
  scene.add( line );

  // Shapes
  shapes[ 'tube' ] = getTubeShapes(1.0);
}

function getTubeShapes(size) {

  var PI2 = Math.PI * 2;

  var sides = 10;
  var array = [];
  var radius = 0.01 * size;
  for( var i = 0; i < sides; i ++ ){

    var angle = ( i / sides ) * PI2;
    array.push( new THREE.Vector3( Math.sin( angle ) * radius, Math.cos( angle ) * radius, 0 ) );
  }

  return array;
}


function stroke( controller, point1, point2, matrix1, matrix2 ) {

  var color = controller.getColor();

  var shapes = getTubeShapes( controller.getSize() );

  var geometry = line.geometry;
  var attributes = geometry.attributes;
  var count = geometry.drawRange.count;

  var positions = attributes.position.array;
  var normals = attributes.normal.array;
  var colors = attributes.color.array;

  for ( var j = 0, jl = shapes.length; j < jl; j ++ ) {

    var vertex1 = shapes[ j ];
    var vertex2 = shapes[ ( j + 1 ) % jl ];

    // positions
    vector1.copy( vertex1 );
    vector1.applyMatrix4( matrix2 );
    vector1.add( point2 );

    vector2.copy( vertex2 );
    vector2.applyMatrix4( matrix2 );
    vector2.add( point2 );

    vector3.copy( vertex2 );
    vector3.applyMatrix4( matrix1 );
    vector3.add( point1 );

    vector4.copy( vertex1 );
    vector4.applyMatrix4( matrix1 );
    vector4.add( point1 );

    vector1.toArray( positions, ( count + 0 ) * 3 );
    vector2.toArray( positions, ( count + 1 ) * 3 );
    vector4.toArray( positions, ( count + 2 ) * 3 );

    vector2.toArray( positions, ( count + 3 ) * 3 );
    vector3.toArray( positions, ( count + 4 ) * 3 );
    vector4.toArray( positions, ( count + 5 ) * 3 );

    // normals
    vector1.copy( vertex1 );
    vector1.applyMatrix4( matrix2 );
    vector1.normalize();

    vector2.copy( vertex2 );
    vector2.applyMatrix4( matrix2 );
    vector2.normalize();

    vector3.copy( vertex2 );
    vector3.applyMatrix4( matrix1 );
    vector3.normalize();

    vector4.copy( vertex1 );
    vector4.applyMatrix4( matrix1 );
    vector4.normalize();

    vector1.toArray( normals, ( count + 0 ) * 3 );
    vector2.toArray( normals, ( count + 1 ) * 3 );
    vector4.toArray( normals, ( count + 2 ) * 3 );

    vector2.toArray( normals, ( count + 3 ) * 3 );
    vector3.toArray( normals, ( count + 4 ) * 3 );
    vector4.toArray( normals, ( count + 5 ) * 3 );

    // colors
    color.toArray( colors, ( count + 0 ) * 3 );
    color.toArray( colors, ( count + 1 ) * 3 );
    color.toArray( colors, ( count + 2 ) * 3 );

    color.toArray( colors, ( count + 3 ) * 3 );
    color.toArray( colors, ( count + 4 ) * 3 );
    color.toArray( colors, ( count + 5 ) * 3 );

    count += 6;

  }

  geometry.drawRange.count = count;

}

function updateGeometry( start, end ) {

  if ( start === end ) return;

  var offset = start * 3;
  var count = ( end - start ) * 3;

  var geometry = line.geometry;
  var attributes = geometry.attributes;

  attributes.position.updateRange.offset = offset;
  attributes.position.updateRange.count = count;
  attributes.position.needsUpdate = true;

  attributes.normal.updateRange.offset = offset;
  attributes.normal.updateRange.count = count;
  attributes.normal.needsUpdate = true;

  attributes.color.updateRange.offset = offset;
  attributes.color.updateRange.count = count;
  attributes.color.needsUpdate = true;

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function handleController( controller ) {

  controller.update();

  if(controller && controllerLog == 1){
    console.log("controller", controller);
    controllerLog = 2;
  }

  var pivot = controller.getObjectByName( 'pivot' );

  if ( pivot ) {

    pivot.material.color.copy( controller.getColor() );
    pivot.scale.setScalar(controller.getSize());

    var matrix = pivot.matrixWorld;

    var point1 = controller.userData.points[ 0 ];
    var point2 = controller.userData.points[ 1 ];

    var matrix1 = controller.userData.matrices[ 0 ];
    var matrix2 = controller.userData.matrices[ 1 ];

    point1.setFromMatrixPosition( matrix );
    matrix1.lookAt( point2, point1, up );

    if ( controller.getButtonState( 'trigger' ) ) {

      stroke( controller, point1, point2, matrix1, matrix2 );
      if(controllerLog == 0)  controllerLog = 1;

    }

    point2.copy( point1 );
    matrix2.copy( matrix1 );

  }

}

function animate() {

  renderer.animate( render );

}

function render() {

  var count = line.geometry.drawRange.count;

  handleController( controller1 );
  handleController( controller2 );

  updateGeometry( count, line.geometry.drawRange.count );

  renderer.render( scene, camera );

}
