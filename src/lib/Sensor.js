import RAPIER from '@dimforge/rapier2d-compat';
import DisposableEntity from './DisposableEntity';

export default class Sensor extends DisposableEntity {
  constructor(world, x, y, radius, callback){
    super();
    this.attachments = [];
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
      .setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.ALL)
    );
    // world.intersectionsWith(this.collider, callback);
  }
  setTranslation(x, y){
    this.x = x;
    this.y = y;
    this.collider.setTranslation(x, y);
  }
  getX(){ return this.x; }
  getY(){ return this.y; }
  draw(sk){
    const { x, y, radius } = this;
    sk.fill('#00000030');
    // why does this take a callback instead of returning objects, IT LOOKS LIKE AN EVENT LISTENER AAAAAAAAA
    this.world.intersectionsWith(this.collider, () => sk.fill('#FFFFFFA0'));
    sk.ellipse(x, y, radius*2, radius*2);
  }
  dispose(){
    super.dispose();
    for(const dictionary of this.attachments) delete dictionary[this.collider.handle];
    this.world.removeCollider(this.collider);
  }
  attachCollider(dictionary){
    dictionary[this.collider.handle] = this;
    this.attachments.push(dictionary);
  }
}