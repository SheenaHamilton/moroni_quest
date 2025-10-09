const router = require('express').Router();

const youthController = require('../controllers/youth');
const validate = require('../validation/youthValidation');
//const { isAuthenticated } = require("../middleware/authenticate");

router.get('/by-age', validate.validateAgeParams(), validate.checkYouthAgeValidation, youthController.getYouthByAge);
//router.get('/by-age', isAuthenticated, validate.validateAgeParams, validate.checkYouthAgeValidation, youthController.getYouthByAge);

router.get('/by-ward', youthController.getYouthByWard);
//router.get('/by-ward', isAuthenticated, youthController.getYouthByWard);

router.get('/by-medical', youthController.getYouthByMedical);
//router.get('/by-medical', isAuthenticated, youthController.getYouthByMedical);

router.get('/by-allergies', youthController.getYouthByAllergies);
//router.get('/by-allergies', isAuthenticated, youthController.getYouthByAllergies); 

router.get('/by-food', youthController.getYouthByFoodIssues);
//router.get('/by-food', isAuthenticated, youthController.getYouthByFoodIssues);

router.get('/:id', youthController.getYouth);
//router.get('/:id', isAuthenticated, youthController.getYouth);

router.get('/', youthController.getAllYouth);
//router.get('/', isAuthenticated, youthController.getAllYouth);

router.post('/', validate.validateYouth(), validate.checkYouthValidation, youthController.createYouth);
//router.post('/', isAuthenticated, validate.validateYouth(), validate.checkYouthValidation, youthController.createYouth);

router.put('/:id', validate.validateYouth(), validate.checkYouthValidation, youthController.updateYouth);
//router.put('/:id', isAuthenticated, validate.validateYouth(), validate.checkYouthValidation, youthController.updateYouth);

router.delete('/:id', youthController.deleteYouth);
//router.delete('/:id', isAuthenticated, youthController.deleteYouth);

module.exports = router;