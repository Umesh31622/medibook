const express = require('express');
const router = express.Router();
const {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    deleteAttachment,
    addMedicalCondition,
    removeMedicalCondition
} = require('../controllers/patientController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// Patient CRUD
router.post('/', 
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'attachments', maxCount: 10 }
    ]),
    createPatient
);

router.get('/', getAllPatients);
router.get('/:id', getPatientById);

router.put('/:id',
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'attachments', maxCount: 10 }
    ]),
    updatePatient
);

router.delete('/:id', deletePatient);

// Attachment management
router.delete('/:patientId/attachments/:attachmentId', deleteAttachment);

// Medical conditions management
router.post('/:patientId/conditions', addMedicalCondition);
router.delete('/:patientId/conditions/:conditionId', removeMedicalCondition);

module.exports = router;