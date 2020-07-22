// Basic app setup things
const app = require('express')();
require('dotenv').config()
const port = process.env.PORT || 3000;

// Move all defaults to the auth route
app.use('/auth', require('./auth'));

// Final app preparations
app.get('/', (req, res) => {
    res.send("Hi there. This service works quietly in the background. Props for investigating this domain!")
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
