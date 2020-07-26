// Basic app setup things
const app = require('express')();
require('dotenv').config()
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors({origin: 'http://localhost:19006'}));

// Move all defaults to the auth route
app.use('/auth', require('./auth'));

// For querying and updating the database
app.use('/db', require('./db'));

// Final app preparations
app.get('/', (req, res) => {
    res.send("Hi there. This service works quietly in the background. Props for investigating this domain!")
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
