
var express = require('express');
var session = require('express-session');
var router = express.Router();
const passport = require('passport');
const COOKIE = process.env.DOMAIN;
const request = require('request');

router.get('/get_token', function(req, res){
	console.log(req.query.code);

	// var data = "client_id=" + process.env.GITHUB_CLIENT;
    // data += "client_secret" + process.env.GITHUB_SECRET;
    // data += "code" + req.query.code;

	request.post("https://github.com/login/oauth/access_token", {
        json: {
			client_id: process.env.GITHUB_CLIENT,
			client_secret: process.env.GITHUB_SECRET,
			code: req.query.code,
		}
    }, (error, response, body) => {
		if (error) {
			console.log(error);
		} else {
			console.log(body);
			res.header("Access-Control-Allow-Origin", "*");
			res.send(JSON.stringify(body));
		}
	});
})

router.get('/get_code', function(req, res) {
	console.log(req.query);
});

router.get('/logoff', function(req, res) {
	res.clearCookie(COOKIE)
	res.redirect('/')
})

router.get('/github', passport.authenticate('github'))

router.get(
	'/github/login/return',
	passport.authenticate('github', { successRedirect: '/auth/setcookie', failureRedirect: '/' })
)

router.get('/setcookie', function(req, res) {
	let data = {
		user: req.session.passport.user.profile._json,
		token: req.session.passport.user.token
	}
	res.cookie(COOKIE, JSON.stringify(data))
	res.redirect('/')
})

module.exports = router;
