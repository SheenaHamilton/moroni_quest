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

router.get('/register', (req, res) => {
    res.render('register', {
        title: process.env.SITE_TITLE || "Moroni’s Quest",
        stake: process.env.STAKE_NAME || 'Sherwood Park Stake',
        campStartISO: process.env.CAMP_START_ISO || '2026-07-07T00:00:00-06:00'
    });
});

router.use('/photos', require('./photos'));
router.use('/inquiries', require('./inquiries'));
router.use('/bomchallenges', require('./bomchallenges'));

router.use('/youth', require('./youth'));
router.use('/leader', require('./leader'));

router.get('/prepare', (req, res) => {
    res.render('prepare', {
        // PDFs/images (put files in /public/files and /public/img)
        packingPdfUrl: process.env.PACKING_PDF_URL || '/files/packing-list.pdf',
        medicalFormUrl: process.env.MEDICAL_FORM_URL || '/files/medical-release.pdf',
        consentFormUrl: process.env.CONSENT_FORM_URL || '/files/consent-form.pdf',
        formsPacketUrl: process.env.FORMS_PACKET_URL || '', // optional
        mapImageUrl: process.env.MAP_IMAGE_URL || '/img/camp-map.jpg',

        // logistics (override from .env if desired)
        departTime: process.env.DEPART_TIME,   // e.g., "8:00 AM, July 7"
        departPlace: process.env.DEPART_PLACE, // e.g., "Stake Center Gym"
        returnTime: process.env.RETURN_TIME,   // e.g., "5:00 PM, July 10"
        returnPlace: process.env.RETURN_PLACE  // e.g., "Stake Center"
    });
});

module.exports = router;