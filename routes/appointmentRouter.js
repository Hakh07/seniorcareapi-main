const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authenticate = require('../middleware/authenticate')

// Create an Appointment
router.post('/', authenticate, appointmentController.createAppointment);

// Get All Appointments (including User and Doctor data)
router.get('/', authenticate, appointmentController.getAllAppointments);

// Get latest upcoming appointments from the list
router.get('/latestthreeappointments', authenticate, appointmentController.getLatestUpcomingAppointments);

// Get All Appointments for the user_id
router.get('/all_appointments_by_user_id', authenticate, appointmentController.getAllAppointmentsByUserId);

// Get All Appointments for the doctor_id
router.get('/all_appointments_by_doctor_id', authenticate, appointmentController.getAllAppointmentsByDoctorId);

router.get('/all_available_appointments_for_doctor_id', authenticate, appointmentController.getAvailableSlotsForNext3Days);





// Get Appointment by ID (including User and Doctor data)
router.get('/:id', authenticate,appointmentController.getAppointmentById);

// Update Appointment (allow updating specific fields)
router.put('/:id', authenticate, appointmentController.updateAppointment);

// Delete Appointment
router.delete('/:id', authenticate, appointmentController.deleteAppointment);

module.exports = router;
