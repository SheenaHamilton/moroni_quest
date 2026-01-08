const router = require('express').Router();

router.get('/', (req, res) => {
    //#swagger.tags=['Moroni']
    res.render('index', {
        slogan: ' A Journey Through the Scriptures. Live the Stories.',
    });
});

router.get('/403', (req, res) => {
    //#swagger.tags=['Moroni']
    res.render('403', {
        slogan: ' A Journey Through the Scriptures. Live the Stories.',
    });
});

router.use("/register", require("./register"));

router.use('/photos', require('./photos'));

router.use('/inquiries', require('./publicInquiries'));

router.use('/leaders', require('./leadersInquiries'));

router.use('/leaders', require('./leaderresources'));

router.get('/challenge', (req, res) => {
    res.render('challenge');
});

router.use('/youth', require('./youth'));
router.use('/leader', require('./leader'));

router.get('/prepare', (req, res) => {
    res.render('prepare', {
        packingPdfUrl: process.env.PACKING_PDF_URL || '/files/packing-list.pdf',
        medicalFormUrl: process.env.MEDICAL_FORM_URL || '/files/medical-release.pdf',
        consentFormUrl: process.env.CONSENT_FORM_URL || '/files/consent-form.pdf',
        formsPacketUrl: process.env.FORMS_PACKET_URL || '',
        mapImageUrl: process.env.MAP_IMAGE_URL || '/img/camp-map.jpg',
        departTime: process.env.DEPART_TIME,
        departPlace: process.env.DEPART_PLACE,
        returnTime: process.env.RETURN_TIME,
        returnPlace: process.env.RETURN_PLACE
    });
});

router.get('/costumes', (req, res) => {
    res.render('costumes');
});

module.exports = router;
