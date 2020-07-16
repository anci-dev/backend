
var express = require('express');
var session = require('express-session');
var router = express.Router();
const passport = require('passport')

router.get('/logoff', function(req, res) {
	res.clearCookie(COOKIE)
	res.redirect('/')
})

router.get('/github', passport.authenticate('github'))

router.get(
	'/login/github/return',
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
