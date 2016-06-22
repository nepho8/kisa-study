'use strict';

var chai = require('chai');
chai.should();

var expect = chai.expect;

var Qrcodesvg;
var qrCodeSize;

beforeEach(function () {

    Qrcodesvg  = require('../lib/index.js');

    qrCodeSize = 100;

});

describe ("Qrcodesvg", function() {

    describe("constructor()", function() {

	it("needs an input", function() {
	    (function () {
		new Qrcodesvg();
	    }).should.Throw('no input set');
	});

	it("needs a QR code size", function() {

	    (function () {
		new Qrcodesvg("Hello");
	    }).should.Throw('no size set');
	});

    });


    describe("generate()", function() {

	it ("returns a string", function() {
	    var data = new Qrcodesvg("Hello", qrCodeSize).generate();

	    expect( data ).to.be.a("string");
	    expect( data ).not.to.be.empty;
	});


	it ("applies size", function() {
	    var data 		= new Qrcodesvg("Hello", qrCodeSize).generate();

	    var widthRegExp 	= new RegExp('<svg[^>]* width=[\'\"]?' + qrCodeSize, 'i' );
	    var heightRegExp 	= new RegExp('<svg[^>]* height=[\'\"]?' + qrCodeSize, 'i' );

	    var matchWidth 	= data.match(widthRegExp);
	    var matchHeight 	= data.match(heightRegExp);

	    expect( matchWidth ).not.to.be.null;
	    expect( matchHeight ).not.to.be.null;

	});


	it ("applies attribute", function() {
	    var fillName		= "fill";
	    var fillValue	= "#00FF00";
	    var attributes 	= {};

	    attributes[fillName] = fillValue;

	    var qrcode 		= new Qrcodesvg("Hello", qrCodeSize);

	    var data		= qrcode.generate({},attributes);

	    var fillRegExp 	= new RegExp( fillName + '=[\'\"]?' + fillValue, 'ig' );

	    var matchAttribute	= data.match(fillRegExp);

	    expect( matchAttribute ).to.be.a("array");
	    expect( matchAttribute ).to.have.length.above(1);

	});

	it ("returns an error when drawing method doesn't exist", function() {
	    var drawingMethod = "make-it-like-andy-warhol-would";
	    var qrcode	  = new Qrcodesvg("Hello", qrCodeSize);

	    (function () {
		qrcode.generate({'method' : drawingMethod});
	    }).should.Throw('Drawing method not found');
	});


    });

    describe("background()", function() {
	it ("needs settings or attributes", function() {
	    var qrcode	  = new Qrcodesvg("Hello", qrCodeSize);
	    
	    (function () {
		qrcode.background();
	    }).should.Throw('background method needs at least settings or attributes');
	});
    });
    
});
