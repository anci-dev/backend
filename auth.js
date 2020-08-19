
var express = require('express');
var router = express.Router();
const request = require('request-promise');
const github = require('./github');
const db = require('./db');


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
	const user = await github.getUserInfo(token.access_token);
	db.addUserToDB(user.id);
});

module.exports = router;
