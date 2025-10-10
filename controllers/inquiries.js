const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Get all inquiries
const getAllInquiries = async (req, res) => {
    //#swagger.tags=['Inquiries']
    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('inquiries')
            .find()
            .toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get inquiry by id
const getInquiryById = async (req, res) => {
    //#swagger.tags=['Inquiries']
    try {
        const inquiryId = new ObjectId(req.params.id);
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('inquiries')
            .findOne({ _id: inquiryId });
        if (!result) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get inquiries by status
const getInquiriesByStatus = async (req, res) => {
    //#swagger.tags=['Inquiries']
    try {
        const status = req.params.status;
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('inquiries')
            .find({ status: status })
            .toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new inquiry
const createInquiry = async (req, res) => {
    //#swagger.tags=['Inquiries']
    try {
        const inquiry = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            subject: req.body.subject,
            message: req.body.message,
            status: req.body.status || 'pending',
            createdAt: new Date(),
        };
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('inquiries')
            .insertOne(inquiry);
        if (result.acknowledged) {
            res.status(201).json({
                message: 'Inquiry created successfully',
                id: result.insertedId,
            });
        } else {
            res.status(500).json({ message: 'Error creating inquiry' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update inquiry
const updateInquiry = async (req, res) => {
    //#swagger.tags=['Inquiries']
    try {
        const inquiryId = new ObjectId(req.params.id);
        const inquiry = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            subject: req.body.subject,
            message: req.body.message,
            status: req.body.status,
            updatedAt: new Date(),
        };
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('inquiries')
            .updateOne({ _id: inquiryId }, { $set: inquiry });
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Inquiry updated successfully' });
        } else {
            res.status(404).json({ message: 'Inquiry not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete inquiry
const deleteInquiry = async (req, res) => {
    //#swagger.tags=['Inquiries']
    try {
        const inquiryId = new ObjectId(req.params.id);
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('inquiries')
            .deleteOne({ _id: inquiryId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Inquiry deleted successfully' });
        } else {
            res.status(404).json({ message: 'Inquiry not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllInquiries,
    getInquiryById,
    getInquiriesByStatus,
    createInquiry,
    updateInquiry,
    deleteInquiry,
};