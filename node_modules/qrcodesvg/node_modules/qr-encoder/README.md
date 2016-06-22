qr-encoder
===========

[![Build Status](https://travis-ci.org/pinchtools/qr-encoder.svg?branch=master)](https://travis-ci.org/pinchtools/qr-encoder)
[![npm version](https://badge.fury.io/js/qr-encoder.svg)](https://badge.fury.io/js/qr-encoder)

Encode a string into a Qr Code bit matrix (two-dimensional array of bits)

EMBEDDED QR Encoder, Copyright 2010, tz@execpc.com.

### Install

```
npm install qr-encoder
```

### Usage

```js
var qrEncoder = require("qr-encoder");
var bitMatrix = qrEncoder.encode("Hi!", 1);
```
### Test

```
npm test
```

