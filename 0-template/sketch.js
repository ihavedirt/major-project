// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let wave;
let playing = false;
let slider;
let env;

let keys = ['z','x','c','v','b','n','m'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  env = new p5.Env();
  wave = new p5.Oscillator();

  slider = createSlider(100, 1000, 440);
  slider.position(100, 100);
  slider.style('width', '120px');

  env.setADSR(0.001, 0.5, 0, 0.01);
  env.setRange(1, 0);

  wave.setType('sine');
  wave.start();
  wave.amp(env);
  wave.freq(440);
}

function draw() {
  background(220);
  console.log(key);
  wave.freq(slider.value())
}

function mouseClicked(){
  if (mouseY > height/2){
    env.play();
  }
}

function keyTyped(){
  if (keys.indexOf(key) > -1){
    console.log(keys.indexOf(key));
  }
}