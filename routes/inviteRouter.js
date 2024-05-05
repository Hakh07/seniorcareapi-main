const express = require("express");
const router = express.Router();
const inviteController = require("../controllers/inviteController");
const authenticate = require("../middleware/authenticate");

// Create an Invite
router.post("/", authenticate, inviteController.createInvite);

// Get All Invites
router.get("/", authenticate, inviteController.getAllInvites);

// Get Invites by user email
router.post(
  "/get_invites_by_email",
  authenticate,
  inviteController.getInvitesByEmail
);

// Accept Invite
router.post("/accept_invite", authenticate, inviteController.acceptInvite);

// Get Invite by ID
router.get("/:id", authenticate, inviteController.getInviteById);

// Update Invite
router.put("/:id", authenticate, inviteController.updateInvite);

// Delete Invite
router.delete("/:id", authenticate, inviteController.deleteInvite);

module.exports = router;
