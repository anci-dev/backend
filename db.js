const request = require('request-promise');

function getRepositoryInfo(repositories) {
    return request({
        uri:`${process.env.DB_API_DOMAIN}api/repository`,
        qs:{"repositories": repositories},
        json: true}
    );
}

function addUserToDB(userID) {
    request({
        uri:`${process.env.DB_API_DOMAIN}api/profile/${userID}/createUser`,
        method: "POST",
        json: true,
    })
    .catch(function(err) {
        // No real handling required
        console.log("User %s already in db.", userID);
    });
}

module.exports = {addUserToDB, getRepositoryInfo};
