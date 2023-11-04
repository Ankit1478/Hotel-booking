const listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken =
  "pk.eyJ1IjoiYW5raXQxNDc4IiwiYSI6ImNsb2Z5MTBpdzBxbzgydnQ4a250aHN2Z2gifQ.i5MRa0JCefDtoq_D0kUZKA";
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const alllistings = await listing.find({});
  res.render("listings/index.ejs", { alllistings });
};

module.exports.newRoute = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showRoute = async (req, res) => {
  let { id } = req.params;
  const lsiting = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!lsiting) {
    req.flash("error", " Listing Doesn,t exists");
    res.redirect("/listings");
  }
  console.log(lsiting);
  res.render("listings/show.ejs", { lsiting });
};

module.exports.createRoute = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
    
  if (!req.body.listing) {
    throw new ExpressErrors(400, "send valid data for listing");
  }

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let saveListing = await newListing.save();
  console.log(saveListing);
  req.flash("success", "new Listing Created");
  res.redirect("/listings");
};

module.exports.editRoute = async (req, res) => {
  let { id } = req.params;
  const lsiting = await listing.findById(id);
  let originalImageUrl = lsiting.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  req.flash("success", " Successfully edit");
  res.render("listings/edit.ejs", { lsiting, originalImageUrl });
};

module.exports.updateRoute = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressErrors(400, "send valid data for listing");
  }
  let { id } = req.params;
  let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url, filename };
    await Listing.save();
  }
  req.flash("success", "Successfully Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteRoute = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", " Succesfully Deleted");
  res.redirect("/listings");
};
