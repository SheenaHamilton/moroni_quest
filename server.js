require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); // optional; express has built-ins too
const session = require('express-session');
const passport = require('./utilities/passport');
const mongodb = require('./data/database');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_URL, // if you need multiple origins, use a function here
    credentials: true,
}));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Trust proxy for secure cookies behind a proxy (Render, etc.)
app.set('trust proxy', 1);

// Security headers (allow Google Fonts for our splash styles)
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "script-src": ["'self'"],
        }
    }
}));

// EJS view engine + static assets
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'moronis-quest-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes/swagger'));  // exposes /api-docs

// routes. Authentication first
app.use('/auth', require('./routes/auth'));

app.use('/', require('./routes'));

// Catch all Error (consider an Express error handler too)
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
