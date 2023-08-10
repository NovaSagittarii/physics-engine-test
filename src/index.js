import RAPIER from '@dimforge/rapier2d-compat';
import * as p5 from 'p5';
import PerformanceIndictor from './PerformanceIndicator';

import Ball from './lib/Ball';

const performanceDiv = document.querySelector('#performance');
const ballCountDiv = document.createElement('div'); performanceDiv.append(ballCountDiv);
const physicsPerformance = new PerformanceIndictor(performanceDiv, 'physics', 100);
const renderPerformance = new PerformanceIndictor(performanceDiv, 'render', 100);

await RAPIER.init();

let gravity = { x: 0.0, y: -9.81*0 };
let world = new RAPIER.World(gravity);

// Ground
// let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 1.0);
// world.createCollider(groundColliderDesc);

// ground
let rects = [
  // {x: 0, y: -5, w: 20, h: 10}, // inner container
  // {x: -10, y: 5, w: 1, h: 10},
  // {x: 10, y: 5, w: 1, h: 10},

  {x: 0, y: -5, w: 100, h: 1}, // outer container
  {x: -20, y: 10, w:1, h: 50},
  {x: 20, y: 10, w:1, h: 50},
  {x: 0, y: 35, w: 100, h: 1}, // lid
].map(a => {
  const {x, y, w, h} = a;
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(w/2, h/2)
    .setTranslation(x, y)
  );
  return a;
});

// ball is controllable, balls are environment
let ball = new Ball(world, 0, 1, 0.5);
let balls = [...new Array(0)].map((_, i, {length}) => {
  return new Ball(world, ((i%11)-5)*1 +0.1, 0.2*i+5, i/length*0+0.2);
});
// console.log(balls);
let mutex = true;

// renderer
const P5 = new p5((sk) => {
  let mouseclickpush = 50;
  sk.setup = () => {
    sk.createCanvas(400, 400);
    sk.frameRate(30);
    console.log(sk);
  };
  sk.mousePressed = () => {
    // console.log(rigidBody);
    ball.rigidBody.applyImpulse(new RAPIER.Vector2(mouseclickpush *= -1, -5), true);
  };
  sk.draw = () => {
    if(!mutex) return;
    mutex = false;

    const currentTime = performance.now();
    const { mouseX, mouseY, CENTER } = sk;
    sk.push();
    sk.scale(10);
    sk.scale(1, -1);
    sk.translate(20, -35);

    let screenX = mouseX, screenY = mouseY;
    screenX /= 10; screenY /= -10;
    screenX -= 20; screenY -= -35; // more like coordinates within the physics engine
    
    sk.background(220);

    // sk.ellipse(mouseX, mouseY, 20, 20);
    sk.rectMode(CENTER, CENTER);
    sk.noStroke();
    sk.fill('#000000');
    const drawRect = function(collider, body){
      const { x = 0, y = 0 } = (body?.translation && body.translation()) || {};
      const w = collider.shape.radius*2;
      const h = collider.shape.radius*2;
      sk.push();
      sk.translate(x, y);
      sk.scale(w, h);
      sk.ellipse(0, 0, 1, 1);
      sk.pop();
    };
    // sk.rect(rigidBody.translation().x, rigidBody.translation().y, colliderDesc.shape(), 1);
    
    ball.draw(sk);
    for(const ball of balls) ball.draw(sk);
    
    for(const {x, y, w, h} of rects){
      sk.push();
      sk.translate(x, y);
      sk.scale(w, h);
      sk.rect(0, 0, 1, 1);
      sk.pop();
    }

    // drawRect(groundColliderDesc, {});
    sk.pop();
    mutex = true;
    const finalTime = performance.now();
    renderPerformance.update(finalTime-currentTime);
  };
});

// Game loop. Replace by your own game loop system.
let ii = 0;
let gameLoop = () => {
  if(!mutex) return;
  mutex = false;
  if(physicsPerformance.read() < 16 && balls.length < 10){
    balls.push(new Ball(world, (((ii ++)%21)-10)*0.2, 20, 0.2 ));
    ballCountDiv.innerText = ii;
  }

  const currentTime = performance.now();
  world.step();

  mutex = true;
  // Get and print the rigid-body's position.
  // let position = rigidBody.translation();
  // console.log("Rigid-body position: ", position.x, position.y, position.z);
  const finalTime = performance.now();
  physicsPerformance.update(finalTime-currentTime);
  setTimeout(gameLoop, 16-(finalTime-currentTime));
};

gameLoop();