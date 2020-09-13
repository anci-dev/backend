
var express = require('express');
var router = express.Router();
const request = require('request-promise');
const github = require('./github');
const db = require('./db');
const stripe = require('./stripe');


// change path and callback address in github?
router.get('/github/login/return', async function(req, res) {

	const token = await github.getAccessToken(req.query.code);
	// User logged in with github

	// login isn't really dependant on the user existing in the db,
	// so we can send response immediately
	res.send(`
		<p>Response sent</p>
		<script>
		const opener = window.opener;
		const data = '${JSON.stringify(token)}';
		opener.postMessage(data, "${process.env.FRONTEND_DOMAIN}");
		</script>
		`);

	// Add user to db in the background
	const githubUser = await github.getUserInfo(token.access_token);
	const profile = await db.getUser(githubUser.id);

	if (profile.found == 0) {
		const newStripeCustomer = await stripe.createNewCustomer({});
		db.addUserToDB(githubUser.id, newStripeCustomer.id);
		console.log("Added a new user!");
	}
});

module.exports = router;
