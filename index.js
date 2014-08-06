'use strict';

var	path 		= require('path'),
	fs          = require('fs'),
	RingCaptcha = require('./lib/RingCaptcha.js'),
	Config      = require('./lib/Config.js').Config,
	DEFAULT_CONFIG_FNAME = "ringcaptcha.js",
	exists       = fs.existsSync || path.existsSync,
	CONFIG_LOCATIONS = [
		path.join(__dirname, '..', '..'), // above node_modules
		process.cwd()
	];

//find the configuration file in the config locations defined.
function getConfigFile() {
	var filepath;

	for(var i = 0; i < CONFIG_LOCATIONS.length; i++) {
		filepath = path.join(path.resolve(CONFIG_LOCATIONS[i]), DEFAULT_CONFIG_FNAME);
		if(!exists(filepath) ) continue;
		return require(filepath).config;
	}
}
var configError = 'CONFIG: From node_modules/ringcaptcha-node, copy ' + DEFAULT_CONFIG_FNAME + ' into the root directory of your app.';
try{
	var config = getConfigFile();
	if(!config) {
		throw new Error(configError);
	}
}catch(e) {
	throw new Error(configError);
}

var RC = new RingCaptcha( new Config(config.api) );