const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const medicineController = require("../controllers/medicineController");
const authenticate = require("../middleware/authenticate");

// Create a Medicine
router.post("/", authenticate, medicineController.createMedicine);

// Get All Medicines
router.get("/", authenticate, medicineController.getAllMedicines);

router.get(
  "/get-medicines-prescription-id/:id",
  authenticate,
  medicineController.getMedicinesByPrescriptionId
);

// Get All Medicines
router.get(
  "/get-medicines-for-today",
  authenticate,
  medicineController.getAvailableMedicinesForToday
);

// Get Medicine by ID
router.get("/:id", authenticate, medicineController.getMedicineById);

// Update Medicine
router.put("/:id", authenticate, medicineController.updateMedicine);

// Delete Medicine
router.delete("/:id", authenticate, medicineController.deleteMedicine);

// Get Medicines for Today's Date
router.get("/today", authenticate, medicineController.getMedicinesForDate);

module.exports = router;
