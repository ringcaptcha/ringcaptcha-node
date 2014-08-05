'use strict';

var	path 		= require('path'),
	RingCaptcha = require('./lib/RingCaptcha.js'),
	config 		= {},
	DEFAULT_CONFIG_FNAME = "ringcaptcha.js";

try{
	config = require(path.join(__dirname, '..', '..', DEFAULT_CONFIG_FNAME) ).config;
}catch(e) {
	throw new Error('CONFIG: From node_modules/ringcaptcha-node, copy ' + DEFAULT_CONFIG_FNAME + ' into the root directory of your app.');
}

console.log(config.api);

var RC = new RingCaptcha(config.api);