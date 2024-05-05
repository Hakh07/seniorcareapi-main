const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const authenticate = require("../middleware/authenticate");

// Create a Doctor
router.post("/", authenticate, doctorController.createDoctor);

// Upload the Doctor Picture
router.post(
  "/upload-doctor-image",
  authenticate,
  doctorController.uploadDoctorImage
);

// Get All Doctors (including Appointments)
router.get("/", authenticate, doctorController.getAllDoctors);

// Search Doctors
router.get("/search", authenticate, doctorController.searchDoctor);

// Get Doctor by ID (including Appointments and Ratings)
router.get("/:id", authenticate, doctorController.getDoctorById);

// Update Doctor
router.put("/:id", authenticate, doctorController.updateDoctor);

// Delete Doctor
router.delete("/:id", authenticate, doctorController.deleteDoctor);

module.exports = router;
