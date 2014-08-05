var _ = require("lodash"),
	ringcaptchaService = [ 'verify', 'captcha', 'sms' ],
	RCError = require('./errorCodes.js');

function RingCaptchaClient( config, options ) {

	var self;
	
	self = this instanceof RingCaptchaClient ? this : Object.create( RingCaptchaClient.prototype );

	self.server = "api.ringcaptcha.com";
	self.token = null;

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

RingCaptchaClient.prototype.getToken = function( locale, type, cb) {
	var self = this;
	self.request('captcha', { locale: locale, type: type }, function(response) { 
		cb(response);
	});
}

RingCaptchaClient.prototype.normalize = function( phone, cb ) {
	this.request( 'normalize', { phone: phone }, cb );
}

RingCaptchaClient.prototype.generate = function( phone, cb) {
	var options =  { type: type || 'sms' };
	this.request(['code', '/', options.type].join(''), { phone: '+' + phone }, cb);
}

RingCaptchaClient.prototype.verify = function( code, cb) {
	this.request('verify', { code: code }, cb );
}


module.exports = RingCaptchaClient;