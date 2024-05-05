const multer = require("multer");
const { Op } = require("sequelize");
const db = require("../models");
const Event = db.events;
const Joinee = db.joinees;
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/events");
    },
    filename: (req, file, cb) => {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      console.log("extension", extension);
      cb(null, "event-" + file.fieldname + "-" + Date.now() + "." + extension);
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

exports.createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      start_date,
      start_time,
      end_date,
      end_time,
      address,
      hosted_by,
      hide_guest_list,
      imageUrl,
      user_id,
    } = req.body;

    const newEvent = await Event.create({
      name,
      description,
      type,
      start_date,
      start_time,
      end_date,
      end_time,
      address,
      hosted_by,
      hide_guest_list,
      imageUrl,
      user_id,
    });

    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating event" });
  }
};

exports.uploadEventImage = async (req, res) => {
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

        //   const imageUrl = path.join(
        //     baseUrl,
        //     "uploads",
        //     "events",
        //     image.filename
        //   );

        const url = new URL(
          path.join("/", "uploads", "events", image.filename),
          baseUrl
        );

        res.status(200).json({
          message: "Image uploaded successfully",
          imageUrl: url.href,
          filePath: "/uploads/events/" + image.filename,
        });
      });
    }
  } catch (error) {
    console.error("Error upload image : ", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      // Include related models (optional)
      order: [
        ["start_date", "ASC"], // Sort by start date (ascending)
      ],
    });

    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving events" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    const joineesOfEvent = await Joinee.findAll({
      where: {
        event_id: id,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      event: {
        ...event?.dataValues,
        joinees: joineesOfEvent,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving event" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      type,
      start_date,
      start_time,
      end_date,
      end_time,
      address,
      hosted_by,
      hide_guest_list,
    } = req.body;

    upload.single("image")(req, res, async (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error uploading event image" });
      }

      let updateData = {
        // Initialize update data object
        name,
        description,
        type,
        start_date,
        start_time,
        end_date,
        end_time,
        address,
        hosted_by,
        hide_guest_list,
      };

      const image = req.file; // Access uploaded image data (if uploaded)
      if (image) {
        updateData.imageUrl = image.path; // Update imageUrl if uploaded
      }

      // Update the event
      const [updatedCount] = await Event.update(updateData, {
        where: { id },
      });

      if (updatedCount === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Fetch the updated event (including any updated imageUrl)
      const updatedEvent = await Event.findByPk(id);

      res
        .status(200)
        .json({ message: "Event updated successfully", event: updatedEvent });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Event.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting event" });
  }
};
