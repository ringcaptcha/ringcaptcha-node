var _ = require("lodash"),
	ringcaptchaService = [ 'verify', 'captcha', 'sms' ],
	RCError = require('./errorCodes.js');


function RingCaptchaClient( config, options ) {

	var self;
	
	self = this instanceof RingCaptchaClient ? this : Object.create( RingCaptchaClient.prototype );

	self.server = "api.ringcaptcha.com";

	if( config.api_key === undefined || config.app_key === undefined || config.secret === undefined ) {
		throw new Error('Invalid API KEYS supplied.');
	}

	self.config = {
		api_key: config.api_key,
		app_key: config.app_key,
		secret_key: config.secret
	};

	return self;
}


RingCaptchaClient.prototype.verifyCode = function( code ) {
	return 1;
}


module.exports = RingCaptchaClient;