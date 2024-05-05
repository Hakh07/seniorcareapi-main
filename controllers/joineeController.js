const db = require("../models");
const Joinee = db.joinees;
const Sequelize = require("sequelize");
const Event = db.events;

exports.createJoinee = async (req, res) => {
  try {
    const { user_id, event_id, email_address, name, extra_attendees } =
      req.body;

    const newJoinee = await Joinee.create({
      user_id,
      event_id,
      email_address,
      name,
      extra_attendees,
    });

    res
      .status(201)
      .json({ message: "Joinee created successfully", joinee: newJoinee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating joinee" });
  }
};

exports.getAllJoiners = async (req, res) => {
  try {
    const { event_id } = req.query; // Destructure event_id from query

    if (!event_id) {
      return res
        .status(400)
        .json({ message: "Please provide event_id in the query string" });
    }

    const joiners = await Joinee.findAll({
      where: {
        event_id,
      },
    });

    res.status(200).json({ joiners });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving joiners" });
  }
};

exports.getJoinerById = async (req, res) => {
  try {
    const { id } = req.params;

    const joiner = await Joinee.findByPk(id);

    if (!joiner) {
      return res.status(404).json({ message: "Joiner not found" });
    }

    res.status(200).json({ joiner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving joiner" });
  }
};

exports.getLatestThreeEventsByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    const joiners = await Joinee.findAll({
      where: {
        user_id: userId,
      },
    });

    if (joiners.length === 0) {
      // Handle no joiners found (optional)
      return res.status(404).json({ message: "User has no joined events" });
    }

    const eventIds = joiners.map((joiner) => joiner.event_id);
    const latestEvents = await Event.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: eventIds, // Use Sequelize.Op.in for multiple IDs
        },
      },
      order: [
        ["createdAt", "DESC"], // Order by creation date descending
      ],
      limit: 3, // Limit to 3 results
    });

    res.status(200).json({ latestEvents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving events" });
  }
};

exports.getEventsByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    const joiners = await Joinee.findAll({
      where: {
        user_id: userId,
      },
    });

    if (joiners.length === 0) {
      // Handle no joiners found (optional)
      return res.status(404).json({ message: "User has no joined events" });
    }

    const eventIds = joiners.map((joiner) => joiner.event_id);
    const latestEvents = await Event.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: eventIds, // Use Sequelize.Op.in for multiple IDs
        },
      },
      order: [
        ["createdAt", "DESC"], // Order by creation date descending
      ],
    });

    res.status(200).json({ latestEvents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving events" });
  }
};

exports.updateJoiner = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, event_id, email_address, name, extra_attendees } =
      req.body;

    const [updatedCount] = await Joinee.update(
      {
        user_id,
        event_id,
        email_address,
        name,
        extra_attendees,
      },
      {
        where: { id },
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Joiner not found" });
    }

    const updatedJoiner = await Joinee.findByPk(id, {
      include: [
        { model: "user", as: "user" }, // Include user data
        { model: "event", as: "event" }, // Include event data
      ],
    });

    res
      .status(200)
      .json({ message: "Joiner updated successfully", joiner: updatedJoiner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating joiner" });
  }
};

exports.deleteJoiner = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Joinee.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Joiner not found" });
    }

    res.status(200).json({ message: "Joiner deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting joiner" });
  }
};
