const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Moroni's Quest Project']
    res.send('Moroni\'s Quest');
});

router.use('/youth', require('./youth'));

module.exports = router;