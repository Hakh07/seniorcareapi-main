const db = require("../models");
const Invite = db.invites;
const sequelize = require("sequelize");

exports.createInvite = async (req, res) => {
  try {
    const { user_id, event_id, email_addresses, names } = req.body;

    // Input validation (optional)
    if (
      !Array.isArray(email_addresses) ||
      !Array.isArray(names) ||
      email_addresses.length !== names.length
    ) {
      return res.status(400).json({
        message:
          "Invalid request body: email_addresses and names must be arrays with the same length",
      });
    }

    // Create invites for each email address and name
    const invites = [];
    for (let i = 0; i < email_addresses.length; i++) {
      const newInvite = await Invite.create({
        user_id,
        event_id,
        email_address: email_addresses[i],
        name: names[i],
        accepted: false,
      });
      invites.push(newInvite);
    }

    res.status(201).json({ message: "Invites created successfully", invites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating invites" });
  }
};

exports.getAllInvites = async (req, res) => {
  try {
    const invites = await Invite.findAll();

    res.status(200).json({ invites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving invites" });
  }
};

exports.getInvitesByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const invites = await Invite.findAll({
      where: {
        [sequelize.Op.and]: [
          {
            accepted: false,
          },
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col("email_address")),
            email.toLowerCase()
          ),
        ],
      },
    });

    res.status(200).json({ invites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving invites" });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving invites" });
  }
};

exports.getInviteById = async (req, res) => {
  try {
    const { id } = req.params;

    const invite = await Invite.findByPk(id, {
      include: [
        { model: "user", as: "user" }, // Include user data
        { model: "event", as: "event" }, // Include event data
      ],
    });

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    res.status(200).json({ invite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving invite" });
  }
};

exports.updateInvite = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, event_id, email_address, name } = req.body;

    const [updatedCount] = await Invite.update(
      {
        user_id,
        event_id,
        email_address,
        name,
      },
      {
        where: { id },
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Invite not found" });
    }

    const updatedInvite = await Invite.findByPk(id);

    res
      .status(200)
      .json({ message: "Invite updated successfully", invite: updatedInvite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating invite" });
  }
};

exports.deleteInvite = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Invite.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Invite not found" });
    }

    res.status(200).json({ message: "Invite deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting invite" });
  }
};
