import RAPIER from "@dimforge/rapier2d-compat";

const { PI } = Math;
const TWO_PI = 2*PI;

export function filter(array, filterFunction){
  for(let i = array.length-1; i >= 0; i --){
    if(!filterFunction(array[i])) array.splice(i, 1);
  }
}
export function angleDifference(a1, a2){
  a1 = ((a1 % TWO_PI) + TWO_PI) % TWO_PI;
  a2 = ((a2 % TWO_PI) + TWO_PI) % TWO_PI;
  const da = Math.abs(a1 - a2);
  return Math.min(da, PI-da);
}
export function Vector2FromPolar(r, theta){
  return new RAPIER.Vector2(r*Math.cos(theta), r*Math.sin(theta));
}