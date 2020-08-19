var express = require('express');
var router = express.Router();
const request = require('request-promise');
const github = require('./github');
const db = require('./db');

function addRepoInfo(repo, extraData) {
    // using 'integrated' as test value to determine whether the repo is active
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
router.get("/repo_status", async function(req, res) {
    // get user's repos from github
    var repos = await github.getUserRepos(req.query.access_token);
    // get extra repo info from our db
    var dbRepoData = await db.getRepositoryInfo(repos.map(item => item.id));

    // combine data
    repos = repos.map(item => addRepoInfo(item, dbRepoData.records));
    res.send(repos);
});

module.exports = router;
