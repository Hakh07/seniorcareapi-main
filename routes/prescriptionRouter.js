const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authenticate = require('../middleware/authenticate')

// Create a Prescription
router.post('/',authenticate, prescriptionController.createPrescription);

// Get All Prescriptions
router.get('/',authenticate, prescriptionController.getAllPrescriptions);

// Get Prescription by ID
router.get('/:id',authenticate, prescriptionController.getPrescriptionById);

// Update Prescription
router.put('/:id',authenticate, prescriptionController.updatePrescription);

// Delete Prescription
router.delete('/:id',authenticate, prescriptionController.deletePrescription);

module.exports = router;
