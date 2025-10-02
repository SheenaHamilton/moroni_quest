const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../swagger.json')

router.use('/questapi-docs', swaggerUi.serve);
router.get('/questapi-docs', swaggerUi.setup(swaggerDoc));

module.exports = router;