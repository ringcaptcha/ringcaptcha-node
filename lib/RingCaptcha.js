var http 	= require("http"),
	https 	= require("https"),
	util 	= require("util"),
	Config      = require('./Config.js').Config,
	querystring = require("querystring"),
	ringcaptchaSecuredService = [ 'verify', 'captcha', 'sms' ],
	RCError = require('./errorCodes.js');


/**
 * Creates instance of RingCaptchaClient
 *
 * @constructor
 * @this {RingCaptchaClient}
 * @return {RingCaptchaClient} self
 */
function RingCaptchaClient( config, options ) {

	var self;

	self = this instanceof RingCaptchaClient ? this : Object.create( RingCaptchaClient.prototype );

	self.hostname = "api.ringcaptcha.com", self.token = null;

	if( (config instanceof Config) === false ) {
		throw new Error('Invalid RingCaptcha Configuration passed. config must be an instance of RingCaptchaConfig');
	}

	self.config = config;

	//set default options { secure: true };
	self.options = options || { secure: true };

	self.request = function ( endpoint, params, callback ) {
		var server = ( self.options.secure ) ? https : http;

		var postData = querystring.stringify( params );
		var serverOptions = {
			hostname: self.hostname,
			path: '/' + self.config.getAppKey() + '/' + endpoint,
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

/** 
 *
 * @param {string} locale
 * @param {function} cb
 */
RingCaptchaClient.prototype.getToken = function( locale, cb) {
	var self = this;
	options = {
		locale: locale,
		app_key: self.config.getAppKey(),
		api_key: self.config.getApiKey()
	}
	self.request('captcha', options, function(response) { 
		cb(response);
	});
}

/** 
 *  RingCaptcha normalize
 *
 * @param {string} phone
 * @param {function} cb
 */
RingCaptchaClient.prototype.normalize = function( phone, cb ) {
	var self = this;
	options = {
		phone: phone,
		api_key: self.config.getApiKey()
	}
	self.request( 'normalize', options, cb );
}


/**
 * RingCaptcha generate pincode to be sent to the user 
 *
 * @param {string} phone
 * @param {object} type
 * @param {function} cb
 */
RingCaptchaClient.prototype.generate = function( phone, type, token, cb) {
	var self = this;

	var options = {
		type: type || 'sms',
		app_key: self.config.getAppKey(),
		api_key: self.config.getApiKey(),
		token: token,
		phone: '+' + phone
	};

	this.request(['code', '/', options.type].join(''), options, cb);
}

/**
 * RingCaptcha verify
 *
 * @param {string} code
 * @param {string} token
 * @param {function} cb
 */
RingCaptchaClient.prototype.verify = function( code, token, cb) {
	var self = this;

	var options = {
		app_key: self.config.getAppKey(),
		api_key: self.config.getApiKey(),
		token: token,
		code: code
	};

	this.request('verify', options,  cb );
}


module.exports = RingCaptchaClient;