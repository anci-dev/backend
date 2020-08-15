var express = require('express');
var router = express.Router();
const request = require('request-promise');

function addRepoInfo(repo, extraData) {
    // using 'integrated' as test value
    repo.integrated = false;

    var matching = extraData.find(element => element.ID == repo.id);
    if (matching) {
        delete matching.ID;
        repo = {...repo, ...matching};
        repo.integrated = true;
    }
    return repo;
}

// Accepts a single repo or list of repos, and returns associated db information
router.get("/repo_status", function(req, res) {
    // get user's repos from github
    request.get("https://api.github.com/user/repos", {
        headers: {
            "Authorization": `token ${req.query.access_token}`,
            "user-agent": "node.js",
        },
        json: true,
    }).then(function(data) {
        var ids = data.map(item => item.id);
        // get extra repo info from our db
        request.get({uri:"http://localhost:5000/api/repo", qs:{"repositories": ids}, json: true})
        .then(function(extraRepoData) {
            data = data.map(item => addRepoInfo(item, extraRepoData.repositories));
            res.send(data);
        });
    });

});

module.exports = router;
