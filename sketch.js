// A simple particle system for the hero background
let particles = [];
const numParticles = 100;

function setup() {
  let canvasContainer = document.getElementById('p5-canvas-container');
  let canvas = createCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  canvas.parent('p5-canvas-container');
  
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(18, 18, 18, 150); // A semi-transparent dark background
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
    particles[i].connect(particles.slice(i));
  }
}

function windowResized() {
  let canvasContainer = document.getElementById('p5-canvas-container');
  resizeCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(0.5, 2));
    this.size = random(2, 5);
    this.color = color(0, 102, 255, random(50, 150)); // Primary color with random alpha
  }

  update() {
    this.pos.add(this.vel);
    this.edges();
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  // Wrap around edges
  edges() {
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }

  // Connect to other particles
  connect(otherParticles) {
    otherParticles.forEach(other => {
      const d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (d < 120) {
        stroke(255, 107, 0, 50); // Secondary color for lines
        line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      }
    });

    // Connect to mouse
    const dMouse = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    if (dMouse < 200) {
      stroke(255, 255, 255, 75); // White lines to mouse
      line(this.pos.x, this.pos.y, mouseX, mouseY);
    }
  }
}
