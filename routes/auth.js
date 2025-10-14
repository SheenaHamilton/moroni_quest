const router = require('express').Router();
const passport = require('passport');

// Initiate Google OAuth login
router.get('/login', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

// Google OAuth callback
router.get('/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/auth/login/failed' 
    }),
    (req, res) => {
        // Successful authentication
        res.redirect(process.env.CLIENT_URL || '/');
    }
);

// Login failed route
router.get('/login/failed', (req, res) => {
    //#swagger.tags=['Authentication']
    res.status(401).json({
        success: false,
        message: 'Authentication failed'
    });
});

// Get current user
router.get('/user', (req, res) => {
    //#swagger.tags=['Authentication']
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