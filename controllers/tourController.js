const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

// #3 ______________________________________________________________
/*
// File was a json file
// JSON.parse => to convert into JS
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
// __dirname => this file location
// .. => go back once
// then => dev-data/data/tours-simple.json
*/
// #15 _______________________________________________________________
// Param Middleware
/*
exports.checkID = (req, res, next, val) => {
  // "val" => value of parameter of URL entered
  console.log(`Tour id is: ${val}`);

  // if wrong value => return
  // else => next()
  if (+req.params.id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  next();
};
*/
// #16 _______________________________________________________________
// Chaining multiple Middleware Functions
/*
exports.checkBody = (req, res, next) => {
  // req => is what the web-site send to us
  if (!req.body.name || !req.body.price) {
    // res => what we sent to the web-site
    return res.status(400).json({
      status: 'fail',
      message: 'Missing price or name',
    });
  }
  next();
};
*/
// _____________________________________________________________________

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// req.requestTime => middleware from 'app'
exports.getAllTours = async (req, res) => {
  try {
    // localhost:3000/api/v1/tours?duration=5&difficulty=easy

    console.log(req.query);

    // Refactored to "APIFeatures"
    // ______________________________________________________________
    // BUILD QUERY
    // 1A) Filtering

    // // Creating a hard copy => destructuring
    // // => Deleting excluded fields
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // // req.query => query string => ?duration=5&difficulty=easy

    // // 1B) Advanced Filtering

    // // Convert into string => to use ".replace" method
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // // \b => Exactly the same, words that include them won't count
    // // g => Global, to make changes on all, if not added will just change the first one

    // // Filtering Method 1
    // let query = Tour.find(JSON.parse(queryStr));
    // // .find() => if no argument = all Tour data will be returned
    // // We do not "await" query so we can still chain methods

    // // // Filtering Method 2
    // // const query = await Tour.find()
    // //   .where('duration')
    // //   .equals(5)
    // //   .where('difficulty')
    // //   .equals('easy');
    // ______________________________________________________________

    // // 2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   // sort = price,ratingsAverage
    //   // We need => sort = price ratingsAverage => for .sort() to work
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    //   // Sort by creation time "new~old"
    // }
    // ______________________________________________________________

    // // 3) Field Limiting

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    //   // "-" => Exclusion for .select()
    // }
    // ______________________________________________________________

    // // 4) Pagination

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // // page=2&limit=10 => p1 1-10 => p2 11-20 => p3 21-30
    // // .skip() => how many opject to skip
    // // .limit() => how many to show per page
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   // Total of tours
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }
    // ______________________________________________________________

    // EXECUTE QUERY
    // Tour.find() => returns all the data from Tour
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// #5 ________________________________________________________________

exports.getTour = async (req, res) => {
  try {
    // req.params => all parameters enter/use on the URL
    const tour = await Tour.findById(req.params.id);
    // id => route('/:id') we specified in "tourRoutes.js"

    // Display tour from ID
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// #4 ________________________________________________________________

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour()
    // newTour.save().then()
    const newTour = await Tour.create(req.body);
    // req.body => data from request

    res.status(201).json({
      // 201 => created
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      // 400 => bad request
      status: 'fail',
      message: err,
    });
  }
};

// #6 ________________________________________________________________
// Updating existing tours

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // to return new changes
      new: true,
      // to validate the schema rules
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// #7 ________________________________________________________________
// Deleting Tours

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        // get => all reatingAverage >= [gte] 4.5
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // Define stats for Each "Difficulty"
          // _id: null; => To get all in 1
          // $toUpper => optional to add, to Upercase
          _id: { $toUpper: '$difficulty' },
          // +1 for each tour
          numTours: { $sum: 1 },
          // sum all ratingsQuantity
          numRatings: { $sum: '$ratingsQuantity' },
          avgRatings: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        // sort avgPrice by low to high
        $sort: { avgPrice: 1 },
        // NOTE name changes after we specify the values on top
        // was => "averagePrice"
        // now is =>"avgPrice"
      },
      // {
      //   // Can use "$match" again
      //   // Excluding all => _id: 'EASY'
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
