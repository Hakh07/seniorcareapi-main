const db = require("../models");
const Medicine = db.medicines;
const Prescription = db.prescriptions;
const moment = require("moment");
const Sequelize = require("sequelize");

exports.getAvailableMedicinesForToday = async (req, res) => {
  try {
    const userId = parseInt(req.query.user_id);
    const today = moment().format("YYYY-MM-DD"); // Get today's date in YYYY-MM-DD format

    // Find all prescriptions for the user with start date on or after today
    const prescriptions = await Prescription.findAll({
      where: {
        start_date: {
          [Sequelize.Op.lte]: today,
        },
        user_id: userId,
      },
    });

    const allMedicines = []; // Array to store sorted medicines by dose time

    for (const prescription of prescriptions) {
      const prescriptionId = prescription.id; // Extract the prescription ID

      // Find all medicines for the current prescription ID
      const medicines = await Medicine.findAll({
        where: {
          prescription_id: prescriptionId,
        },
      });

      const sortedMedicines = {
        morning: [],
        afternoon: [],
        night: [],
      };

      // Loop through each medicine
      for (const medicine of medicines) {
        if (medicine.morning_dose > 0) {
          sortedMedicines.morning.push(medicine);
        }
        if (medicine.afternoon_dose > 0) {
          sortedMedicines.afternoon.push(medicine);
        }
        if (medicine.night_dose > 0) {
          sortedMedicines.night.push(medicine);
        }
      }

      allMedicines.push(sortedMedicines);
    }

    res.status(200).json({ medicines: allMedicines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving prescriptions" });
  }
};

exports.createMedicine = async (req, res) => {
  try {
    const {
      medicine_type,
      name,
      duration_number,
      duration_type,
      instruction_type,
      morning_dose,
      afternoon_dose,
      night_dose,
      dosage_value,
      dosage_unit,
      notes,
      prescription_id,
    } = req.body;

    const newMedicine = await Medicine.create({
      medicine_type,
      name,
      duration_number,
      duration_type,
      instruction_type,
      morning_dose,
      afternoon_dose,
      night_dose,
      dosage_value,
      dosage_unit,
      notes,
      prescription_id,
    });

    res.status(201).json({
      message: "Medicine created successfully",
      medicine: newMedicine,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating medicine" });
  }
};

exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({
      // Include related models (optional)
      include: [
        { model: "prescription", as: "prescription" }, // Include prescription data
      ],
    });

    res.status(200).json({ medicines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving medicines" });
  }
};

exports.getMedicinesByPrescriptionId = async (req, res) => {
  try {
    const { id } = req.params;
    const medicines = await Medicine.findAll({
      where: {
        prescription_id: id,
      },
    });
    res.status(200).json({ medicines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving medicines" });
  }
};

exports.getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findByPk(id, {
      include: [
        { model: "prescription", as: "prescription" }, // Include prescription data
      ],
    });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json({ medicine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving medicine" });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      medicine_type,
      name,
      doctor_name,
      duration_number,
      duration_type,
      instruction_type,
      morning_dose,
      afternoon_dose,
      night_dose,
      dosage_value,
      dosage_unit,
      notes,
      prescription_id,
    } = req.body;

    const [updatedCount] = await Medicine.update(
      {
        medicine_type,
        name,
        doctor_name,
        duration_number,
        duration_type,
        instruction_type,
        morning_dose,
        afternoon_dose,
        night_dose,
        dosage_value,
        dosage_unit,
        notes,
        prescription_id,
      },
      {
        where: { id },
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const updatedMedicine = await Medicine.findByPk(id);

    res.status(200).json({
      message: "Medicine updated successfully",
      medicine: updatedMedicine,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating medicine" });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Medicine.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting medicine" });
  }
};

exports.getMedicinesForDate = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

    const medicines = await Medicine.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.like]: `${today}%`, // Filter by prescriptions created today
        },
      },
      include: [
        { model: "prescription", as: "prescription" }, // Include prescription data
      ],
    });

    res.status(200).json({ medicines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving medicines" });
  }
};
