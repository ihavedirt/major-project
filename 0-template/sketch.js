// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let wave;
let playing = false;
let slider;

function setup() {
  createCanvas(windowWidth, windowHeight);
  wave = new p5.Oscillator();
  slider = createSlider(100, 1000, 440);
  slider.position(100, 100);
  slider.style('width', '120px');

  wave.setType('sine');
  wave.start();
  wave.amp(0);
  wave.freq(440);
}

function draw() {
  background(220);
  console.log(key);
  wave.freq(slider.value())
}

function mouseClicked(){
  if (mouseY > height/2){
    if (!playing){
      wave.amp(0.3, 0.5);
      playing = true;
    }
    else{
      wave.amp(0, 0.5);
      playing = false;
    }
  }
}