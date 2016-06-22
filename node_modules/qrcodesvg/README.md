qrcodesvg-node
===========

[![Build Status](https://travis-ci.org/pinchtools/qrcodesvg-node.svg)](https://travis-ci.org/pinchtools/qrcodesvg-node)
[![npm version](https://badge.fury.io/js/qrcodesvg.svg)](https://badge.fury.io/js/qrcodesvg)

Create custom QR Code with SVG

## Install

    npm install qrcodesvg --save

## Usage

```js
var Qrcodesvg = require('qrcodesvg');

//create a simple Qrcode of 400px
var qrcode = new Qrcodesvg("Hello!", 400);
var data = qrcode.generate();
```
or 

```js
var Qrcodesvg = require('qrcodesvg');

//Generate a Qrcode with a correction level of 2
//and affect randomly one of the colors defined to patterns
var qrcode = new Qrcodesvg("Hello!", 400, {"ecclevel" : 2});

var data = qrcode.generate({
                                "method":"classic",
                                "fill-colors":["#1C46ED","#021872","#0125C4"]
                            },
                            {
                                "stroke-width":1
                            });
```

## Examples

### Server-side

See Qrcodesvg in action with few examples

```
gulp server
```

### Bundling for browsers
```
gulp client
```

## API

### new Qrcodesvg(input, size, [, options])
- `input`
- `size`
  - size of the rendered QR Code
- `options`
  - `ecclevel`
    - Default is 1
    - accepted correction level from 1 to 4

### qrcodesvg.generate([settings, attributes])
  Returns the svg content as a string

- `settings`
  - `method`
    - drawing method, default is "classic"
    - available methods : "classic", "bevel", "round"
  - `scope`
    - scope where to applying drawing method
    - default is "pattern"
    - available options : "pattern", "square"
  - `fill-color`
    -  array of hexadecimal colors
  - `fill-colors-scope`
    - default is "pattern"
    - available options : "pattern", "square"
  - `radius`
    - for "round" and "bevel" methods only
    - Default is 5
- `attributes`
  - svg attributes added to square elements

### qrcodesvg.background(settings [, attributes])
Returns "this"

- `settings`
  - margin
    - Default is 0
  - padding
    - Default is 0
- `attributes`
  - svg attributes applied to the background element


## Test

```
mocha
```

## LICENSE

The MIT License (MIT)

Copyright (c) 2015 Vincent Pellé

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.