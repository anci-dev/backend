// Basic app setup things
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
require('dotenv').config();

// Passport / auth requirements
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const crypto = require('crypto')
const passport = require('passport')
const GithubStrategy = require('passport-github').Strategy

console.log(process.env.CALLBACK_URL);

// Connect app with auth requirenments
app.use(cookieParser())
app.use(
    expressSession({
        secret: crypto.randomBytes(64).toString('hex'),
        resave: true,
        saveUninitialized: true
    })
)

// Configure passport
let scopes = ['notifications', 'user:email', 'read:org', 'repo']
passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT,
			clientSecret: process.env.GITHUB_SECRET,
			callbackURL: process.env.CALLBACK_URL,
			scope: scopes.join(' ')
		},
		function(token, tokenSecret, profile, cb) {
			return cb(null, { profile: profile, token: token })
		}
	)
)
passport.serializeUser(function(user, done) {
	done(null, user)
})
passport.deserializeUser(function(obj, done) {
	done(null, obj)
})
app.use(passport.initialize())
app.use(passport.session())

// Move all defaults to the auth route
app.use('/auth', require('./auth'));
app.use('/logoff', (_, res) => res.redirect("/auth/logoff"));

// Final app preparations
app.get('/', (req, res) => {
    console.log(req.session.passport ? req.session.passport.user : "no user");
    if(req.session.passport) {
        res.send(`Hey there ${req.session.passport.user.profile.displayName}. This is your github info:\n${JSON.stringify(req.session.passport.user)}`);
    } else res.send('Hello World! <a href="/auth/github">Click to login with GitHub</a>')
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
