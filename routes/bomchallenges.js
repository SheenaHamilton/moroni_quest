const router = require('express').Router();
const bomchallengesController = require('../controllers/bomchallenges');
const validate = require('../validation/bomchallengesValidation');
//const { isAuthenticated } = require("../middleware/authenticate");

// Specific routes FIRST (before /:id route)
router.get('/by-book/:book', validate.validateBookParam(), validate.checkChallengeValidation, bomchallengesController.getChallengesByBook);
//router.get('/by-book/:book', isAuthenticated, validate.validateBookParam(), validate.checkChallengeValidation, bomchallengesController.getChallengesByBook);

router.get('/by-schedule/:date', validate.validateDateParam(), validate.checkChallengeValidation, bomchallengesController.getChallengesBySchedule);
//router.get('/by-schedule/:date', isAuthenticated, validate.validateDateParam(), validate.checkChallengeValidation, bomchallengesController.getChallengesBySchedule);

// ID route
router.get('/:id', bomchallengesController.getChallengeById);
//router.get('/:id', isAuthenticated, bomchallengesController.getChallengeById);

// Get all
router.get('/', bomchallengesController.getAllChallenges);
//router.get('/', isAuthenticated, bomchallengesController.getAllChallenges);

// POST route
router.post('/', validate.validateChallenge(), validate.checkChallengeValidation, bomchallengesController.createChallenge);
//router.post('/', isAuthenticated, validate.validateChallenge(), validate.checkChallengeValidation, bomchallengesController.createChallenge);

// PUT route
router.put('/:id', validate.validateChallenge(), validate.checkChallengeValidation, bomchallengesController.updateChallenge);
//router.put('/:id', isAuthenticated, validate.validateChallenge(), validate.checkChallengeValidation, bomchallengesController.updateChallenge);

// DELETE route
router.delete('/:id', bomchallengesController.deleteChallenge);
//router.delete('/:id', isAuthenticated, bomchallengesController.deleteChallenge);

module.exports = router;