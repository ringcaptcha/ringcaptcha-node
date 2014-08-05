var http = require("http"),
		https = require("https"),
		util = require("util"),
		querystring = require("querystring"),
		ringcaptchaService = [ 'verify', 'captcha', 'sms' ],
		RCError = require('./errorCodes.js');

function RingCaptchaClient( config, options ) {

	var self;

	self = this instanceof RingCaptchaClient ? this : Object.create( RingCaptchaClient.prototype );

	self.hostname = "api.ringcaptcha.com", self.token = null;

	if( config.api_key === undefined || config.app_key === undefined || config.secret_key === undefined ) {
		throw new Error('Invalid API KEYS supplied.');
	}

	self.config = {
		api_key: config.api_key,
		app_key: config.app_key,
		secret_key: config.secret
	};

	//set default options { secure: true };
	self.options = options || { secure: true };

	self.request = function ( endpoint, params, callback ) {
		var server = ( self.options.secure ) ? https : http;

		var postData = querystring.stringify( params );
		var serverOptions = {
			hostname: self.hostname,
			path: '/' + self.config.app_key + '/' + endpoint,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postData.length
			}
		};

		var req = server.request( serverOptions, function( res ) {
			res.on('data', function( data ) {
				var object = JSON.parse( data.toString() );
				if (object.token) self.token = object.token;
				callback(object);
			})
		});
		req.write( postData );
		req.end();
	};

	return self;
}

RingCaptchaClient.prototype.getToken = function( locale, cb) {
	var self = this;
	options = {
		locale: locale,
		app_key: self.config.app_key,
		api_key: self.config.api_key
	}
	self.request('captcha', options, function(response) { 
		cb(response);
	});
}

RingCaptchaClient.prototype.normalize = function( phone, cb ) {
	this.request( 'normalize', { phone: phone }, cb );
}

RingCaptchaClient.prototype.generate = function( phone, type, cb) {
	var self = this;
	var options = {
		type: type || 'sms',
		app_key: self.config.app_key,
		api_key: self.config.api_key,
		token: self.token,
		phone: '+' + phone
	};
	this.request(['code', '/', options.type].join(''), options, cb);
}

RingCaptchaClient.prototype.verify = function( code, cb) {
	var self = this;
	var options = {
		app_key: self.config.app_key,
		api_key: self.config.api_key,
		token: self.token,
		code: code
	};

	this.request('verify', options,  cb );
}


module.exports = RingCaptchaClient;