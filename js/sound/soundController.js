
  // audio stuff

SoundController = function ( id ) {

  // create new context
  const context = new window.AudioContext;

  // set sound source
  const soundSource = context.createPanner();
  // set intital position of sound
  //new THREE.Vector3( 0, 0, 5 )
  setSource( 0, 0, 5);


function setSource(x,y,z) {
  soundSource.setPosition(x,y,z);
}

// create a play laser function
function playLaser() {

  // create an oscillator
  const laser = context.createOscillator();

  // set our frequency value - play with this later!
  laser.frequency.value = 500;

  // set our osciallator type - can be sine, square, triangle, sawtooth
  laser.type = 'sine';

  // drop the frequency when it starts
  //laser.frequency.exponentialRampToValueAtTime(10, context.currentTime+10);

  // we need a gain node!
  laserGain = context.createGain();

  // make sure gain is 1 when we start
  laserGain.gain.setValueAtTime(1, context.currentTime);

  // drop the volume when it starts
  laserGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime+9.9);

  // connect our audio graph
  laser.connect(laserGain).connect(context.destination);

  // set our start and stop times
  laser.start(context.currentTime);
  laser.stop(context.currentTime+10);

}

}
