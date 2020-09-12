const request = require('request-promise');

// Gets a full page of builds from the selected repository
// Can optionally select a page number
function getBuilds(repository, page=0) {
    return request({
        uri: `${process.env.DB_API_DOMAIN}api/build/getBuilds`,
        method: "GET",
        qs: {
            "repoID": repository,
            "page": page
        },
        json: true
    })
    .catch(function(err) {
        console.log("Unable to retrieve builds.");
    });
}

function getRepositoryInfo(repositories) {
    return request({
        uri: `${process.env.DB_API_DOMAIN}api/repository`,
        method: "GET",
        qs: {"repositories": repositories},
        json: true
    })
    .catch(function(err) {
        console.log("Unable to retrieve repo info.");
    });
}

function addUserToDB(userID) {
    request({
        uri: `${process.env.DB_API_DOMAIN}api/profile/${userID}/createUser`,
        method: "POST",
        json: true,
    })
    .catch(function(err) {
        // No real handling required
        console.log("User %s already in db.", userID);
    });
}

function addStripeToUser(userID, stripeCustomerId) {
    request({
        uri: `${process.env.DB_API_DOMAIN}api/profile/${userID}/updateUser`,
        method: "POST",
        body: {
            stripeCustomerId: stripeCustomerId
        },
        json: true,
    })
    .catch(function(err) {
        console.log("Undable to add a Stripe customer ID to this user.");
    })
}

module.exports = {addUserToDB, getRepositoryInfo, getBuilds, addStripeToUser};
