const express = require('express');
const router = express.Router();
const {
    createClinicalVisit,
    getAllClinicalVisits,
    getClinicalVisitById,
    updateClinicalVisit,
    deleteClinicalVisit,
    addClinicalNote,
    removeClinicalNote
} = require('../controllers/clinicalVisitController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createClinicalVisit);
router.get('/', getAllClinicalVisits);
router.get('/:id', getClinicalVisitById);
router.put('/:id', updateClinicalVisit);
router.delete('/:id', deleteClinicalVisit);
router.post('/:id/notes/:type', addClinicalNote);
router.delete('/:id/notes/:type/:index', removeClinicalNote);

module.exports = router;