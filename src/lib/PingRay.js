import DisposableEntity from "./DisposableEntity";

export default class PingRay extends DisposableEntity {
  constructor(x, y, x2, y2, lifetime){
    super();
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
    this.time = this.lifetime = lifetime;
  }
  draw(sk){
    const { x, y, x2, y2, time, lifetime } = this;
    const k = time/lifetime;
    sk.strokeWeight(0.1);
    sk.stroke(0, 255, 0, 255*Math.min(1, k*2));
    sk.line(x, y, x2, y2);
    sk.noFill();
    sk.ellipse(x2, y2, 1, 1);
  }
  step(){
    this.time --;
    if(this.time <= 0) this.dispose();
  }
}