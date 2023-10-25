

// get iframe the simulator is running in.  Must have same origin as this file!
var iframe = document.getElementById("circuitFrame");

var sim;
var freq, ampl;
var elmList = [];

function round(x) {
  return Math.round(x*1000)/1000;
}

// called when simulator updates its display
function didUpdate(sim) {
  var info = document.getElementById("info");
  info.innerHTML = "time = " + round(sim.getTime()) + "<br>running = " + sim.isRunning();

  // get voltage of labeled node "vsense"
  var vsense = sim.getNodeVoltage("vsense");
  info.innerHTML += "<br>V(vsense) = " + round(vsense);

  freq = parseFloat(document.getElementById("freq").value);
  ampl = parseFloat(document.getElementById("ampl").value);

  var bstr = "";
  var bval = 0;
  var i;
  for (i = 7; i >= 0; i--) {
    var v = sim.getNodeVoltage("D" + i);
    if (v > 2.5) {
      bstr += "1";
      bval = 2*bval+1;
    } else {
      bstr += "0";
      bval = 2*bval;
    }
  }
  info.innerHTML += "<br>counter value = <tt>" + bstr + "</tt> = " + bval;

  var rcount = 0;

  // go through list of elements
  for (const elm of elmList) {
    if (elm.getType() == "ResistorElm") {
      // show info about each resistor
      rcount++;
      info.innerHTML += "<br>resistor " + rcount + " voltage diff = " + round(elm.getVoltageDiff());
      info.innerHTML += "<br>resistor " + rcount + " current = " + round(elm.getCurrent() * 1000) + " mA";
    } else if (elm.getType() == "LabeledNodeElm") {
      // show voltage of each labeled node
      info.innerHTML += "<br>V(" + elm.getLabelName() + ") = " + round(elm.getVoltage(0));
    }
  }
}

// called when simulator analyzes a circuit (when a circuit is loaded or edited)
function didAnalyze(sim) {
  console.log("analyzed circuit");

  // get the list of elements
  elmList = sim.getElements();

  // log some info about each one
  for (const elm of elmList) {
    console.log("elm " + elm.getType() + ", " + elm.getPostCount() + " posts");
    console.log("elm info: " + elm.getInfo());
  }
}

// called every timestep
function didStep(sim) {
  var t = sim.getTime();
  var q = ampl*Math.sin(freq*Math.PI*2*t);

  // set voltage of external voltage "extsin"
  sim.setExtVoltage("extsin", ampl*Math.sin(freq*Math.PI*2*t));
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

// set up callback
iframe.contentWindow.oncircuitjsloaded = simLoaded;

