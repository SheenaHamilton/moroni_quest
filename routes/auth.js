const router = require('express').Router();
const passport = require('../utilities/passport');

// Initiate Google OAuth login
router.get('/login', passport.authenticate('google', {
    scope: ['profile', 'email']
})    //#swagger.tags=['Authentication']
    //#swagger.path = '/auth/login'
);

// Google OAuth callback
router.get('/callback', passport.authenticate('google', { failureRedirect: '/auth/failed' }),
    (req, res) => {
        req.login(req.user, (err) => {
            if (err) return res.status(500).json({ message: 'Login failed' });
            req.session.user = req.user;
            req.session.save(() => {
                res.redirect(process.env.CLIENT_URL);
            });
        });
    }
);

// Login failed route
router.get('/failed', (req, res) => {
    //#swagger.tags=['Authentication']
    //#swagger.path = '/auth/failed'
    res.status(401).json({
        success: false,
        message: 'Authentication failed'
    });
});

// Get current user
router.get('/user', (req, res) => {
    //#swagger.tags=['Authentication']
    //#swagger.path = '/auth/user'
    if (req.session.user) {
        res.status(200).json({
            success: true,
            user: req.session.user
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    //#swagger.tags=['Authentication']
    //#swagger.path = '/auth/logout'
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error destroying session' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        });
    });
});

module.exports = router;