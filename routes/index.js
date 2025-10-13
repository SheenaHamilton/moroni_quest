const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Moroni']
    res.send("Moroni's Quest");
});

// Tyler's collections
router.use('/photos', require('./photos'));
router.use('/inquiries', require('./inquiries'));
router.use('/bomchallenges', require('./bomchallenges'));

// Sheena's collections
router.use('/youth', require('./youth'));
router.use('/leader', require('./leader'));

module.exports = router;