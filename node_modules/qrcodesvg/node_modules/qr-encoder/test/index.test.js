'use strict';

var chai = require('chai');
chai.should();

var qrEncoder;

beforeEach(function () {
  qrEncoder = require('../index');
});

describe('qr-encoder', function () {

	describe('#encode()', function() {

		it('is a function', function () {
		    qrEncoder.should.have.property('encode');
		    qrEncoder.encode.should.be.a('function');
		});

		it('throws an error if no string passed', function () {
		    (function () {
		        qrEncoder.encode();
		    }).should.Throw('no string passed');
		});

		it('accepts only valid ecclevel', function() {
		    (function () {
		        qrEncoder.encode("Hi", 5);
		    }).should.Throw('wrong ecclevel');
		});


		it('returns a valid array', function () {
		    var result = qrEncoder.encode("Hi",1);
			
		    result.should.be.a('array');

		    //array length shoud be between min & max nb of modules
		    //supported by a qrcode
		    result.should.have.length.within(21,177);

		    //lines length should be equals to array length
		    var i = 0;
		    
		    for (; i < result.length; i++) {
			result[i].should.have.length(result.length);
		    }

		});
	});

});
