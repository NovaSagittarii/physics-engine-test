import RAPIER from '@dimforge/rapier2d-compat';

export default class Ball {
  constructor(world, x, y, radius){
    this.world = world;
    this.radius = radius;
    const rigidBodyDesc = this.rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(x, y)
    // .setLinearDamping(1.0)
    // .setAngularDamping(1.0)
    // .setCcdEnabled(true);
    const rigidBody = this.rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = this.colliderDesc = RAPIER.ColliderDesc.ball(radius, radius)
      .setFriction(0.5)
      .setRestitution(1.0);
    this.collider = world.createCollider(colliderDesc, rigidBody);
  }
  draw(sk){
    const { x = 0, y = 0 } = (this.rigidBody?.translation && this.rigidBody.translation()) || {};
    const w = this.radius*2;
    const h = this.radius*2;
    const theta = this.rigidBody.rotation();
    sk.push();
    sk.translate(x, y);
    sk.rotate(theta);

    sk.stroke(255,0,0);
    sk.strokeWeight(0.1);
    sk.line(0, 0, Math.max(1, this.radius*2), 0);

    sk.scale(w, h);
    sk.noStroke();
    sk.fill(0);
    sk.ellipse(0, 0, 1, 1);
    sk.pop();
  }
  getTranslation(){
    return this.rigidBody.translation();
  }
  getVelocity(){
    return this.rigidBody.linvel();
  }
  freeze(){
    const { x, y } = this.getVelocity();
    const J = -Math.hypot(x, y) * this.rigidBody.mass();
    const theta = Math.atan2(y, x);
    this.rigidBody.applyImpulse(new RAPIER.Vector2(J*Math.cos(theta), J*Math.sin(theta)), true);
  }
}