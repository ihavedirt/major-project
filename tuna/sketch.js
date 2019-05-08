// Tuna
// David Baik
// April 28th, 2019
//
// Extra for Experts:
// made a grid with a grid inside it, working with mouse interactions(triple nested loop?)
// moving indicator bar that plays sound based on pattern input 
// classes to simplify code
// added slider to control volume
// used various arrays and for loops to simplify long codes

// colour palette https://www.colourlovers.com/palette/292482/Terra

//people and activities
//

class Cell {
  constructor(width, height, gridY, gridX){
    this.width = width;//individual cell width
    this.height = height;//individual cell height
    this.gridY = gridY;//number of cells on Y
    this.gridX = gridX;//number of cells on X
    this.note = gridX / 4;//time signature(4 4)
  }

  createGrid(){
    //creates the array
    let array = [];
    for (let i = 0; i < this.gridY; i++){
      let rows = [];
      for (let j = 0; j < this.note; j++){
        for (let k = 0; k < 4; k++){
          rows.push(0);
        }
        for (let l = 0; l < 4; l++){
          rows.push(1);
        }
      }
      array.push(rows);
    }
    return array;
  }
}

class Instrument {
  //will use this more later on
  constructor(){
    this.sound;
  }
}


class Button {
  constructor(colour1, colour2, colour3, x, y, width, height, clickedFunction){
    this.colour1 = colour1;
    this.colour2 = colour2;
    this.colour3 = colour3;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.clicked = clickedFunction;

    this.mouse;
    this.alreadyClicked = false;
  }

  calcMouse() {
    //logic by Aric Leather
    this.mouse = (Math.abs(mouseX - this.x) <= this.width / 2 && Math.abs(mouseY - this.y) <= this.height / 2);
  }

  displayRect(){
    //helped by Aric Leather
    this.calcMouse();
    if(this.mouse && mouseIsPressed && !this.alreadyClicked) {
      this.clicked();
      this.alreadyClicked = true;
    }
    if(!mouseIsPressed) {
      this.alreadyClicked = false;
    }
    rectMode(CENTER);
    fill(this.colour1, this.colour2, this.colour3);
    rect(this.x, this.y, this.width, this.height);
  }
}

class SlidingBar {
  constructor(tempo){
    this.xcord = 0;
    this.tempo = tempo;
  }

  move(windWidth, windHeight){
  //visual slider when playState
    push();
    strokeWeight(1);
    if (this.xcord < windWidth){
      this.xcord+= this.tempo;
      line(this.xcord, 0, this.xcord, windHeight);
    } 
    else{
      this.xcord = 0;

    }
    if (this.xcord < 0){
      this.xcord = 0;
    }
    pop();
  }

  barPlay(){
    //plays the sound file at given point of sliding bar
    let xVal = this.xcord / barCell.width;
    for (let i = 0; i < barCell.gridY; i++){
      if (bars[i][xVal] !== 0 && bars[i][xVal] !== 1 && xVal % 1 === 0){
        bars[i][xVal].play(); 
      }
    }
  }
}

class Keyboard{
  constructor(){
    this.whiteKey;
    this.blackKey;
  }

  draw(){
    fill(255);
    stroke(33,33,33);
    for (let i = 0; i < 14; i++){
      rect(i*60, 0, 60, 200,0 ,0, 4, 4);
    }
    fill(33,33,33);
    for (let j = 0; j < 13; j++){
      if (j != 2 && j != 6 && j != 9){
        rect(40+j*60, 0, 40, 150, 0, 0, 5, 5);
      }
    }
  }
}




















let hat = new Instrument();
let clap = new Instrument();
let ride = new Instrument();
let snare = new Instrument();
let kick = new Instrument();
let g808 = new Instrument();

let bars;//bar grid
let barCell = new Cell(15, 40, 6, 32);

let sheet;
let sheetCell = new Cell(20, 70, 10, 65);

let pushed = 50;//cotton on side
let underBarDowny = 60;
let extendedPattern = 1500;
let bottomPushed = 70;
let sliderCotton = 110;
let divider = 10;

let playState = false;
let inst;//array for soundfiles
let instLabel = ['Hat', 'Clap', 'Ride', 'Snare', 'Kick', '808'];//labels on the side of bar
let smallBar = new SlidingBar(3);//bar's bar
let tempo = 3;

let slider = [];//array of sliders for instruments
// let lastClicked;

let keyboard = new Keyboard();

let barVolumeReset = new Button(50,50,50, 583, barCell.gridY*barCell.height + (underBarDowny/2), 80, 34, function(){
  for (let i = 0; i < 6; i++){
    slider[i].value(0.5);
  }
});

let playButton = new Button(50,50,50, 30, barCell.gridY*barCell.height + (underBarDowny/2), 40, 40, function(){
  if (playState){
    playState = false;
  }
  else{
    playState = true;
  }
});

let barReset = new Button(50,50,50, 90, barCell.gridY*barCell.height + (underBarDowny/2), 50, 30, function(){
  for (let i = 0; i < barCell.gridY; i++){
    for (let j = 0; j < barCell.note; j++){
      for (let k = 0; k < 4; k++){
        bars[i].shift();
        bars[i].push(0);
      }
      for (let l = 0; l < 4; l++){
        bars[i].shift();
        bars[i].push(1);
      }
    }
  }
});

let tempoUp = new Button(55,55,55, 500, barCell.gridY*barCell.height + (underBarDowny/2)-10, 24, 14, function(){
  smallBar.tempo += 0.5;
});

let tempoDown = new Button(55,55,55, 500, barCell.gridY*barCell.height + (underBarDowny/2)+10, 24, 14, function(){
  if (smallBar.tempo > 0){
    smallBar.tempo -= 0.5;
  }
});




















function preload(){
  hat.sound = loadSound('assets/hat.wav');
  clap.sound = loadSound('assets/clap.wav');
  ride.sound = loadSound('assets/ride.wav');
  snare.sound = loadSound('assets/snare.wav');
  kick.sound = loadSound('assets/kick.wav');
  g808.sound = loadSound('assets/808.wav');
}

function setup() {
  frameRate(100);
  createCanvas(windowWidth, windowHeight);

  inst = [hat.sound, clap.sound, ride.sound, snare.sound, kick.sound, g808.sound];
  bars = barCell.createGrid();
  sheet = sheetCell.createGrid();

  strokeWeight(0.2);
  stroke('white');

  instSliders();

  textSize(18);
  text('Click in the bar to add sound to pattern        Click spacebar to set where to play        Play/pause button is box at bottom left        button below sliders resets volume', 700, 100, 350);
}

function draw() {
  stuffings();

  push();
    translate(pushed, 0);
    drawBarGrid(barCell.gridY, barCell.gridX);
    if (playState){
      smallBar.barPlay();
      smallBar.move(barCell.width*barCell.gridX, barCell.height*barCell.gridY);
    }
    else{
      smallBar.xcord = 0;
    }
    highlight();
  pop();


  instLabels();
  instVolumeChanger();

  push();
    translate(bottomPushed, barCell.gridY*barCell.height + underBarDowny + divider);
    stroke('grey');
    drawSheetGrid(sheetCell.gridY, sheetCell.gridX);
  pop();

  push();
    playButton.calcMouse();
    playButton.displayRect();
    barVolumeReset.calcMouse();
    barVolumeReset.displayRect();
    barReset.calcMouse();
    barReset.displayRect();
    tempoUp.calcMouse();
    tempoUp.displayRect();
    tempoDown.calcMouse();
    tempoDown.displayRect();
  pop();

  push();
  translate(pushed+barCell.gridX*barCell.width+sliderCotton + 5, 5);
  keyboard.draw();
  pop();

}

























function drawBarGrid(y, x){
  //draws the grid based on array, with alternating colours
  for (let i = 0; i < y; i++){
    for (let j = 0; j < x; j++){
      if (bars[i][j] === 0){
        //dark
        fill(33, 33, 33);
      }
      else if(bars[i][j] === 1){
        //light
        fill(50, 50, 50);
      }
      else{
        fill(183,178,171);
      }
      rect(j*barCell.width, i*barCell.height, barCell.width, barCell.height);
    }
  }
}

function drawSheetGrid(y, x){
  //draws the grid based on array, with alternating colours
  for (let i = 0; i < y; i++){
    for (let j = 0; j < x; j++){
      if (sheet[i][j] === 0){
        //dark
        fill(47, 47, 47);
      }
      else if(sheet[i][j] === 1){
        //light
        fill(50, 50, 50);
      }
      else{
        fill(183,178,171);
      }
      rect(j*sheetCell.width, i*sheetCell.height, sheetCell.width, sheetCell.height);
    }
  }
}

function highlight(){
  let yVal = floor(mouseY / barCell.height);
  let xVal = floor((mouseX - pushed) / barCell.width);

  if (mouseX > pushed && mouseX < barCell.width*barCell.gridX + pushed && mouseY > 0 && mouseY < barCell.height*barCell.gridY){
    if (bars[yVal][xVal] === 0 || bars[yVal][xVal] === 1){
      fill(60,60,60);
      rect(xVal*barCell.width, yVal*barCell.height, barCell.width, barCell.height);
    }
  }
}

function mouseClicked(){
  //change value in array based on location clicked
  let yVal = floor(mouseY / barCell.height);
  let xVal = floor((mouseX - pushed) / barCell.width);

  if (mouseX > pushed && mouseX < barCell.width*barCell.gridX + pushed && mouseY > 0 && mouseY < barCell.height*barCell.gridY){
    if (bars[yVal][xVal] === 0 || bars[yVal][xVal] === 1){
      bars[yVal][xVal] = inst[yVal];
    }
    else if ((xVal % 8) < 4){
      bars[yVal][xVal] = 0;
    }
    else{
      bars[yVal][xVal] = 1;
    }
  }

  // // returns last clicked inst
  // if (mouseX > pushed && mouseX < barCell.width*barCell.gridX && mouseY > 0 && mouseY < barCell.height*barCell.gridY){
  //   lastClicked = inst[yVal];
  //   return lastClicked;
  // }
}

function keyTyped(){
  //space key sets position of slider
  if (key === " "){
    smallBar.xcord = mouseX - pushed;
  }
}

function stuffings(){
  //design stuff refer to map(David has it)

  fill(33,33,33);//under the bars
  rect(0, barCell.gridY*barCell.height, barCell.gridX*barCell.width + pushed, underBarDowny);
  fill(232,221,203);//left most
  rect(0, 0, pushed, barCell.height*barCell.gridY);
  fill(50, 50, 50);// butt
  rect(0, barCell.height*barCell.gridY + underBarDowny, barCell.gridX*barCell.width + pushed + extendedPattern, height - barCell.height*barCell.gridY);
  fill(232,221,203);//left most bottom
  rect(0, barCell.height*barCell.gridY + underBarDowny, bottomPushed, height - underBarDowny + barCell.height*barCell.gridY);
  fill(33,33,33);//slider cotton
  rect(pushed + barCell.width*barCell.gridX, 0, sliderCotton, barCell.height*barCell.gridY+underBarDowny);
  fill(33,33,33);// low cotton
  rect(0, barCell.height*barCell.gridY + underBarDowny, barCell.gridX*barCell.width + pushed + extendedPattern, divider);
  fill(232,221,203);//under keyboard
  rect(pushed+barCell.gridX*barCell.width+sliderCotton, 0, 850, 210);
}

function instLabels(){
  //label for the instruments in the bar
  textSize(13);
  textAlign(CENTER);
  fill(0);
  for (let i = 0; i < instLabel.length; i++){
    text(instLabel[i], pushed/2, (barCell.height/2)+barCell.height*i);
  }
}

function instSliders(){
  //creates individual sliders for each instrument
  for (let i = 0; i < 6; i++){
    slider.push(i);
    slider[i] = createSlider(0, 1, 0.5, 0.01);
    slider[i].position(pushed + barCell.width*barCell.gridX + 3, (barCell.height/2 - 13)+barCell.height*i);
    slider[i].style('width', '100px');
  }
}

function instVolumeChanger(){
  //actually changes the volume depending on value from slider
  for (let i = 0; i < 6; i++){
    inst[i].setVolume(slider[i].value());
  }
}