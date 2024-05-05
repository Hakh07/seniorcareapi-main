const multer = require("multer");
const path = require("path");
const { Op } = require("sequelize");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/doctors");
    },
    filename: (req, file, cb) => {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      console.log("extension", extension);
      cb(null, "doctor-" + file.fieldname + "-" + Date.now() + "." + extension);
    },
  }),
  limits: { fileSize: 1000000 }, // Adjust file size limit (in bytes)
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png"]; // Allowed image extensions
    const extname = path.extname(file.originalname);

    if (allowedExtensions.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid image file type"));
    }
  },
});
const db = require("../models");
const Doctor = db.doctors;

exports.uploadDoctorImage = async (req, res) => {
  try {
    if (req.body.imageUrl) {
      // Handle provided imageUrl (logic from previous version)
      const { imageUrl } = req.body;
      const urlRegex = /^(http:\/\/|https:\/\/)?[^\s].[^\s]*$/; // Basic URL format check

      if (!urlRegex.test(imageUrl)) {
        throw new Error("Invalid image URL format");
      }

      // ... additional validation (e.g., check if image exists at URL)

      res
        .status(200)
        .json({ message: "Image uploaded successfully", imageUrl });
    } else {
      // Handle image upload using Multer
      upload.single("image")(req, res, async (error) => {
        if (error) {
          console.error(error);
          if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
              return res.status(400).json({ message: "File too large" });
            } else if (error.message === "Invalid image file type") {
              return res
                .status(400)
                .json({ message: "Invalid image file type" });
            }
          }
          return res.status(500).json({ message: "Error uploading image" });
        }

        const image = req.file;

        console.log("image", image);

        const baseUrl = process.env.BASE_URL;

        // const imageUrl = path.join(
        //   baseUrl,
        //   "uploads",
        //   "doctors",
        //   image.filename
        // );

        const url = new URL(
          path.join("/", "uploads", "doctors", image.filename),
          baseUrl
        );
        console.log(url);

        res.status(200).json({
          message: "Image uploaded successfully",
          imageUrl: url.href,
          filePath: "/uploads/doctors/" + image.filename,
        });
      });
    }
  } catch (error) {
    console.error("Error upload image : ", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    console.log("req body createDoctor", req.body);

    const {
      name,
      profession,
      category,
      address,
      about,
      schedule,
      imageUrl,
      meeting_url,
    } = req.body;

    // Process schedule data (consider converting to individual time objects)
    const {
      monday_from,
      monday_to,
      tuesday_from,
      tuesday_to,
      wednesday_from,
      wednesday_to,
      thursday_from,
      thursday_to,
      friday_from,
      friday_to,
      saturday_from,
      saturday_to,
      sunday_from,
      sunday_to,
    } = schedule;

    const newDoctor = await Doctor.create({
      name,
      imageUrl,
      meeting_url,
      profession,
      category,
      address,
      about,
      monday_from,
      monday_to,
      tuesday_from,
      tuesday_to,
      wednesday_from,
      wednesday_to,
      thursday_from,
      thursday_to,
      friday_from,
      friday_to,
      saturday_from,
      saturday_to,
      sunday_from,
      sunday_to,
      total_patients: 0, // Initialize counters
      total_experience: 0,
      total_ratings: 0.0,
      total_reviews: 0,
    });

    res
      .status(201)
      .json({ message: "Doctor created successfully", doctor: newDoctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating doctor" });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    const {
      name,
      profession,
      category,
      address,
      about,
      schedule,
      imageUrl,
      meeting_url,
    } = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const updateObject = {};
    const updatableProperties = [
      "name",
      "imageUrl",
      "meeting_url",
      "profession",
      "category",
      "address",
      "about",
      "monday_from",
      "monday_to",
      "tuesday_from",
      "tuesday_to",
      "wednesday_from",
      "wednesday_to",
      "thursday_from",
      "thursday_to",
      "friday_from",
      "friday_to",
      "saturday_from",
      "saturday_to",
      "sunday_from",
      "sunday_to",
    ];

    for (const property of updatableProperties) {
      if (property in req.body) {
        updateObject[property] = req.body[property];
      }
    }

    if (Object.keys(updateObject).length === 0) {
      return res.status(400).json({ message: "No updateable fields provided" });
    }

    const [updatedCount] = await Doctor.update(updateObject, {
      where: { id },
    });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const updatedDoctor = await Doctor.findByPk(id);

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating doctor" });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();

    res.status(200).json({ doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving doctors" });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving doctor" });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Doctor.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting doctor" });
  }
};

exports.searchDoctor = async (req, res) => {
  try {
    const { searchTerm, category, ratings } = req.query;

    console.log("searchTerm", searchTerm);

    if (!searchTerm) {
      return res.status(400).json({ message: "Please provide a search term" });
    }

    let searchQuery = {};

    if (searchTerm) {
      // Search across category, name, and profession (optional)
      searchQuery = {
        [Op.or]: [
          { category: { [Op.like]: `%${searchTerm}%` } },
          { name: { [Op.like]: `%${searchTerm}%` } },
          { profession: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }

    // Category filter (handle array)
    if (category && category !== "ALL") {
      if (Array.isArray(category)) {
        // If category is an array, use [Op.in] to search for doctors in any of the provided categories
        searchQuery.category = { [Op.in]: category };
      } else {
        // If category is a single string, use the existing logic
        searchQuery.category = category;
      }
    }

    // Ratings filter
    if (ratings && ratings !== "ALL") {
      // Assuming total_ratings is a number, you can use comparison operators
      searchQuery.total_ratings = {
        [Op.gte]: parseFloat(ratings), // Greater than or equal to the provided rating
      };
    }

    const doctors = await Doctor.findAll({
      where: searchQuery,
    });

    res.status(200).json({ doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching doctors" });
  }
};
