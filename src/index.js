import RAPIER from '@dimforge/rapier2d-compat';
import * as p5 from 'p5';
import PerformanceIndictor from './PerformanceIndicator';

import { Ball, Wall, Sensor, Ping } from './lib';
import { angleDifference, filter } from './lib/util';

const performanceDiv = document.querySelector('#performance');
const ballCountDiv = document.createElement('div'); performanceDiv.append(ballCountDiv);
const physicsPerformance = new PerformanceIndictor(performanceDiv, 'physics', 100);
const renderPerformance = new PerformanceIndictor(performanceDiv, 'render', 100);

await RAPIER.init();
let eventQueue = new RAPIER.EventQueue(true);
const activeColliders = {};

let gravity = { x: 0.0, y: -9.81*0 };
let world = new RAPIER.World(gravity);

// Ground
// let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 1.0);
// world.createCollider(groundColliderDesc);

// ground
let walls = [
  // {x: 0, y: -5, w: 20, h: 10}, // inner container
  // {x: -10, y: 5, w: 1, h: 10},
  // {x: 10, y: 5, w: 1, h: 10},

  {x: 0, y: -5, w: 100, h: 1}, // outer container
  {x: -20, y: 10, w:1, h: 50},
  {x: 20, y: 10, w:1, h: 50},
  {x: 0, y: 35, w: 100, h: 1}, // lid
].map(a => {
  const {x, y, w, h} = a;
  return new Wall(world, x, y, w, h);
});

// ball is controllable, balls are environment
let ball = new Ball(world, 0, 1, 0.5);
let balls = [...new Array(0)].map((_, i, {length}) => {
  return new Ball(world, ((i%11)-5)*1 +0.1, 0.2*i+5, i/length*0+0.2);
});
const pings = [];

const sensors = [];
// console.log(balls);
let mutex = true;

let screenX, screenY;
// renderer
const P5 = new p5((sk) => {
  let mouseclickpush = 50;
  sk.setup = () => {
    sk.createCanvas(400, 400);
    sk.frameRate(60);
    // console.log(sk);
  };
  sk.mousePressed = () => {
    // console.log(rigidBody);
    // ball.rigidBody.applyImpulse(new RAPIER.Vector2(mouseclickpush *= -1, -5), true);
    const sensor = new Sensor(world, screenX, screenY, 1, (other) => {
      console.log(other);
    });
    sensor.attachCollider(activeColliders);
    sensors.push(sensor);
  };
  sk.draw = () => {
    if(!mutex) return;
    mutex = false;

    const currentTime = performance.now();
    sk.push();
    sk.scale(10);
    sk.scale(1, -1);
    sk.translate(20, -35);

    const { mouseX, mouseY, CENTER } = sk;
    screenX = mouseX, screenY = mouseY;
    screenX /= 10; screenY /= -10;
    screenX -= 20; screenY -= -35; // more like coordinates within the physics engine
    
    sk.background(220);

    // sk.ellipse(mouseX, mouseY, 20, 20);
    sk.rectMode(CENTER, CENTER);
    sk.noStroke();
    sk.fill('#000000');
    ball.draw(sk);
    for(const ball of balls) ball.draw(sk);
    for(const wall of walls) wall.draw(sk);
    for(const sensor of sensors) sensor.draw(sk);
    for(const ping of pings){
      ping.draw(sk);
      ping.step();
    }
    for(const array of [sensors, pings]) filter(array, (x) => x.alive);

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

  // attract ball towards the sensors
  if(sensors.length > 0){
    const { x, y } = ball.getTranslation();
    const sensor = sensors[0];
    const Jtheta = Math.atan2(sensor.getY() - y, sensor.getX() - x); // direction of the impulse

    // const Junit = [Math.cos(Jtheta), Math.sin(Jtheta)];

    const v = ball.getVelocity();
    const vtheta = Math.atan2(v.y, v.x); // direction of current motion
    
    const v1 = Math.hypot(v.x, v.y) * Math.cos(angleDifference(Jtheta, vtheta));
    // const projection = [v1 * Math.cos(Jtheta), v1*Math.sin(Jtheta)];
    // const rejection = [v.x - v1 * Math.cos(Jtheta), v.y - v1*Math.sin(Jtheta)];
    ball.rigidBody.applyImpulse(new RAPIER.Vector2(-(v.x - v1 * Math.cos(Jtheta)), -(v.y - v1*Math.sin(Jtheta))));

    const J = Math.max(0, 10 - Math.hypot(v.x, v.y) * Math.cos( angleDifference(Jtheta, vtheta) )) * ball.rigidBody.mass();
    ball.rigidBody.applyImpulse(new RAPIER.Vector2(J*Math.cos(Jtheta), J*Math.sin(Jtheta)), true);
  }else{
    ball.freeze();
  }

  world.step(eventQueue);
  eventQueue.drainCollisionEvents((handle1, handle2, started) => {
    // console.log(handle1, handle2, started);
    if(started){
      for(const h of [handle1, handle2]){
        // console.log(h, h in activeColliders, activeColliders[h]);
        if(activeColliders[h]){
          const o = activeColliders[h];
          pings.push(new Ping(o.x, o.y, 1, 30));
          o.dispose();
        }
      }
    }
  });
  eventQueue.drainContactForceEvents(event => {
    let handle1 = event.collider1(); // Handle of the first collider involved in the event.
    let handle2 = event.collider2(); // Handle of the second collider involved in the event.
    /* Handle the contact force event. */
  });

  mutex = true;
  // Get and print the rigid-body's position.
  // let position = rigidBody.translation();
  // console.log("Rigid-body position: ", position.x, position.y, position.z);
  const finalTime = performance.now();
  physicsPerformance.update(finalTime-currentTime);
  setTimeout(gameLoop, 16-(finalTime-currentTime));
};

gameLoop();