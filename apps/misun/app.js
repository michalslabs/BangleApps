const lat = 50;
const lon = 14.42;
const yStart = 45;
const xStart = 50;
const dy = 18;
const forgetMins = 6*60;

const sunCalc = require("suncalc"); // https://github.com/mourner/suncalc
require("Font8x16").add(Graphics);

// sunfacts.app.js
// require("Storage").write("sunfacts.info",{"id":"sunfacts", "name":"Sun Facts", "type":"clock", "src":"sunfacts.app.js"});

function formatTime(d) {
  return (" " + d.getHours()).substr(-2) + ":" + Math.abs(d.getMinutes()).toString().padStart(2,0);
}

function formatLine(now, d) {
  dMins = (d-now)/1000/60;
  if(dMins<-forgetMins) {
    dMins += 24*60;
  }
  if(dMins<0) {
    delta = "-";
  } else {
    delta = "+";
  }
  dMins = Math.abs(dMins);
  dHrs = (dMins/60).toFixed(0);
  dMins -= dHrs * 60;
  delta += (" " + dHrs).substr(-2);
  delta += ":" +dMins.toFixed(0).toString().padStart(2,0);
  return formatTime(d) + " (" + delta+")";
}

var x = 0;
var y = 0;

function gprint(s) {
  g.drawString(s, x, y, true);
  y+=dy;
}

function draw() {
  d = new Date();
  sun = sunCalc.getTimes(d, lat, lon);
  g.reset();
  g.clearRect(0,yStart,176,176);
  g.setFont8x16();

  g.setFontAlign(1,1);
  x = xStart;
  y = yStart;
  gprint(formatTime(d));
  x = 160;
  gprint("svitani: " + formatLine(d, sun.dawn));
  gprint("vychod:  " + formatLine(d, sun.sunrise));
  gprint("GH:      " + formatLine(d, sun.goldenHourEnd));
  gprint("poledne: " + formatLine(d, sun.solarNoon));
  gprint("GH:      " + formatLine(d, sun.goldenHour));
  gprint("zapad:   " + formatLine(d, sun.sunset));
  gprint("soumrak: " + formatLine(d, sun.dusk));
}

var interval;
var redraw = 0;

function drawSetInterval() {
  draw();
  if(interval) clearInterval(interval);
  d = new Date();
  sec = 60 - d.getSeconds();
  interval = setInterval(drawSetInterval, sec*1000); 
  y=yStart;
  x=120;
  redraw+=1;
  gprint("i:"+sec+" r:"+redraw);
}

g.clear();
draw();
interval = setInterval(drawSetInterval, 1000);
Bangle.setUI("clock");
Bangle.loadWidgets();
Bangle.drawWidgets();
