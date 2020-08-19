const request = require('request-promise');

function getUserRepos(token) {
    return request({
        uri: "https://api.github.com/user/repos",
        headers: {
            "Authorization": `token ${token}`,
            "user-agent": "node.js",
        },
        json: true,
    })
    .catch(function(err) {
        console.log("Unable to get user repositories with token %s", token);
    });
}

function getUserInfo(token) {
    return request({
        uri: "https://api.github.com/user",
        method: "GET",
        headers: {
            "Authorization": `token ${token}`,
            "user-agent": "node.js",
        },
        json: true,
    })
    .catch(function(err) {
        console.log("Unable to get user with that token %s", token);
    });
}

function getAccessToken(code) {
    return request({
		uri: "https://github.com/login/oauth/access_token",
		json: {
			client_id: process.env.GITHUB_CLIENT,
			client_secret: process.env.GITHUB_SECRET,
			code: code,
		}
	})
    .catch(function(err) {
		// Github auth trade-in failed
		console.log(err);
		console.log("Github auth trade-in failed");
	});
}

module.exports = {getUserInfo, getUserRepos, getAccessToken};
