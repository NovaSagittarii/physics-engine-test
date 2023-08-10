export function filter(array, filterFunction){
  for(let i = array.length-1; i >= 0; i --){
    if(!filterFunction(array[i])) array.splice(i, 1);
  }
}