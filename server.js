const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', require('./routes'));

//Catch all Error
process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Exception occurred: ${err}\n` + `Exception occurred at ${origin}`);
});

if (require.main === module) {
    mongodb.initDB((err) => {
        if (err) {
            console.log(err);
        } else {
            app.listen(port, () => console.log(`Moroni's Quest running on port ${port}`));
        }
    });
}

module.exports = app;