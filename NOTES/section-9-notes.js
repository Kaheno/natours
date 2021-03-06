// #1
// Debugging Node.js with ndb

// ----------------------------------------------- sudo npm i ndb --global
// To install globally => didn't work

// ----------------------------------------------- npm i ndb --save-dev
// To install as a dev dependancy

// "debug": "ndb server.js"
// => added to "package.json"
// npm run debug => to run this tool

// Better way of debugging instead of using console.log

//////////////////////////////////////////////////////////////////////////

// #2
// Handling Unhandled Routes

// => Handling wrong URL

// ---------------------------------------------- app.all('*', (req, res, next) => {})
// .all() => .get, post, delete, find, update
// '*' => Everything => all URLs

// ----------------------- req.originalUrl
// => input URL

// ************************ Important ************************
// handling with ".all()" => has to be after the ROUTER MOUNTING
// Or else any URL will be (404)

//////////////////////////////////////////////////////////////////////////

// #3
// Implementing Global Error Handling Middleware

// ---------------------------------------------- app.use((err, req, res , next) => {})
// When 4 arguments are given is automatically recognized as a Error Handling Middleware
//

// ------------------------ err.statusCode
// => res.status(Code)

// ------------------------ err.status
// => .json({ status: })

// ************************ IMPORTANT **************************
// next() => anything passed inside the "next()" function, Express will take it as a ERROR
// Will skip all the other middlewares into the global err handling

//////////////////////////////////////////////////////////////////////////

// #4
// Better Errors and Refactoring

// "appError.js", "errorController.js" created

// ----------------------------------------------- .startWith('')
// To check if a String start with ''

// ----------------------------------------------- err.stack
// .log(err.stack) => will log where is the Error

// ----------------------------------------------- isOperational = Boolean
// => manually setting a boolean to a object
// => so we can manipulate based on this boolean in the future

// "appError.js"
// ----------------------------------------------- Error.captureStackTrace(curObj, toDoWithObj)
// this => current object
// this.constructor => what to do with the object

//////////////////////////////////////////////////////////////////////////

// #5
// Catching Errors in Async Functions

// In "tourController.js" => All async functions were change
// => Function created to handle ".catch()"
// => try{} catch{} => deleted on all of them

// "catchAsync.js" created for "catchAsync"

// ************************* Important ***************************
// "catchAsync" => returns a new anonymous function
// "tourController.js" functions cannot call a function that calls another function
// Fix => Make "tourConstroller.js" to only call "catchAsync" which returns its own function, instead of chaning to another one

//////////////////////////////////////////////////////////////////////////

// #6
// Adding 404 Not Found Errors

// Implemented in => "getTour"
// => Simply implemented an "if" => return next(new AppError('Message', statusCode))

//////////////////////////////////////////////////////////////////////////

// #7
// Errors During Development vs Production

// Changes on "errorController.js"

//////////////////////////////////////////////////////////////////////////

// #8
// Handling Invalid Database Ids

// "handleCastErrorDB()" created in "errorController.js"
// => to handle errors for Production => client
// => To show understandable errors

// --------------------------- if (err.name === 'CastError')
// => was use to identify the type of error to handle

//////////////////////////////////////////////////////////////////////////

// #9
// Handling Duplicate Database Fields

// => handling error by code
// -------------------------- if (err.code === 11000)
// Found when trying to create a tour with existing name

// "handleDuplicateFieldsDB()" created in "errorController.js"

// **************** IMPORTANT *****************
// => using error.data to locate and handle the error message
// => By logging the "error" we can find the "error.code" to manipulate specific errors
// and keyValues => keyValue cause of the error

//////////////////////////////////////////////////////////////////////////

// #10
// Handling Mongoose Validation Errors

// -------------------------------- Object.values()
// => to get values from the object

// "handleValidationErrorDB()" created in "errorController.js"
// Object.values().map() => was used to get err.message from all the different Validation errors

//////////////////////////////////////////////////////////////////////////

// #11
// Errors Outside Express: Unhandled Rejections

// => handling authentication globally

// changes on "server.js"
// -------------------------------- process.on('unhandledRejection', err => {})
// process.on => to subscribe to a event
// 'unhandledRejection' => event to handle rejection
// receives an "err" => {}

// -------------------------------- process.exit()
// 0 => success
// 1 => uncaught exception
// NOT RECOMMENDED => to end programm, imediatelly abort all the request that are currently still running or pending

// ********** IMPORTANT ************
// Before exiting our application we need to close the server first
// => So all the code can finish before closing
// => Implemented in => "server.js"

// Exmaple:
//   const server = app.listen(port, () => {
//     console.log(`App running on port ${port}...`);

//   server.close(() => {
//     process.exit(1);
//    });

//////////////////////////////////////////////////////////////////////////

// #12
// Catching Uncaught Exceptions

// All error/bugs that occour in the async code but are not handled anywhere
// Ex => console.log something that does't exist

// -------------------------------- process.on('uncaughtException', err => {})
// to subscribe to all "uncaughtException"

// ****************** IMPROTANT ********************
// If this error is inside a Express Middleware, the error will be handled by "global middleware handling"
