export default class Ping {
  constructor(x, y, radius, lifetime){
    this.alive = true;
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
    if(this.time <= 0) this.alive = false;
  }
}