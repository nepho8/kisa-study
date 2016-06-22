"use strict";

var qrEncoder 	= require("qr-encoder");
var Square 	= require("./square");

class Qrcodesvg {

    constructor(input, svgSize, options) {
	if (!input) throw new Error("no input set");
	if (!svgSize) throw new Error ("no size set");

	this.options		= options || {};
	this.svgSize		= svgSize;
	this.svgFrameSize	= 0;
	this.bitMatrix 		= qrEncoder.encode(input, this.options.ecclevel || 1);

	this.svg 		= require('svg-builder').reset().width(svgSize).height(svgSize);

	//clone the bitMatrix as a working copy
	//it'll be used to attach each adjacent bits together
	//and thus creating patterns
	this.workingCopyMatrix	= this._clone(this.bitMatrix); 

	this.patterns = [];

	this._detectPatterns();
    }

    /**
     * Getters/Setters
     */

    get options() { return  this._options; }
    get svgSize() { return  this._svgSize; }
    get svgFrameSize() { return  this._svgFrameSize; }
    get bitMatrix() { return  this._bitMatrix; }
    get workingCopyMatrix() { return  this._workingCopyMatrix; }
    get svg() { return  this._svg; }
    get patterns() { return  this._patterns; }
    get patternInConstruction() { return this._patternInConstruction; }
    get drawMethod() { return this._drawMethod; }

    set options(newOption) { this._options = newOption; }
    set svgSize(newSvgSize) {  this._svgSize = newSvgSize; }
    set svgFrameSize(newSvgFrameSize) {  this._svgFrameSize = newSvgFrameSize; }
    set bitMatrix(newbitMatrix) { this._bitMatrix = newbitMatrix; }
    set workingCopyMatrix(newWorkingCopyMatrix) { this._workingCopyMatrix = newWorkingCopyMatrix; }
    set svg(newSvg) { this._svg = newSvg; }
    set patterns(newPatterns) { this._patterns = newPatterns; }
    set patternInConstruction(newPatternInConstruction) { this._patternInConstruction = newPatternInConstruction; }
    set drawMethod( newDrawMethod ) { this._drawMethod = newDrawMethod; }


    _clone (obj) {
	return JSON.parse(JSON.stringify(obj));
    }

    /**
     * check if a square will be drawn at this coords
     * @param int x
     * @param int y
     */
    _squareExists (x, y) {
	try {
	    return (this.bitMatrix[y][x] == 1) ? true : false;
	} catch(err) {
	    return false;
	}
    }

    /**
     * group squares with common sides and add them to patterns array
     */
    _detectPatterns ()
    {
	var i = 0;
	var j;
	var pattern;

	//loop on Map
	for (; i < this.workingCopyMatrix.length; i++) {
	    for (j = 0; j < this.workingCopyMatrix[i].length; j++) {
		//if a square is found, start detecting a pattern
		if (this.workingCopyMatrix[i][j] == 1) {
		    this.patternInConstruction = [];

		    this._detectX(i, j);

		    this.patterns.push(this.patternInConstruction);
		}
	    }
	}

    }

    /** 
     * detect adjacent square on Y-axis
     * @param int 	i
     * @param int 	j
     */
    _detectY (i, j)
    {
	var y1	= -1;

	while (y1 < 2) {

	    if ((i + y1) >= 0 && this.workingCopyMatrix[i + y1] !== undefined) {
		if (this.workingCopyMatrix[i + y1][j] == 1) {

		    this.patternInConstruction.push( new Square(j, i + y1) );

		    // this bit 1 is now part of a pattern
		    // remove trace of its trace into the matrix
		    this.workingCopyMatrix[i + y1][j] = 0;

		    if ((i + y1) != i) {
			this._detectY(i + y1, j);
		    }
		    this._detectX(i + y1, j);
		}
	    }
	    y1++;
	}
    }

    /** 
     * detect adjacent square on x-axis
     * @param int 	i
     * @param int 	j
     */
    _detectX (i, j)
    {
	var x1	= -1;

	while (x1 < 2) {
	    if ((j + x1) >= 0 && this.workingCopyMatrix[i][j + x1] !== undefined) {
		if (this.workingCopyMatrix[i][j + x1] == 1) {
		    this.patternInConstruction.push(  new Square(j + x1, i)  );

		    // this bit 1 is now part of a pattern
		    // remove trace of its trace into the matrix
		    this.workingCopyMatrix[i][j + x1] = 0;

		    if ((j + x1) != j) {
			this._detectX(i, j + x1);
		    }
		    this._detectY(i, j + x1);
		}
	    }
	    x1++;
	}
    }


    _defaultPathAttributes() {
	//by default stroke && fill of a path
	// are black
	return {
	    "fill": "#000000", 
	    "stroke-width": 1,
	    "stroke":"#000000"
	};
    }

    _calculateSquareSize() {
	//square size equals (final svg size - frame border size) divide
	// by the number of squares on one line	
	return (this.svgSize - (this.svgFrameSize * 2)) / (this.bitMatrix.length);
    }

    /**
     * Generate an svg image
     * @param object settings
     * @param object attributes of svg element
     * @return string svg 
     */
    generate (settings, attributes) {
	var i = 0; //indice for pattern array
	var j = 0; //indice for square array
	var squareSize; //pixel size of a square;

	//application scope of drawing methods
	//square|pattern
	var scope;

	//array of colors use to fill pattern or square
	var fillColors;
	var color; //color in use

	var square;

	if (!settings) settings = {};

	if (!attributes) attributes = this._defaultPathAttributes();	

	fillColors	= settings['fill-colors'];

	squareSize = this._calculateSquareSize();

	//loop on patterns
	for (; i < this.patterns.length; i++) {

	    //choose a color here if a list is set and scope is pattern
	    if (fillColors && settings['fill-colors-scope'] != "square") {
		//use modulo for applying a color
		color = fillColors[i % fillColors.length];
	    }

	    //loop on squares inside a pattern
	    for( j = 0; j < this.patterns[i].length; j++ ) {
		var pathAttributes = this._clone(attributes);				

		if (fillColors && settings['fill-colors-scope'] == "square") {
		    color = fillColors[j % fillColors.length];
		}

		square = this.patterns[i][j];

		square.hasSquareAbove = this._squareExists(square.matrixX, square.matrixY - 1);
		square.hasSquareOnRight = this._squareExists(square.matrixX + 1, square.matrixY);
		square.hasSquareBelow = this._squareExists(square.matrixX, square.matrixY + 1);
		square.hasSquareOnLeft = this._squareExists(square.matrixX - 1, square.matrixY);

		square.size  = squareSize;

		if (color) {
		    pathAttributes.fill = color;

		    if (pathAttributes.stroke === undefined && pathAttributes['stroke-width']) {
			pathAttributes.stroke = color;
		    }

		}

		pathAttributes.d = this.generatePathData(square, settings);

		this.svg.path( pathAttributes );
	    }
	}
	return this.svg.render();
    }

    /**
     * returns data string of a square represetation
     * using path syntax
     */
    generatePathData(square, settings) {
	var drawingMethod = settings.method || 'classic';

	switch (drawingMethod) {
	case 'classic':
	    return this._generateSquarePath(square, settings);
	case 'round':
	    return this._generateRoundedSquarePath(square, settings);
	case 'bevel':
	    return this._generateBeveledSquarePath(square, settings);
	default:
	    throw new Error("Drawing method not found");
	}
    }


    _generateSquarePath(square, settings) {
	settings.radius = 0;

	return this._generateRoundedSquarePath(square, settings);
    }

    _generateRoundedSquarePath(square, settings) {
	var topLeftPointX = square.matrixX * square.size + this.svgFrameSize;
	var topLeftPointY = square.matrixY * square.size + this.svgFrameSize;
	var radius	  = (settings.radius !== undefined) ? settings.radius : 5;
	var path 	  = " M ";
	var isSquareScope = (settings.scope == "square");
	var addEffectOnTopLeftPoint = (isSquareScope || square.didNotShareTopLeftPoint());
	var addEffectOnTopRightPoint = (isSquareScope || square.didNotShareTopRightPoint());
	var addEffectOnBottomRightPoint = (isSquareScope || square.didNotShareBottomRightPoint());
	var addEffectOnBottomLeftPoint = (isSquareScope || square.didNotShareBottomLeftPoint());

	/* top left */
	path += ((addEffectOnTopLeftPoint) ? topLeftPointX + radius : topLeftPointX) + "," + topLeftPointY + " L "; 

	/* top right */
	path += ((addEffectOnTopRightPoint) ? topLeftPointX + square.size - radius : topLeftPointX + square.size) + "," + topLeftPointY;
	path += (!addEffectOnTopRightPoint) ? " L " : " Q " + (topLeftPointX + square.size) + "," + (topLeftPointY) + " " + (topLeftPointX + square.size) + "," + (topLeftPointY + radius) + " L ";


	/* bottom right */
	path += (topLeftPointX + square.size) + "," + ((addEffectOnBottomRightPoint) ? topLeftPointY + square.size - radius : topLeftPointY + square.size);
	path += (!addEffectOnBottomRightPoint) ? " L " : " Q " + (topLeftPointX + square.size) + "," + (topLeftPointY + square.size) + " " + (topLeftPointX + square.size - radius) + "," + (topLeftPointY + square.size) + " L ";


	/* bottom left */
	path += ((addEffectOnBottomLeftPoint) ? topLeftPointX + radius : topLeftPointX) + "," + (topLeftPointY + square.size);
	path += (!addEffectOnBottomLeftPoint) ? " L " : " Q "+ topLeftPointX + "," + (topLeftPointY + square.size) + " " + topLeftPointX + "," + (topLeftPointY + square.size - radius) + " L ";


	/* top left */
	path += topLeftPointX + "," + ((addEffectOnTopLeftPoint) ? topLeftPointY + radius : topLeftPointY);

	path += (!addEffectOnTopLeftPoint) ? "" : " Q " + topLeftPointX + "," + topLeftPointY + " " + (topLeftPointX + radius) + "," + topLeftPointY;

	path += " Z";

	return path;
    }

    _generateBeveledSquarePath(square, settings) {
	var topLeftPointX = square.matrixX * square.size + this.svgFrameSize;
	var topLeftPointY = square.matrixY * square.size + this.svgFrameSize;
	var radius	  = settings.radius || 5;
	var path 	  = " M ";
	var isSquareScope = (settings.scope == "square");
	var addEffectOnTopLeftPoint = (isSquareScope || square.didNotShareTopLeftPoint());
	var addEffectOnTopRightPoint = (isSquareScope || square.didNotShareTopRightPoint());
	var addEffectOnBottomRightPoint = (isSquareScope || square.didNotShareBottomRightPoint());
	var addEffectOnBottomLeftPoint = (isSquareScope || square.didNotShareBottomLeftPoint());
	var coords = [];

	coords.push([(addEffectOnTopLeftPoint) ? topLeftPointX + radius : topLeftPointX, topLeftPointY]);			
	coords.push([(addEffectOnTopRightPoint) ? topLeftPointX + square.size - radius : topLeftPointX + square.size, topLeftPointY]);

	if (addEffectOnTopRightPoint) {
	    coords.push([topLeftPointX + square.size, topLeftPointY + radius]);
	}

	coords.push([topLeftPointX + square.size, (addEffectOnBottomRightPoint) ? topLeftPointY + square.size - radius : topLeftPointY + square.size]);

	if (addEffectOnBottomRightPoint) {
	    coords.push([topLeftPointX + square.size - radius, topLeftPointY + square.size]);
	}

	coords.push([(addEffectOnBottomLeftPoint) ? topLeftPointX + radius : topLeftPointX, topLeftPointY + square.size]);

	if (addEffectOnBottomLeftPoint) {
	    coords.push([topLeftPointX, topLeftPointY + square.size - radius]);
	}

	coords.push([topLeftPointX, (addEffectOnTopLeftPoint) ? topLeftPointY + radius : topLeftPointY]);

	if (addEffectOnTopLeftPoint) {
	    coords.push([topLeftPointX + radius, topLeftPointY]);
	}

	for (var i = 0; i < coords.length; i++) {
	    path += coords[i][0] + " " + coords[i][1] + " ";

	    path += (i != coords.length - 1) ? "L" : "Z";				
	}

	return path;
    }


    /**
     * set the background of the qrCode
     * @param object settings for customized element
     * @param object attributes of the svg element
     */
    background (pSettings, pAttributes) {
	
	if (!pSettings && !pAttributes) {
		  throw new Error("background method needs at least settings or attributes");
	}

	var msize  		= this.svgSize,
	settings 	= pSettings || {},
	attributes 	= pAttributes || {},
	stroke 		= attributes['stroke-width'] || 0,
	padding		= settings.padding || 0,
	margin		= settings.margin || 0,
	x,
	y;

	this.svgFrameSize = stroke + padding + margin;

	if ( stroke ) msize -= stroke;
	if ( margin ) msize -= margin * 2;

	x = y  = (stroke) ? stroke / 2 : 0;

	attributes.x 	= x + margin;
	attributes.y 	= y + margin;
	attributes.width	= msize;
	attributes.height 	= msize;

	this.svg.rect(attributes);

	return this;
    }


}

module.exports = Qrcodesvg;
