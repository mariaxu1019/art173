class NoiseCircle {
  constructor(_x, _y, _br, zoffUpdate, noiseMax) {
    this.location = new createVector(_x, _y);
    this.br = _br;
    this.color = color(208, 184, 209);
    this.coreColor = color(144, 49, 130);
    this.velocity = new createVector(random(-0.7, 0.7), random(-0.7, 0.7))
    this.zoffUpdate = zoffUpdate;
    this.noiseMax = noiseMax;

    this.originalSize = this.br; 
    this.desired = new createVector(0,0); 
    this.friction = new createVector(0, 0);
    this.speedLimit = random(1, this.originalSize);

    this.creatureState = "hungry";
    this.hungryThreshold = 3;
    this.fullThreshold = 5;

    this.isFull = function () {
      return this.creatureState === 'full';
    }
  }

  update() {
    if (this.creatureState === 'hungry' && this.br >= this.fullThreshold) {
      this.changeState('full');
    } else if (this.creatureState === 'full' && this.br <= this.hungryThreshold) {
      this.changeState('hungry');
    }
    if (this.creatureState === 'full' && this.br > this.originalSize) {
      this.br -= 0.1;
    }
    if (this.br < this.hungryThreshold) {
      this.changeState('hungry');
    } else if (this.br > this.fullThreshold) {
      this.changeState('full');
    }
  }

  findFood(x, y) { 
    this.desired.x = x;
    this.desired.y = y;
    let direction = p5.Vector.sub(this.desired, this.location);

    if (direction.mag() < this.br * 5) {
      return true; 
    }

    if (direction.mag() < 50) {
      direction.normalize(); 
      this.velocity.add(direction);
      let angle = noise(this.location.x / 500, this.location.y / 500, frameCount / 20) * TWO_PI * 2; 

      this.friction.x = this.velocity.x * -1;
      this.friction.y = this.velocity.y * -1;
      this.friction.normalize();
      this.friction.mult(0.1);
      this.velocity.add(this.friction);

      this.velocity.limit(this.speedLimit);
      this.location.x += this.velocity.x * sin(angle) * 5;
      this.location.y += this.velocity.y * cos(angle) * 5;
      this.location.add(this.velocity);
    }
    return false;
  }

  changeState(newState) {
    this.creatureState = newState;
  }

  friction() {
    this.friction.x = this.velocity.x * -1;
    this.friction.y = this.velocity.y * -1;
    this.friction.normalize();
    this.friction.mult(0.1);
    this.velocity.add(this.friction);

    this.velocity.limit(this.speedLimit);
    this.location.add(this.velocity);
  }

  crawling() {
    let angle = noise(this.location.x / 500, this.location.y / 500, frameCount / 20) * TWO_PI * 2;
    this.location.x += this.velocity.x * cos(angle) * 3;
    this.location.y += this.velocity.y * sin(angle) * 3;
  }

  bouncing() {
    if (this.location.x < 0 || this.location.x > width) this.velocity.x *= -1;
    if (this.location.y < 0 || this.location.y > height) this.velocity.y *= -1;
  }


  communication(other) {
    let d = dist(this.location.x, this.location.y, other.location.x, other.location.y);
    return d < this.br * 50 + other.br * 50;
  }

  contains(px, py) {
    let d = dist(px, py, this.location.x, this.location.y);
    if (d < this.r) {
      return true;
    } else {
      return false;
    }
  }

  changeColor(c) {
    this.color = c;
  }

  changeCoreColor(c) {
    this.coreColor = c;
  }

  Draw(r) {
    push();
    translate(this.location.x, this.location.y);
    stroke(255, 100);
    strokeWeight(1);
    let alpha1 = 5;
    fill(this.color, alpha1);
    beginShape();

    for (let a = 0; a < TWO_PI; a += radians(5)) {
      let xoff = map(cos(a + phase), -1, 1, 0, this.noiseMax + r);
      let yoff = map(sin(a + phase), -1, 1, 0, this.noiseMax + r);
      let rad = r + map(noise(xoff, yoff, zoff), 0, 1, r, this.br * 100);
      let x = rad * cos(a);
      let y = rad * sin(a);
      curveVertex(x, y);
    }
    endShape(CLOSE);

    phase += 0.001;
    zoff += this.zoffUpdate;

    let alpha2 = map(r, 0, 0.5, 20, 255);

    fill(255, 255, 200, alpha1);
    ellipse(0, 0, r + this.br * 30);

    fill(this.coreColor, alpha2);
    ellipse(0, 0, r + this.br * 20);

    pop();
  }
}
