"use strict";

var gulp = require('gulp'),
open = require('gulp-open'),
fs = require("fs"),
browserify = require("browserify"),
http = require('http'),
jshint = require('gulp-jshint');;

/**
 * basic examples of Qrcodesvg executing on server-side
 */
gulp.task('server', function() {
    var Qrcodesvg = require('./lib/index.js');

    http.createServer(function (req, res) {

	var qrcode = new Qrcodesvg("Hello!", 400, {"ecclevel" : 1});
	var svg = "";

	switch (req.url) {
	case '/rounded-pattern':
	    svg = qrcode.generate({"method":"round", "radius" : 8});
	    break;
	case '/rounded-square':
	    svg = qrcode.generate({"method":"round", "radius" : 8, "scope":"square"});
	    break;
	case '/bevel':
	    svg = qrcode.generate({"method":"bevel", "radius" : 5});
	    break;
	case '/colored-pattern':
	    svg = qrcode.generate({"method":"classic", "fill-colors":["#1C46ED","#021872","#0125C4"]}, {"stroke-width":1});
	    break;
	case '/colored-square':
	    svg = qrcode.generate({"method":"classic", "fill-colors":["#000000","#2D2D2D"], "fill-colors-scope":"square"}, {"stroke-width":0});
	    break;
	case '/background':
	    svg = qrcode.background(null, {"fill":"#8BDD8B", "stroke-width":1, "stroke":"#FFF"}).generate();
	    break;
	case '/frame':
	    svg = qrcode.background({"padding" : 10, "margin" : 10}, {"stroke-width" : 20, "stroke" : "#3DBC27", "fill" : "none"}).generate();
	    break;
	default:
	    svg = qrcode.generate();
	}

	var template = "<!DOCTYPE html>" +
	"<html>" +
	"<head>" +
	"<title>Test</title>" +
	"</head>" +
	"<body>" +
	"<ul>" +
	"<li><a href='/'>classic</a></li>" + 
	"<li><a href='/rounded-pattern'>rounded-pattern</a></li>" + 
	"<li><a href='/rounded-square'>rounded-square</a></li>" + 
	"<li><a href='/bevel'>bevel</a></li>" + 
	"<li><a href='/colored-pattern'>colored-pattern</a></li>" + 
	"<li><a href='/colored-square'>colored-square</a></li>" + 
	"<li><a href='/background'>background</a></li>" +
	"<li><a href='/frame'>frame</a></li>" +
	"</ul>" +
	svg +
	"</body>" +
	"</html>";

	res.writeHead(200);
	res.end(template);
    }).listen(8080, function (stream) {
	console.info("Server started http://localhost:8080");
    });


});

/**
 * Generate a version of Qrcodesvg for client-side
 */
gulp.task('browserify', function() {
    // browserify '/examples/browserify/main.js' > '/examples/browserify/bundle.js'
    browserify("examples/browserify/main.js")
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    .pipe(
	    fs.createWriteStream("examples/browserify/bundle.js")
    )

    return;
});

/**
 * Start local example once the bundle has been generated
 */
gulp.task('open-browserify-example', function() {
    //wait until bundle.js has been generated
    //then start open example page in a browser
    gulp.watch("examples/browserify/bundle.js", function() {
	gulp.src('examples/browserify/index.html')
	.pipe( open() );
    });

    return;
});

/**
 * Generate a clien-side bundle and launch the example on a browser
 */
gulp.task('client', ['browserify', 'open-browserify-example']);


gulp.task('jshint', function() {
	
    gulp.src(['lib/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('fail'));
    
});

gulp.task('default');
