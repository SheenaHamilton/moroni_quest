const router = require('express').Router();

const youthController = require('../controllers/youth');
const validate = require('../validation/youthValidation');
//const { isAuthenticated } = require("../middleware/authenticate");

router.get('/:id', youthController.getYouth);

router.get('/', youthController.getAllYouth);

router.post('/', validate.validateYouth(), validate.checkYouthValidation, youthController.createYouth);
//router.post('/', isAuthenticated, validate.validateYouth(), validate.checkYouthValidation, youthController.createYouth);

router.put('/:id', validate.validateYouth(), validate.checkYouthValidation, youthController.updateYouth);
//router.put('/:id', isAuthenticated, validate.validateYouth(), validate.checkYouthValidation, youthController.updateYouth);

router.delete('/:id', youthController.deleteYouth);
//router.delete('/:id', isAuthenticated, youthController.deleteYouth);

module.exports = router;