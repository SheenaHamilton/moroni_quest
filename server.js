require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./utilities/passport');
const mongodb = require('./data/database');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'moronis-quest-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// routes. Authentication first
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes'));

// Catch all Error
process.on('uncaughtException', (err, origin) => { console.log(process.stderr.fd, `Exception occurred: ${err}\n` + `Exception occurred at ${origin}`); });

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