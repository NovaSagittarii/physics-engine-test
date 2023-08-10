class PerformanceIndictor {
  constructor(parentHTMLElement, label, rollingAverageSize){
    this.label = label;
    this.sum = 0;
    this.index = 0;
    this.maxIndex = 0;
    this.dataPoints = [...new Array(rollingAverageSize)].map(x => 0);
    const d = this.divElement = document.createElement('div');
    parentHTMLElement.append(d);
  }
  update(newDataPoint){
    this.sum -= this.dataPoints[this.index];
    this.sum += newDataPoint;
    this.dataPoints[this.index] = newDataPoint;
    this.index = (this.index + 1) % this.dataPoints.length;
    // this.maxIndex = Math.max(this.index, this.maxIndex)+1;
    const w = this.read();
    this.divElement.innerText = `${w.toFixed(1)}ms (${(1000/w).toFixed(1)}Hz) [${this.label}]`;
  }
  read(){
    return this.sum / this.dataPoints.length;
  }
}

export default PerformanceIndictor;
export { PerformanceIndictor };