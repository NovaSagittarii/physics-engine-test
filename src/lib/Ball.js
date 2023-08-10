import RAPIER from '@dimforge/rapier2d-compat';

export default class Ball {
  constructor(world, x, y, radius){
    const rigidBodyDesc = this.rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(x, y)
    .setLinearDamping(0)
    // .setCcdEnabled(true);
    const rigidBody = this.rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = this.colliderDesc = RAPIER.ColliderDesc.ball(radius)
      .setRestitution(1.0);
    this.collider = world.createCollider(colliderDesc, rigidBody);
  }
  draw(sk){
    const { x = 0, y = 0 } = (this.rigidBody?.translation && this.rigidBody.translation()) || {};
    const w = this.colliderDesc.shape.radius*2;
    const h = this.colliderDesc.shape.radius*2;
    sk.push();
    sk.translate(x, y);
    sk.scale(w, h);
    sk.ellipse(0, 0, 1, 1);
    sk.pop();
  }
  getTranslation(){
    return this.rigidBody.translation();
  }
  getVelocity(){
    return this.rigidBody.linvel();
  }
}