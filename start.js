// Basic app setup things
const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors({origin: process.env.FRONTEND_DOMAIN}));

// Move all defaults to the auth route
app.use('/auth', require('./auth'));

// For querying and updating the database
app.use('/api', require('./api'));

// Final app preparations
app.get('/', (req, res) => {
    res.send("Hi there. This service works quietly in the background. Props for investigating this domain!");
});

if (process.env.FRONTEND_DOMAIN.includes("localhost")) {
    // running locally, include https
    const https = require('https');
    const fs = require('fs');
    const key = fs.readFileSync('./key.pem');
    const cert = fs.readFileSync('./cert.pem');
    const server = https.createServer({key: key, cert: cert }, app);

    server.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
} else {
    app.list(port, () => console.log(`Example app listening at http://localhost:${port}`));
}
