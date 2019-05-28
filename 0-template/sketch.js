// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// let wave;
// let playing = false;
// let slider;
// let env;

// let mySound;

// let keys = ['z','x','c','v','b','n','m'];

let barPatterns = new Map();
let bars = [];

function preload(){
  // mySound = loadSound('assets/a-key.wav')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  barPatterns.set('1', [1,2,3]);
  // env = new p5.Env();
  // wave = new p5.Oscillator();

  // slider = createSlider(100, 1000, 440);
  // slider.position(100, 100);
  // slider.style('width', '120px');

  // wave.setType('sine');
  // wave.amp(0.1, 0.05);
  // wave.freq(440);
  // wave.connect(mySound);
  bars.push(barPatterns.get('1'))
}

function draw() {
  background(220);
  // mySound.freq(slider.value())
  // console.log(barPatterns.get('1'));
}

function mouseClicked(){
  if (mouseY > height/2){
    mySound.play();
  }
}

function keyTyped(){
  if (keys.indexOf(key) > -1){
    console.log(keys.indexOf(key));
  }
}

