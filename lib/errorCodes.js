function errorCodes(code) {
	var codes = {
		"ERROR_INVALID_SECRET_KEY": "Client is using incorrect keys or domain/application name",
		"ERROR_INVALID_APP_KEY": "Client is using incorrect keys or domain/application name",
		"ERROR_INVALID_DOMAIN": "Client is using incorrect keys or domain/application name"
	};
	console.log(code);
	//return (codes[code]) ? codes[code] : 'Unkown error';
}
module.exports = errorCodes;