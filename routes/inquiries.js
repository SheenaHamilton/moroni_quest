const router = require('express').Router();
const inquiriesController = require('../controllers/inquiries');
const validate = require('../validation/inquiriesValidation');
//const { isAuthenticated } = require("../middleware/authenticate");

// Specific routes FIRST (before /:id route)
router.get('/by-status/:status', validate.validateStatusParam(), validate.checkInquiryValidation, inquiriesController.getInquiriesByStatus);
//router.get('/by-status/:status', isAuthenticated, validate.validateStatusParam(), validate.checkInquiryValidation, inquiriesController.getInquiriesByStatus);

// ID route
router.get('/:id', inquiriesController.getInquiryById);
//router.get('/:id', isAuthenticated, inquiriesController.getInquiryById);

// Get all
router.get('/', inquiriesController.getAllInquiries);
//router.get('/', isAuthenticated, inquiriesController.getAllInquiries);

// POST route
router.post('/', validate.validateInquiry(), validate.checkInquiryValidation, inquiriesController.createInquiry);
//router.post('/', isAuthenticated, validate.validateInquiry(), validate.checkInquiryValidation, inquiriesController.createInquiry);

// PUT route
router.put('/:id', validate.validateInquiry(), validate.checkInquiryValidation, inquiriesController.updateInquiry);
//router.put('/:id', isAuthenticated, validate.validateInquiry(), validate.checkInquiryValidation, inquiriesController.updateInquiry);

// DELETE route
router.delete('/:id', inquiriesController.deleteInquiry);
//router.delete('/:id', isAuthenticated, inquiriesController.deleteInquiry);

module.exports = router;