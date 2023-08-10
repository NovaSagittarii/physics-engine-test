export default class DisposableEntity {
  constructor(){
    this.alive = true;
    this.disposed = false;
  }
  dispose(){
    if(this.disposed) return;
    this.alive = false;
    this.disposed = true;
  }
}