/**
 * RingCaptcha config processor. This will be used to to pass and validate the configuration given
 *
 * @class Config
 * @param {object} config
 * @return {Config} self
 */
function Config(configKeys) {
	var self;

	self = this instanceof Config ? this : Object.create( Config.prototype );

	if( configKeys.api_key === undefined || configKeys.app_key === undefined || configKeys.secret_key === undefined ) {
		throw new Error('Invalid API KEYS supplied.');
	}
	self.config = {
		api_key: configKeys.api_key,
		app_key: configKeys.app_key,
		secret_key: configKeys.secret_key
	};

	return self;
}

/**
 * Gets the api_key
 *
 * @return {string} api_key
 */
Config.prototype.getApiKey = function() {
	return this.config.api_key;
}

/**
 * Gets the app_key
 *
 * @return {string} app_key
 */
Config.prototype.getAppKey = function() {
	return this.config.app_key;
}

/**
 * Gets the secret
 *
 * @return {string} secret_key
 */
Config.prototype.getSecret = function() {
	return this.config.secret_key;
}

/**
 * Gets the api_key of
 *
 * @return {string} api_key
 */
Config.prototype.toString = function() {
	return '[Object RingCaptchaConfig]';
}

module.exports.Config = Config;