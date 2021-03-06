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
    //creates the arrays for the grid with a pattern of values
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
  //will use this more later on, jsut a class for sound files
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
    //logic by Aric Leather //calculates the position of the mouse based on boundary of button
    this.mouse = (Math.abs(mouseX - this.x) <= this.width / 2 && Math.abs(mouseY - this.y) <= this.height / 2);
  }

  displayRect(){
    //helped by Aric Leather//displays the button and is the actual button pressing
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
  //visual slider when barPlayState
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
}

class Keyboard{
  constructor(){
    this.whiteKey;
    this.blackKey;
  }

  draw(){
  // draws a piano keyboard
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


















let barSelected = 0;//state of which pattern selected
let barPatterns = [];

let hat = new Instrument();
let clap = new Instrument();
let ride = new Instrument();
let snare = new Instrument();
let kick = new Instrument();
let g808 = new Instrument();

let bars;//bar grid
let barCell = new Cell(15, 40, 6, 32);

let sheet;
let sheetCell = new Cell(20, 70, 8, 65);

let pushed = 50;//cotton on side
let underBarCotton = 60;
let extendedPattern = 1369;
let bottomPushed = 70;
let sliderCotton = 110;
let divider = 10;

let sheetPlayState = false;
let barPlayState = false;
let instrument;//array for soundfiles
let instrumentLabel = ['Hat', 'Clap', 'Ride', 'Snare', 'Kick', '808'];//labels on the side of bar
let smallBar = new SlidingBar(3);//bar's bar
let bigBar = new SlidingBar((sheetCell.width/barCell.gridX)*0.1)//sheet's bar

let slider = [];//array of sliders for Instruments
// let lastClicked;

let keyboard = new Keyboard();
let keyboardKeys = ['q','2','w','3','e','r','5','t','6','y','7','u',
                    'z','s','x','d','c','v','g','b','h','n','j','m'];
let keyboardSounds;

let barVolumeReset = new Button(50,50,50, 583, barCell.gridY*barCell.height + (underBarCotton/2), 80, 34, function(){
  //resets the value of all the sliders to 0.5(middle)
  for (let i = 0; i < 6; i++){
    slider[i].value(0.5);
  }
});

let playBar = new Button(50,50,50, 30, barCell.gridY*barCell.height + (underBarCotton/2), 40, 40, function(){
  //changes the play state
  if (barPlayState){
    barPlayState = false;
  }
  else{
    barPlayState = true;
  }
});

let barReset = new Button(50,50,50, 90, barCell.gridY*barCell.height + (underBarCotton/2), 50, 30, function(){
  //resets the bar grid to original
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

let tempoUp = new Button(55,55,55, 500, barCell.gridY*barCell.height + (underBarCotton/2)-10, 24, 14, function(){
  //increases tempo
  smallBar.tempo += 0.5;
});

let tempoDown = new Button(55,55,55, 500, barCell.gridY*barCell.height + (underBarCotton/2)+10, 24, 14, function(){
  //decreases the tempo
  if (smallBar.tempo > 0){
    smallBar.tempo -= 0.5;
  }
});

let playSheet = new Button(55,55,55, 1432, 370, 70, 70, function(){
  //changes the play state of teh sheet
  if (sheetPlayState){
    sheetPlayState = false;
  }
  else{
    sheetPlayState = true;
  }
});




let addBarPattern = new Button(55,55,55, 670, 255, 30, 46, function() {
  //pushes the current bar pattern to the array of patterns
  barPatterns.push([]);
    for(let i = 0; i < 6; i++) {
    barPatterns[barPatterns.length - 1].push(bars[i].slice());
  }
});

let saveBarPattern = new Button(55,55,55, 710, 255, 30, 46, function() {
  //saves curretn bar pattern and replaces the pattern depending on the selected bar pattern
  barPatterns.splice(barSelected, 1, bars);
});

let barPatternUp = new Button(55,55,55, 870, 242, 30, 20, function() {
  //replaces the current bar pattern with the selected one
  if (barPatterns.length != 0){
    if (barSelected < barPatterns.length - 1){
      barSelected++; 
    }
    bars = [];
    for(let i = 0; i < 6; i++) {
      bars.push(barPatterns[barSelected][i].slice());
    }
  }
});

let barPatternDown = new Button(55,55,55, 870, 268, 30, 20, function() {
  //replaces the current bar pattern with the selected one
  if (barPatterns.length != 0){
    if (barSelected > 0){
      barSelected--; 
    };
    bars = [];
    for(let i = 0; i < 6; i++) {
      bars.push(barPatterns[barSelected][i].slice());
    }
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

  instrument = [hat.sound, clap.sound, ride.sound, snare.sound, kick.sound, g808.sound];
  keyboardSounds = [];
  bars = barCell.createGrid();
  sheet = sheetCell.createGrid();

  strokeWeight(0.2);
  stroke('white');

  instrumentSliders();
}

function draw() {
  stuffings();//background colours

  push();
  //beat sheet with play state and translation
    translate(pushed, 0);
    drawBarGrid(barCell.gridY, barCell.gridX);
    if (barPlayState){
      barPlay();
      smallBar.move(barCell.width*barCell.gridX, barCell.height*barCell.gridY);
    }
    else{
      smallBar.xcord = 0;
    }
    barHighlight();
  pop();


  instrumentLabels();
  instrumentVolumeChanger();

  push();
  //overall music sheet with play state and translation
    translate(bottomPushed, barCell.gridY*barCell.height + underBarCotton + divider);
    stroke('grey');
    drawSheetGrid(sheetCell.gridY, sheetCell.gridX);
    if (sheetPlayState){
      sheetPlay();
      bigBar.move(sheetCell.width*sheetCell.gridX, sheetCell.height*sheetCell.gridY);
    }
    else{
      bigBar.xcord = 0;
    }
    sheetHightlight();
  pop();

  push();
  //various buttons
    playBar.calcMouse();
    playBar.displayRect();
    barVolumeReset.calcMouse();
    barVolumeReset.displayRect();
    barReset.calcMouse();
    barReset.displayRect();
    tempoUp.calcMouse();
    tempoUp.displayRect();
    tempoDown.calcMouse();
    tempoDown.displayRect();
    playSheet.calcMouse();
    playSheet.displayRect();
    barPatternButtons();
  pop();

  push();
  //draws keyboard
    translate(pushed+barCell.gridX*barCell.width+sliderCotton + 5, 5);
    keyboard.draw();
  pop();

  push();
  //text
    fill(255);
    textSize(22);
    text("Pattern " + (barSelected + 1), 790, 265);

    text("reset", 580, 275);

    textSize(11);
    text("play/ pause", 8, 260, 50, 50);

    text("reset", 90, 275);

    text("+", 500, 265);
    text("-", 500, 285);

    text("add", 670, 260);
    text("save", 710, 260);

    text("+", 870, 250);
    text("-", 870, 270);

    text("play/ pause", 1410, 350, 50, 50);
  pop();
}























function barPatternButtons(){
  //all the button fucntions for the bar patterns
  addBarPattern.calcMouse();
  addBarPattern.displayRect();
  barPatternUp.calcMouse();
  barPatternUp.displayRect();
  barPatternDown.calcMouse();
  barPatternDown.displayRect();
  saveBarPattern.calcMouse();
  saveBarPattern.displayRect();
}

function drawBarGrid(y, x){
  //draws the grid based on array, with alternating values
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
  //draws the grid based on array, with alternating values
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

function barPlay(){
  //plays the sound file at given point of sliding bar
  let xVal = smallBar.xcord / barCell.width;
  for (let i = 0; i < barCell.gridY; i++){
    if (bars[i][xVal] !== 0 && bars[i][xVal] !== 1 && xVal % 1 === 0){
      bars[i][xVal].play(); 
    }
  }
}

function sheetPlay(){
  //plays the sound file at given point of sliding bar//doesnt work... but almost got it...
  let xVal = bigBar.xcord / (sheetCell.width/barCell.gridX);
  let sXVal = bigBar.xcord / sheetCell.width;
  for (let i = 0; i < sheetCell.gridY; i++){
    if (sheet[i][sXVal] !== 0 && sheet[i][sXVal] !== 1 && sXVal % 1 === 0){
      for (let z = 0; z < barCell.gridY; z++){
        if (sheet[i][sXVal][z][xVal] !== 0 && sheet[i][sXVal][z][xVal] !== 1 && xVal % 1 === 0){
          sheet[i][sXVal][z][xVal].play();
        }
      }
    }
  }
}

function barHighlight(){
  //highlights the rect your mouse hovers over in the bar grid
  let barYVal = floor(mouseY / barCell.height);
  let barXVal = floor((mouseX - pushed) / barCell.width);

  if (mouseX > pushed && mouseX < barCell.width*barCell.gridX + pushed && mouseY > 0 && mouseY < barCell.height*barCell.gridY){
    if (bars[barYVal][barXVal] === 0 || bars[barYVal][barXVal] === 1){
      fill(60,60,60);
      rect(barXVal*barCell.width, barYVal*barCell.height, barCell.width, barCell.height);
    }
  }
}

function sheetHightlight(){
    //highlights the rect your mouse hovers over in the sheet grid
  let sheetYVal = floor((mouseY - (barCell.gridY*barCell.height + underBarCotton + divider)) / sheetCell.height); 
  let sheetXVal = floor((mouseX - bottomPushed) / sheetCell.width);

  if (mouseX > bottomPushed && mouseX < (sheetCell.width*sheetCell.gridX + bottomPushed) && mouseY > (barCell.gridY*barCell.height + underBarCotton + divider) && mouseY < (barCell.gridY*barCell.height + underBarCotton + divider + sheetCell.height*sheetCell.gridY)){
    if (sheet[sheetYVal][sheetXVal] === 0 || sheet[sheetYVal][sheetXVal] === 1){
      fill(60,60,60);
      rect(sheetXVal*sheetCell.width, sheetYVal*sheetCell.height, sheetCell.width, sheetCell.height)
    }
  }
}

function mouseClicked(){
  //change value in bar array based on location clicked
  let barYVal = floor(mouseY / barCell.height);
  let barXVal = floor((mouseX - pushed) / barCell.width);

  if (mouseX > pushed && mouseX < barCell.width*barCell.gridX + pushed && mouseY > 0 && mouseY < barCell.height*barCell.gridY){
    if (bars[barYVal][barXVal] === 0 || bars[barYVal][barXVal] === 1){
      bars[barYVal][barXVal] = instrument[barYVal];
    }
    else if ((barXVal % 8) < 4){
      bars[barYVal][barXVal] = 0;
    }
    else{
      bars[barYVal][barXVal] = 1;
    }
  }

  //change value in sheet array based on location clicked, only if there is something in the array selected, as it will crash if it is undefined
  let sheetYVal = floor((mouseY - (barCell.gridY*barCell.height + underBarCotton + divider)) / sheetCell.height); 
  let sheetXVal = floor((mouseX - bottomPushed) / sheetCell.width);

  if (mouseX > bottomPushed && mouseX < (sheetCell.width*sheetCell.gridX + bottomPushed) && mouseY > (barCell.gridY*barCell.height + underBarCotton + divider) && mouseY < (barCell.gridY*barCell.height + underBarCotton + divider + sheetCell.height*sheetCell.gridY)){
    if (sheet[sheetYVal][sheetXVal] === 0 || sheet[sheetYVal][sheetXVal] === 1){
      if  (barPatterns[barSelected].length > 1){
        sheet[sheetYVal][sheetXVal] = barPatterns[barSelected];
      }
    }
    else if ((sheetXVal % 8) < 4){
      sheet[sheetYVal][sheetXVal] = 0;
    }
    else{
      sheet[sheetYVal][sheetXVal] = 1;
    }
  }

  // // returns last clicked instrument
  // if (mouseX > pushed && mouseX < barCell.width*barCell.gridX && mouseY > 0 && mouseY < barCell.height*barCell.gridY){
  //   lastClicked = instrument[barYVal];
  //   return lastClicked;
  // }
}

function keyTyped(){
  //space key sets position of slider
  if (key === " "){
    smallBar.xcord = mouseX - pushed;
  }
  if (keyboardKeys.includes(key)){
    keyboardSounds[keyboardKeys.indexOf(key)].play();
  }
}

function stuffings(){
  //design stuff refer to map(David has it)

  fill(33,33,33);//under the bars
  rect(0, barCell.gridY*barCell.height, barCell.gridX*barCell.width + pushed, underBarCotton);
  fill(232,221,203);//instrument labels
  rect(0, 0, pushed, barCell.height*barCell.gridY);
  fill(33, 33, 33);//sheet
  rect(0, barCell.height*barCell.gridY + underBarCotton, barCell.gridX*barCell.width + pushed + extendedPattern, height - barCell.height*barCell.gridY - underBarCotton);
  fill(232,221,203);//sheet labels
  rect(0, barCell.height*barCell.gridY + underBarCotton, bottomPushed, height - underBarCotton + barCell.height*barCell.gridY);
  fill(33,33,33);//slider cotton
  rect(pushed + barCell.width*barCell.gridX, 0, sliderCotton, barCell.height*barCell.gridY+underBarCotton);
  fill(232,221,203);//behind keyboard
  rect(pushed+barCell.gridX*barCell.width+sliderCotton, 0, 850, 210);
  fill(33,33,33);//pattern controls
  rect(pushed+barCell.gridX*barCell.width+sliderCotton, 210, 850, barCell.height*barCell.gridY + underBarCotton - 210);
  fill(33,33,33);//divider
  rect(0, barCell.height*barCell.gridY + underBarCotton, extendedPattern, divider);
  fill(55,55,55)//behind barpattern label
  rect(735, 232, 110, 46);
}

function instrumentLabels(){
  //label for the Instruments in the bar
  textSize(13);
  textAlign(CENTER);
  fill(0);
  for (let i = 0; i < instrumentLabel.length; i++){
    text(instrumentLabel[i], pushed/2, (barCell.height/2)+barCell.height*i);
  }
}

function instrumentSliders(){
  //creates individual sliders for each Instrument
  for (let i = 0; i < 6; i++){
    slider.push(i);
    slider[i] = createSlider(0, 1, 0.5, 0.01);
    slider[i].position(pushed + barCell.width*barCell.gridX + 3, (barCell.height/2 - 13)+barCell.height*i);
    slider[i].style('width', '100px');
  }
}

function instrumentVolumeChanger(){
  //actually changes the volume depending on value from slider
  for (let i = 0; i < 6; i++){
    instrument[i].setVolume(slider[i].value());
  }
}