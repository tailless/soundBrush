
// audio stuff

SoundController = function ( id ) {

  var startPosX, startPosY, startPosZ  = 0 ;
  var playing = false;

  // create new context
  const context = new window.AudioContext;

  // set sound source
  const soundSource = context.createPanner();
  var listener = context.listener;
  // set intital position of sound
  //new THREE.Vector3( 0, 0, 5 )
  setNoiseSource( 0, 0, 5);




  function setNoiseSource(x,y,z) {
    soundSource.setPosition(x,y,z);
  }

  function changeFreq(val){
    // changing the color modifies the frequency the noise
    // what are the limits for frequency ? 1-1500 ?
    // calc the distance..!
    noise.frequency.value = val;
  }


  function startNoise(){
    console.log("start noise");
    noise = context.createOscillator();
    // set our frequency value - play with this later!
    noise.frequency.value = 500;

    // set our osciallator type - can be sine, square, triangle, sawtooth
    noise.type = 'sine';

    noise.connect(soundSource).connect(context.destination);
    noise.start(context.currentTime);

    playing  = true;
  }


function play(sourcePos, listnerPos, color, volume){
  if(!playing)  startNoise();

//  soundSource.setPosition(sourcePos.x,sourcePos.y, sourcePos.z);
//  listener.setPosition(listnerPos.x,listnerPos.y,listnerPos.z);
  var freq = 500 + Math.abs(( sourcePos.x * 10)  * (sourcePos.y * 10 ) * ( sourcePos.z* 10 ));
    //(color.r * 10) *  ( color.g * 10) * (color.b * 10);

  console.log("freq", freq );
   if(volume) noise.frequency.value = freq ;
  //if(volume) noise.frequency.value = volume;
}

function stop(){
  console.log("stop noise");
  // stop the noise
  if( playing) noise.stop();
  //  this.removeEventListener("mousemove", draw);
  playing = false;

};


/*function playNoise(x,y,z){
if(!playing) return;
//  console.log("draw", (evt.clientX-startPosX)/2, (evt.clientY-startPosY)/2 );

//  cx.lineTo(evt.clientX, evt.clientY);
//  cx.stroke();



// re-set sound source
soundSource.setPosition(x/2, y/2, z/2);
// re-set sound source
//soundSource.setPosition((evt.clientX-startPosX)/10, (evt.clientY-startPosY)/10, (evt.clientY-startPosY)/10);
};*/

return {
  play:play,
  stop:stop
};
}
