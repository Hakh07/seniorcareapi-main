const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController'); 
const authenticate = require('../middleware/authenticate')

// Create a Rating
router.post('/',authenticate, ratingController.createRating);

// Get All Ratings
router.get('/',authenticate, ratingController.getAllRatings);

// Get All Ratings
router.get('/get-all-ratings-by-doctor-id',authenticate, ratingController.getAllRatingsByDoctorID);

// Get Rating by ID
router.get('/:id',authenticate, ratingController.getRatingById);

// Update Rating
router.put('/:id',authenticate, ratingController.updateRating);

// Delete Rating
router.delete('/:id',authenticate, ratingController.deleteRating);

module.exports = router;
