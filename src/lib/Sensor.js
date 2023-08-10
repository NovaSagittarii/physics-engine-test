import RAPIER from '@dimforge/rapier2d-compat';

export default class Sensor {
  constructor(world, x, y, radius, callback){
    this.world = world;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.callback = callback;
    this.collider = world.createCollider(
      RAPIER.ColliderDesc.ball(radius)
      .setTranslation(x, y)
      .setSensor(true)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
    );
    // world.intersectionsWith(this.collider, callback);
  }
  setTranslation(x, y){
    this.collider.setTranslation(x, y);
  }
  draw(sk){
    const { x, y, radius } = this;
    sk.fill('#00000030');
    // why does this take a callback instead of returning objects, IT LOOKS LIKE AN EVENT LISTENER AAAAAAAAA
    this.world.intersectionsWith(this.collider, () => sk.fill('#FFFFFFA0'));
    sk.ellipse(x, y, radius*2, radius*2);
  }
  dispose(){
    this.world.removeCollider(this.collider);
  }
}