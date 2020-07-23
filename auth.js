
var express = require('express');
var router = express.Router();
const request = require('request');


// change path and callback address in github?
router.get('/github/login/return', function(req, res) {

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
			res.send(`
				<script>
					const opener = window.opener;
					const data = '${JSON.stringify(body)}';
					opener.postMessage(data, "${process.env.FRONTEND_DOMAIN}");
				</script>
				`);
		}
	});
});

module.exports = router;
