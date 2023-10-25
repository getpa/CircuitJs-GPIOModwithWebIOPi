// get iframe the simulator is running in.  Must have same origin as this file!
var iframe = document.getElementById("circuitFrame");

var sim;
var elmList = [];
const DIGITAL_VOLTAGE = 5.0;
const DIGITAL_THRETHOLD = 2.5;
var main_DEBUG = false;

// called when simulator updates its display
function didUpdate(sim) {
  for (var gpio in [...Array(54).keys()]) {
    var v = sim.getNodeVoltage("GPIO" + gpio) > DIGITAL_THRETHOLD ? 1 : 0;
    if(w().GPIO[gpio].value !== v) webiopi().digitalWrite(gpio, v);
  }
}

// called when simulator analyzes a circuit (when a circuit is loaded or edited)
function didAnalyze(sim) {
  // console.log("analyzed circuit");

  // // get the list of elements
  // elmList = sim.getElements();

  // // log some info about each one
  // for (const elm of elmList) {
  //   console.log("elm " + elm.getType() + ", " + elm.getPostCount() + " posts");
  //   console.log("elm info: " + elm.getInfo());
  // }
}

// called every timestep
function didStep(sim) {
  // var t = sim.getTime();
  // var q = ampl*Math.sin(freq*Math.PI*2*t);

  // // set voltage of external voltage "extsin"
  // sim.setExtVoltage("extsin", ampl*Math.sin(freq*Math.PI*2*t));
  for (var gpio in [...Array(54).keys()]) {
    sim.setExtVoltage("GPIO" + gpio, w().GPIO[gpio].value * DIGITAL_VOLTAGE);
  }
}

// callback called when simulation is done initializing
function simLoaded() {
  // get simulator object
  sim = iframe.contentWindow.CircuitJS1;

  // set up callbacks on update and timestep
  sim.onupdate = didUpdate;
  sim.ontimestep = didStep;
  sim.onanalyze = didAnalyze;
}

iframe.contentWindow.oncircuitjsloaded = simLoaded;
// set up webiopi
webiopi().ready(function() {
  webiopi().RPiHeader().createTable("content");
  w().refreshGPIO(true);
});