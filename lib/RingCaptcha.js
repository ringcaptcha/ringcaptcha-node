var http 	= require("http"),
	https 	= require("https"),
	async 	= require("async"),
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
	this.request( 'normalize', { phone: phone }, cb );
}


/**
 * RingCaptcha generate pincode to be sent to the user 
 *
 * @param {string} phone
 * @param {object} type
 * @param {function} cb
 */
RingCaptchaClient.prototype.generate = function( phone, type, cb) {
	var self = this,
		locale = 'en_ph';

	var options = {
		type: type || 'sms',
		app_key: self.config.getAppKey(),
		api_key: self.config.getApiKey(),
		token: self.token,
		phone: '+' + phone
	};

	if( !self.token ) {
		(function(callBack) {
			self.getToken(locale, function(response) {
				if( response.token ) {
					callBack();
				}else {
					throw new Error('Error retrieving token.');
				}
			});
		})(function() {
			options.token = self.token;
			self.request(['code', '/', options.type].join(''), options, cb);
		});
	}else {
		this.request(['code', '/', options.type].join(''), options, cb);
	}
}

/**
 * RingCaptcha verify
 *
 * @param {string} code
 * @param {function} cb
 */
RingCaptchaClient.prototype.verify = function( code, cb) {
	var self = this;

	var options = {
		app_key: self.config.getAppKey(),
		api_key: self.config.getApiKey(),
		token: self.token,
		code: code
	};

	if( !self.token ) {
		(function(callBack) {
			self.getToken(locale, function(response) {
				if( response.token ) {
					callBack();
				}else {
					throw new Error('Error retrieving token.');
				}
			});
		})(function() {
			options.token = self.token;
			self.request('verify', options,  cb );
		});
	}else {
		this.request('verify', options,  cb );
	}
}


module.exports = RingCaptchaClient;