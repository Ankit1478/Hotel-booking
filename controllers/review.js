const listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.reviews = async (req, res) => {
  let Listing = await listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  Listing.reviews.push(newReview);

  await newReview.save();
  await Listing.save();
  req.flash("success", " Your review has been Added");
  res.redirect(`/listings/${Listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Review.findByIdAndDelete(reviewId);
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  req.flash("success", " Review Deleted");
  res.redirect(`/listings/${id}`);
};
