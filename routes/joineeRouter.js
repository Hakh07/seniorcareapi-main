const express = require("express");
const router = express.Router();

const joineeController = require("../controllers/joineeController");
const authenticate = require("../middleware/authenticate");

// Create a Joinee
router.post("/", authenticate, joineeController.createJoinee);

// Get All Joiners
router.get("/", authenticate, joineeController.getAllJoiners);

router.get(
  "/get_events_by_user_id",
  authenticate,
  joineeController.getEventsByUserId
);

router.get(
  "/get_latest_three_events_by_user_id",
  authenticate,
  joineeController.getLatestThreeEventsByUserId
);

// Get Joiner by ID
router.get("/:id", authenticate, joineeController.getJoinerById);

// Update Joiner
router.put("/:id", authenticate, joineeController.updateJoiner);

// Delete Joiner
router.delete("/:id", authenticate, joineeController.deleteJoiner);

module.exports = router;
