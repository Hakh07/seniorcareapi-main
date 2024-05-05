const db = require("../models");
const Prescription = db.prescriptions;
const Medicine = db.medicines;

exports.createPrescription = async (req, res) => {
  try {
    const { doctor_name, start_date, user_id, notify_me } = req.body;

    const newPrescription = await Prescription.create({
      doctor_name,
      start_date,
      user_id,
      notify_me,
    });

    res.status(201).json({
      message: "Prescription created successfully",
      prescription: newPrescription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating prescription" });
  }
};

exports.getAllPrescriptions = async (req, res) => {
  try {
    const { userId } = req.query;
    const prescriptions = await Prescription.findAll({
      // Include related models (optional)
      where: {
        user_id: userId,
      },
    });

    res.status(200).json({ prescriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving prescriptions" });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({ prescription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving prescription" });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctor_name, start_date, user_id, notify_me } = req.body;

    const [updatedCount] = await Prescription.update(
      {
        doctor_name,
        start_date,
        user_id,
        notify_me,
      },
      {
        where: { id },
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const updatedPrescription = await Prescription.findByPk(id);

    res.status(200).json({
      message: "Prescription updated successfully",
      prescription: updatedPrescription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating prescription" });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    // Find all medicines associated with the prescription
    const medicines = await Medicine.findAll({
      where: { prescription_id: id },
    });

    // Delete all found medicines
    await Promise.all(medicines.map((medicine) => medicine.destroy()));

    // Delete the prescription
    const deletedCount = await Prescription.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting prescription" });
  }
};
