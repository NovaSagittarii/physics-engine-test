import RAPIER from '@dimforge/rapier2d-compat';

export default class Wall {
  alive = true;
  constructor(world, x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(w/2, h/2)
      .setTranslation(x, y)
    );
  }
  draw(sk){
    const { x, y, w, h } = this;
    sk.push();
    sk.translate(x, y);
    sk.scale(w, h);
    sk.rect(0, 0, 1, 1);
    sk.pop();
  }
}