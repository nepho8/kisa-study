var Qrcodesvg = require('../../lib/index.js');

var svg = new Qrcodesvg("Hello!", 400, {"ecclevel" : 1}).generate();

document.getElementById("qrcode").innerHTML = svg;
