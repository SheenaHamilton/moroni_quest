const router = require('express').Router();

const leaderController = require('../controllers/leader');
const validate = require('../validation/leaderValidation');
//const { isAuthenticated } = require("../middleware/authenticate");

router.get('/by-allergies', leaderController.getLeaderByAllergies);
//router.get('/by-allergies', isAuthenticated, leaderController.getLeaderByAllergies); 

router.get('/by-food', leaderController.getLeaderByFoodIssues);
//router.get('/by-food', isAuthenticated, leaderController.getLeaderByFoodIssues);

router.get('/by-sleep', leaderController.getLeaderBySleepingArrangement);
//router.get('/by-sleep', isAuthenticated, leaderController.getLeaderBySleepingArrangement);

router.get('/:id', leaderController.getLeader);
//router.get('/:id', isAuthenticated, leaderController.getLeader);

router.get('/', leaderController.getAllLeaders);
//router.get('/', isAuthenticated, leaderController.getAllLeader);

router.post('/', validate.validateLeader(), validate.checkLeaderValidation, leaderController.createLeader);
//router.post('/', isAuthenticated, validate.validateLeader(), validate.checkLeaderValidation, leaderController.createLeader);

router.put('/:id', validate.validateLeader(), validate.checkLeaderValidation, leaderController.updateLeader);
//router.put('/:id', isAuthenticated, validate.validateLeader(), validate.checkLeaderValidation, leaderController.updateLeader);

router.delete('/:id', leaderController.deleteLeader);
//router.delete('/:id', isAuthenticated, leaderController.deleteLeader);

module.exports = router;