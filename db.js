var express = require('express');
var router = express.Router();
const request = require('request');

function addRepoInfo(repo) {
    // get database info each repo

    // using 'integrated' as test value
    repo.integrated = (Math.random() > 0.5);
}

// Accepts a single repo or list of repos, and returns associated db information
router.get("/repo_status", function(req, res) {
    request.get("https://api.github.com/user/repos", {
        headers: {
            "Authorization": `token ${req.query.access_token}`,
            'user-agent': 'node.js',
        }
    }, (error, response, body) => {
		if (error) {
			console.log(error);
		} else {
            // maybe better to pull all repo ids from here, make single
            // db request, then recombine? not sure if we want another
            // file as a more official db api
            var data = JSON.parse(body);
            data.forEach((item) => addRepoInfo(item));

			res.send(data);
		}
	});
});

module.exports = router;
