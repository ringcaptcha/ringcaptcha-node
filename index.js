var config = require("./ringcaptcha.js").config,
	RingCaptcha = require('./lib/RingCaptcha.js'),
	options = {
		secure: true
	};


var RC = new RingCaptcha(config.api, options);

console.log(RC.verifyCode(123));