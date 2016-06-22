"use strict";

class Square
{
    constructor(matrixX, matrixY) {
	if (matrixX === undefined || matrixY === undefined) {
	    throw new Error("A Square needs x and y coords");	
	}

	this.matrixX 				= matrixX;
	this.matrixY				= matrixY;
    }

    get matrixX() { return  this._matrixX; }
    get matrixY() { return  this._matrixY; }
    get size() { return this._size; }

    get squareAbove() { return this._hasSquareAbove; }
    get hasSquareOnRight() { return this._hasSquareOnRight; }
    get hasSquareBelow() { return this._hasSquareBelow; }
    get hasSquareOnLeft(){ return this._hasSquareOnLeft; }

    set matrixX(str) { this._matrixX = str; }
    set matrixY(str) {  this._matrixY = str; }
    set size(d) { this._size = d; }

    set squareAbove(bool) { this._hasSquareAbove = bool; }
    set hasSquareOnRight(bool) { this._hasSquareOnRight = bool; }
    set hasSquareBelow(bool) { this._hasSquareBelow = bool; }
    set hasSquareOnLeft(bool) { this._hasSquareOnLeft = bool; }

    didNotShareTopLeftPoint() {
	return !(this.hasSquareAbove || this.hasSquareOnLeft);
    }

    didNotShareTopRightPoint() {
	return !(this.hasSquareAbove || this.hasSquareOnRight);
    }

    didNotShareBottomRightPoint() {
	return !(this.hasSquareBelow || this.hasSquareOnRight);
    }

    didNotShareBottomLeftPoint() {
	return !(this.hasSquareBelow || this.hasSquareOnLeft);
    }

}

module.exports = Square;


