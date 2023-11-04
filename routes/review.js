const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn } = require("../middleware.js");
const { isReviweAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// reviews
router.post("/", isLoggedIn, wrapAsync(reviewController.reviews));

//delete Review  route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviweAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
