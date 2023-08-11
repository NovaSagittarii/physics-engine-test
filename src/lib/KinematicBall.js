import RAPIER, { Vector2 } from "@dimforge/rapier2d-compat";
import { BallBase } from "./Ball";
import { Vector2FromPolar } from "./util";

export default class KinematicBall extends BallBase {
  constructor(world, x, y, radius){
    super(world, x, y, radius);
    const rigidBodyDesc = this.rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(x, y)
    // .setLinearDamping(1.0)
    // .setAngularDamping(1.0)
    // .setCcdEnabled(true);
    const rigidBody = this.rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = this.colliderDesc = RAPIER.ColliderDesc.ball(radius, radius)
      .setFriction(0.5)
      .setRestitution(0.0);
    this.collider = world.createCollider(colliderDesc, rigidBody);
    this.initialX = this.goalX = x;
    this.initialY = this.goalY = y;
  }
  draw(sk){
    sk.strokeWeight(0.1);
    sk.stroke(100, 0, 0, 255);
    const { x, y } = this.getTranslation();
    sk.line(x, y, this.goalX, this.goalY);
    super.draw(sk);
    sk.fill(100, 0, 0);
    sk.ellipse(x, y, 1, 1);
  }
  goTo(x, y){
    if(this.goalX !== x || this.goalY !== y){
      this.initialX = this.getTranslation().x;
      this.initialY = this.getTranslation().y;
    }
    this.goalX = x;
    this.goalY = y;
  }
  step(){
    const {x, y} = this.getTranslation();
    const sourceDist = Math.hypot(x-this.initialX, y-this.initialY);
    const terminalDist = Math.hypot(x-this.goalX, y-this.goalY);
    const velocity = Math.max(0.1, Math.min(1, sourceDist, terminalDist))*10;
    const theta = Math.atan2(this.goalY-y, this.goalX-x);
    this.rigidBody.setLinvel(Vector2FromPolar(velocity, theta));
  }
  freeze(){
    this.rigidBody.setLinvel(Vector2FromPolar(0, 0));
  }
}