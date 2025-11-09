const router = require('express').Router();

router.get('/', (req, res) => {
    //#swagger.tags=['Moroni']
    res.render('index', {
        title: process.env.SITE_TITLE || "Moroni's Quest",
        stake: process.env.STAKE_NAME || 'Sherwood Park Stake',
        campStartISO: process.env.CAMP_START_ISO || '2026-07-07T00:00:00-06:00',
        slogan: ' A Journey Through the Scriptures. Live the Stories.',
        user: req.session.user || null
    });
});

router.use('/photos', require('./photos'));
router.use('/inquiries', require('./inquiries'));
router.use('/bomchallenges', require('./bomchallenges'));

// Sheena's collections
router.use('/youth', require('./youth'));
router.use('/leader', require('./leader'));

module.exports = router;