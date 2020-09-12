var express = require('express');
var router = express.Router();
const request = require('request-promise');
const github = require('./github');
const db = require('./db');
const stripe = require('./stripe');

router.get("/getBuilds", async function(req, res) {
    var data = await db.getBuilds(req.query.repo);
    res.send(data.records);
});

router.get("/getAllRepos", async function(req, res) {
    function combineRepoInfo(repo, extraData) {
        // using 'integrated' as test value to determine whether the repo is active
        repo.integrated = false;

        var matching = extraData.find(element => element.id == repo.id);
        if (matching) {
            repo = {...repo, ...matching};
            repo.integrated = true;
        }
        return repo;
    }


    // get user's repos from github
    var repos = await github.getUserRepos(req.query.access_token);
    // get extra repo info from our db
    var dbRepoData = await db.getRepositoryInfo(repos.map(item => item.id));

    // combine data
    repos = repos.map(item => combineRepoInfo(item, dbRepoData.records));
    res.send(repos);
});

router.post("/createStripeCustomer", async function(req, res) {
    console.log(req.body);
    // include default data that can pull from github
    // can be changed by the user later if needed
    var data = {};
    // combine the following two
    const user = await github.getUserInfo(req.body.access_token);
    console.log(user);
    const newStripeCustomer = await stripe.createNewCustomer(data);
    console.log(newStripeCustomer);

    db.addStripeToUser(user.id, newStripeCustomer.id);
});

router.post("/updateStripeCustomer", async function(req, res) {

});

router.post("/addPaymentMethod", async function(req, res) {

});

module.exports = router;
