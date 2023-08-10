import DisposableEntity from "./DisposableEntity";

export default class Ping extends DisposableEntity {
  constructor(x, y, radius, lifetime){
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.time = this.lifetime = lifetime;
  }
  draw(sk){
    const { x, y, radius, time, lifetime } = this;
    const k = time/lifetime;
    const r = radius * (1.2 - k);
    sk.fill(255, 0, 0, 255*Math.min(1, k*2));
    sk.ellipse(x, y, r, r);
  }
  step(){
    this.time --;
    if(this.time <= 0) this.dispose();
  }
}