const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Moroni's Quest Project']
    res.send('Moroni\'s Quest');
});

//router.use('/registration_youth', require('./regYouth'));

//router.use('/registration_leader', require('./regLeader'));

module.exports = router;