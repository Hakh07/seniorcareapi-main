const db = require("../models");
const Rating = db.ratings;
const User = db.users;
const Doctor = db.doctors;
const { Sequelize, DataTypes, QueryInterface } = require("sequelize");

exports.createRating = async (req, res) => {
  try {
    const { user_id, doctor_id, rating_number, rating_details } = req.body;

    // Check for existing rating
    const existingRating = await Rating.findAll({
      where: { user_id, doctor_id },
    });

    let newRating;
    if (existingRating.length > 0) {
      newRating = await Rating.update({
        user_id,
        doctor_id,
        rating_number,
        rating_details,
      },
      { where: { user_id, doctor_id }});
    } else {
      newRating = await Rating.create({
        user_id,
        doctor_id,
        rating_number,
        rating_details,
      });
    }

    // Find the doctor to update
    const doctor = await Doctor.findByPk(doctor_id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Find all ratings for the doctor
    const ratings = await Rating.findAll({
      where: { doctor_id },
    });

    // Calculate total rating (assuming all ratings have a number value)
    let totalRating = 0;
    for (const rating of ratings) {
      totalRating += rating.dataValues.rating_number;
    }

    // Calculate average rating (divide by number of ratings)
    const averageRating = totalRating / ratings.length;

    //const actualAverageRating = averageRating[0].dataValues.averageRating;
    // Update doctor with new total ratings and reviews
    const updatedDoctor = await Doctor.update(
      {
        total_ratings: averageRating,
        total_reviews: ratings.length, // Increment total reviews
      },
      { where: { id: doctor_id } }
    );

    res
      .status(201)
      .json({ message: "Rating created successfully", rating: newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating rating" });
  }
};

exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll();

    res.status(200).json({ ratings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving ratings" });
  }
};

exports.getAllRatingsByDoctorID = async (req, res) => {
  try {
    const { doctor_id } = req.query; // Destructure doctor_id from query

    if (!doctor_id) {
      return res
        .status(400)
        .json({ message: "Please provide doctor_id in the query string" });
    }

    const ratings = await Rating.findAll({
      where: {
        doctor_id,
      },
    });
    const doctor = await Doctor.findByPk(doctor_id);

    // Fetch user details for each rating (alternative approach)
    const ratingsWithUsers = await Promise.all(
      ratings.map(async (rating) => {
        const user = await User.findByPk(rating.user_id);

        return { ...rating.dataValues, user: user ? user.dataValues : null }; // Include user if found, otherwise null
      })
    );

    res.status(200).json({
      ratings: ratingsWithUsers,
      doctor: doctor ? doctor.dataValues : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving doctor ratings" });
  }
};

exports.getRatingById = async (req, res) => {
  try {
    const { id } = req.params;

    const rating = await Rating.findByPk(id, {
      include: [
        { model: "user", as: "user" }, // Include user data
        { model: "doctor", as: "doctor" }, // Include doctor data
      ],
    });

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json({ rating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving rating" });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, doctor_id, rating_number, rating_details } = req.body;

    const [updatedCount] = await Rating.update(
      {
        user_id,
        doctor_id,
        rating_number,
        rating_details,
      },
      {
        where: { id },
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    const updatedRating = await Rating.findByPk(id, {
      include: [
        { model: "user", as: "user" }, // Include user data
        { model: "doctor", as: "doctor" }, // Include doctor data
      ],
    });

    res
      .status(200)
      .json({ message: "Rating updated successfully", rating: updatedRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating rating" });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Rating.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting rating" });
  }
};
