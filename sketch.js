let numAnts = 70; // this controls the number of ants on board
let ants = []; // this holds the ants
let isMousePressed = false; // this is to place cookie on board
let id = 0;


function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
  textFont('Georgia');
  translate(250, 250);
  
  // populate ants array
  for(let i = 0; i < numAnts; i++){
    ant = new Ant(random(0, height), random(0, width), random(4,5), random(-10000, 10000));
    ants.push(ant);
  }
}

function draw() {
  // boolean variable to form chess board pattern
    background("#DEB887");
    let on = false;
    // draw background as chess board
    for (let i = 0; i < 500; i += 50) {
        for (let j = 0; j < 500; j += 50) {
            if (on) {
                push();
                translate(i, j);
                noStroke();
                fill("#BE6530");
                square(0, 0, 50);
                pop();
                on = false;
            } else {
                on = true;
            }
        }
        if (on) {
            on = false;
        } else {
            on = true;
        }
    }
  // if mouse is pressed then draw cookie at mouse
  if(isMousePressed){
    drawCookie(mouseX, mouseY, 50);
  }
  
  // for each ant in the array, display and move them
  for(let i = 0; i < numAnts; i++){
    ants[i].display();
    ants[i].move();
    // with respect to this ant, loop over all other ants
  }
  
  let s = 'Click anywhere on canvas to feed the ants!!';
  
  fill(50);
  text(s, 10, 10, 500, 80); // Text wraps within text box
}

class Ant {
  // each ant have their own x and y positions, also the changes in x and y positions used to calculate the angle they face, their size, and their own noff suggesting a perlin noise position they start travelling in which increments by 0.005
  constructor(xPos, yPos, size, noff){
    this.x = xPos;
    this.y = yPos;
    this.size = size;
    this.angle = 0;
    this.noff = noff;
    this.xDis = 0;
    this.yDis = 0;
    this.id = ++id;
  }
  
  // displays the ants but before that, it rotates the ants facing 
  // the direction it will be going in using inverse tangent function
  display(){
    push();
    translate(this.x, this.y);
    rotate(90 + atan2(this.yDis, this.xDis));
    drawAnt(0, 0, this.size);
    // noFill();
    // get bounding box of each ant - used for testing collision
    // rect(0-this.size, 0-this.size, this.size*2, this.size*4);
    pop();
  }
  
  // if mouse is pressed, the ant moves towards the pressing location
  // if mouse is not pressed, the ant moves based on their position perlin noise in the perlin noise function
  move(){
    if(isMousePressed){
      // x offset
      this.xDis = (mouseX - this.x) * random(0.01, 0.02);
      this.x += this.xDis; 
      
      // y offset
      this.yDis = (mouseY - this.y) * random(0.01, 0.02);
      this.y += this.yDis; 
      
      // ants cannot go off board
      this.x = constrain(this.x, 0+5, width-5);
      this.y = constrain(this.y, 0+5, height-5);
      
      // ants cannot overlap each other
      
    } else {
      // x offset
      // I used the noise function to determine the offset of each ant,
      // Update 10/10: to make the offset cover the entire canvas I mutiplied it by width and mapped it to a slightly larger interval than canvas to make it sometimes hit the edge and "try to get out"
      this.xDis = (map(noise(this.noff)*width, 100, 400, -50, 550)- this.x) * random(0.01, 0.02)
      this.x += this.xDis;
      
      // y offset
      this.yDis = (map(noise(this.noff + 500)*height, 100, 400, -50, 550) - this.y) * random(0.01, 0.02);
      this.y += this.yDis;
      
      // ants cannot go off board
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 0, height);
      
      // update perlin noise location
      this.noff+=0.005;
    }
    // check against every other ants to see if overlapped - O(n)
    for(let i = 0; i < numAnts; i++){
      if(this.id != ants[i].id){
        this.collision(ants[i]);
      }
    }
  }
  
  // check if this and other has overlapped
  collision(other) {
    // Calculate the distance between the centers of the two ants
    let dx = this.x - other.x;
    let dy = this.y - other.y;
    let distance = sqrt(dx * dx + dy * dy);

    // Calculate the sum of the radii of the two ants
    let sumOfRadii = this.size + other.size;

    // Check if the ants are colliding
    if (distance < sumOfRadii) {
      // If they are colliding, move the ants away from each other
      let angle = atan2(dy, dx);
    
      // Update the positions of both ants to separate them
      this.x += cos(angle) * (sumOfRadii - distance) * 0.5;
      this.y += sin(angle) * (sumOfRadii - distance) * 0.5;
      other.x -= cos(angle) * (sumOfRadii - distance) * 0.5;
      other.y -= sin(angle) * (sumOfRadii - distance) * 0.5;
    }
  }
}

function mousePressed() {
  // Store the current mouse position when mouse is pressed
  isMousePressed = true;
}

function mouseReleased() {
  // Reset the flag and clear the canvas when mouse is released
  isMousePressed = false;
}


function drawAnt(x, y, s){
  push();
  strokeWeight(0.2);
  fill("#8A3324")
  line(x, y, x-s/2, y-s/2);
  line(x-s/2, y-s/2, x-s/2, y-s);
  line(x-s/2, y-s, x-s, y-s-s/2);
  line(x, y, x+s/2, y-s/2);
  line(x+s/2, y-s/2, x+s/2, y-s);
  line(x+s/2, y-s, x+s, y-s-s/2);
  circle(x, y, s);
  translate(0, s-s/2+s/3);
  // rotate(-30);
  // front feet
  line(x, y, x-s, y-s/2);
  line(x, y, x+s, y-s/2);
  line(x-s, y-s/2, x-s, y-s/4-s);
  line(x+s, y-s/2, x+s, y-s/4-s);
  // middle feet
  line(x, y, x-s, y);
  line(x, y, x+s, y);
  line(x-s, y, x-s-s/2, y-s/4);
  line(x+s, y, x+s+s/2, y-s/4);
  // back feet
  line(x, y, x-s, y+s/2);
  line(x, y, x+s, y+s/2);
  line(x-s, y+s/2, x-s, y+s/2+s);
  line(x+s, y+s/2, x+s, y+s/2+s);
  circle(x, y, s-s/4);
  translate(0, s);
  circle(x, y, s+s/4);
  pop();
}

function drawCookie(x, y, diameter){
  // create shadows for the squares and pyramids
  push();
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = -5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'black';
  fill("#E6CEA0");
  circle(x, y, diameter);
  pop();
  fill("#7B3F00");
  ellipse(x-7, y+10, 10, 5);
  ellipse(x+10, y+10, 7, 2);
  ellipse(x+5, y, 6, 7);
  ellipse(x-10, y-10, 10, 10);
  ellipse(x+7, y-10, 7, 13);
}