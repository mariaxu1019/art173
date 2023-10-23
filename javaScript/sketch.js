let mic;
let vol;
let phase = 0;
let zoff = 0;

let noiseCircles = [];
let newFoods = [];

let clearing = false;

let canvas;
let foodPG;

let buttonClear;
let buttonAddACreature;
let buttonKillACreature;
let buttonRestart;

let redSlider, greenSlider, blueSlider;

let disableDrawing = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");

  foodPG = createGraphics(windowWidth, windowHeight);
  foodPG.parent("sketch-container");

  mic = new p5.AudioIn();
  mic.start();

  for (let i = 0; i < 19; i++) {
    let zoffUpdate1 = random(0.001, 0.0001);
    let noiseMax1 = random(0, 1.5);

    noiseCircles[i] = new NoiseCircle(random(width), random(height),
      random(0.2, 1.2),
      zoffUpdate1, noiseMax1);
  }
  addGUI();

}

function draw() {
  foodPG.clear();
  foodPG.background(0, 0, 0, 0);
  vol = mic.getLevel() * 7;
  
  if (frameCount % 2 == 0)randomPoints();

  for (let i = 0; i < noiseCircles.length; i++) {
    noiseCircles[i].Draw(vol);
    noiseCircles[i].crawling();
    noiseCircles[i].bouncing();

    let currentSize = noiseCircles[i].br;
    let hungryThreshold = 2;
    let fullThreshold = 5;

    if (currentSize < hungryThreshold) {
    } else if (currentSize >= fullThreshold) {
      noiseCircles[i].changeState("full");
    }

    if (noiseCircles[i].creatureState == "full") {
      if (currentSize > noiseCircles[i].originalSize) {

        noiseCircles[i].br -= 0.1;
        noiseCircles[i].changeColor(color(208, 184, 209));
        noiseCircles[i].crawling();
      }
    }

    for (let f = 0; f < newFoods.length; f++) {

      clearing = false;
      if (!clearing && noiseCircles[i].findFood(newFoods[f].location.x, newFoods[f].location.y)) {
        noiseCircles[i].br += 0.1; 
        if (noiseCircles[i].creatureState == "full") {
          break;
        }
      }
      newFoods[f].display();
    }

    let overlapping = false;
    for (let j = 0; j < noiseCircles.length; j++) {
      if (i != j) {
        if (noiseCircles[j] != noiseCircles[i] && noiseCircles[i].communication(noiseCircles[j])) {
          overlapping = true;
          stroke(255, 255, 200, 170);
          strokeWeight(4);
          line(noiseCircles[i].location.x, noiseCircles[i].location.y,
            noiseCircles[j].location.x, noiseCircles[j].location.y);
        }
      }
      if (overlapping) {
        noiseCircles[i].changeColor(color(255, 0, 127, 30));
        noiseCircles[i].changeCoreColor(color(255, 131, 0));
      } else {
        noiseCircles[i].changeColor(color(208, 184, 209, 25));
        noiseCircles[i].changeCoreColor(color(144, 49, 130));
      }
    }
  }

  image(foodPG, 0, 0);
  
}

function mousePressed() {
  if (!disableDrawing) {
    pressOnCanvas();
  }
}

function pressOnCanvas() {
  if (mouseX < width && mouseY < height) {
    newFood = new Food(mouseX, mouseY, random(10, 20), foodPG);
    newFoods.push(newFood);
    clearing = false;
  }
}

function addGUI() {
  buttonAddACreature = new Button("create", buttonAddACreaturePress);
  buttonKillACreature = new Button("kill", buttonKillACreaturePress);
  buttonRestart = new Button("restart", buttonRestartPress);
}

