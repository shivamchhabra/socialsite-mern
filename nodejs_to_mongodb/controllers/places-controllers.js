const mongoose = require("mongoose");
const fs = require("fs");
const httperror = require("../models/httperror");

const Place = require("../models/placeSchema");

const User = require("../models/userSchema");
//
//
//
////////////////////get place by place id
const getplacebyid = async (req, res, next) => {
  const placeId = req.params.pid;
  console.log(placeId);

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    next(new httperror("coulnot find placebyId", 500));
  }
  console.log(place);

  if (!place) {
    /*return res
        .status(404)
        .json({ message: "donot have result with this id pid" });*/

    return next(new httperror("donot have result with this id pid", 404));
  }

  res.status(200).json({ place: (await place).toObject({ getters: true }) });
};
//
//
//
// get place by User Id
const getplacebyUserId = async (req, res, next) => {
  console.log("getrequest");
  const userId = req.params.userid;
  let places;

  // find() takes object {creator:userId}  =>returns full array
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    next(new httperror("sorry something went wrong", 500));
  }

  if (!places) {
    next(new httperror("cannot find place with this id", 404));
  }
  console.log(places.map((p) => p.toObject({ getters: true })));
  res
    .status(200)
    .json({ places: places.map((p) => p.toObject({ getters: true })) });
};
//
//
//
//
///////////////////createplace
const createplace = async (req, res, next) => {
  const { title, description, address } = req.body;

  const newplace = new Place({
    title,
    description,
    creator: req.userData.userId,
    address,
    image: req.file.path,
  });
  console.log("place ka creator" + req.userData.userId);

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    next(new httperror("something went wrong", 500));
  }

  if (!user) {
    throw new httperror("User couldnt found", 404);
  }
  console.log(newplace);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newplace.save({ session: sess });

    user.places.push(newplace);

    await user.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    throw new httperror("cannot save new place", 404);
  }

  res.status(201).json({ place: newplace });
};
//
//
//
////////////////update place
const updateplaces = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    next(new httperror("something went wrong, couldnt update place", 500));
  }
  const { title, description } = req.body;
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    next(new httperror("something went wrong , couldnt update place", 500));
  }
  res.status(200).json({ place: place.toObject() });
};
//
//
//
////////////////delete place
const deleteplace = async (req, res, next) => {
  const placeId = req.params.pid;
  console.log("placeId" + placeId);

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    next(
      new httperror(
        "something went wrong part1, place couldnot be deleted",
        500
      )
    );
  }
  console.log("place to be deleted" + place);

  if (!place) {
    next(new httperror("Place not found", 500));
  }

  if (place.creator.id.toString() !== req.userData.userId) {
    return next(
      new httperror(
        "you cannot delete this place...as it is not created by uh",
        401
      )
    );
  }
  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    try {
      await place.remove({ session: sess });
    } catch (error) {
      console.log("error 1");
    }
    place.creator.places.pull(place);
    try {
      await place.creator.save({ session: sess });
    } catch (error) {
      console.log("error 2");
    }

    await sess.commitTransaction();
  } catch (error) {
    next(new httperror("something went wrong, place couldnot be deleted", 500));
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: `DELETED PLACE` });
};

exports.getplacebyid = getplacebyid;
exports.createplace = createplace;
exports.updateplaces = updateplaces;
exports.deleteplace = deleteplace;
exports.getplacebyUserId = getplacebyUserId;

//.exec() returns the promises
//{"_id":{"$oid":"5e838365e1337d06b06afd9a"},"title":"India","description":"Most beautifull country","location":{"lat":{"$numberInt":"123"},"lng":{"$numberInt":"456"}},"creator":{"$oid":"5e83401e5c7a4020303f8945"},"address":"world","image":"sare jahan se achha hindustan hmara","__v":{"$numberInt":"0"}}
//{"_id":{"$oid":"5e838365e1337d06b06afd9a"},"title":"India","description":"Most beautifull country","location":{"lat":{"$numberInt":"123"},"lng":{"$numberInt":"456"}},"creator":{"$oid":"5e83401e5c7a4020303f8945"},"address":"world","image":"sare jahan se achha hindustan hmara","__v":{"$numberInt":"0"}}
