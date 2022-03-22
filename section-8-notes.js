// 1
// Connecting our data base with the Express App

// DATABASE => added to "config.env"
// => Changed <password> to UPPERCASE
// => Changed /natours? => our project database "name"

// ---------------------------------------------- npm i mongoose
// mongoose@5 => version 5 installed
// require('mongoose')

// ---------------------------------------------- mongoose.connect()
// First argument => (Connection String)
// Second Argument => (Object with some options) "not important just copy the same for future projects"
// Returns a PROMISE => .then(connection => {})

//////////////////////////////////////////////////////////////////////////////

// #2
// Creating a simple Tour model

// "mongoose" => work similar to a class
// => We create a model using mongoose => create object from it, To Query/Update/Delete doccuments "CRUD"
// => To creade a model, we need a Schema

// "Schema" => use to describe out data, set defaul value, validate data .etc
// => Basically giving rules to the data

// --------------------------------------------- new mongoose.Schema({})
// To create schema
// This is were we put the rules, what content is needed for the created objects

// --------------------------------------------- new mongoose.model('Name', Schema)
// To create model
// This is basically our class
// Ex => new 'Name' ({Data: value})

// Example on => 'server.js'

//////////////////////////////////////////////////////////////////////////////

// #3
// Creating Documents and Testing the Model

// ---------------------------------------------- new "Model"({Data})
// To create a document
// It works similar to classes
// const whatever = new "Model"({Data})

// ---------------------------------------------- .save()
// Method to save created model
// Returns a promise => .then().catch()

// Example => "server.js"

//////////////////////////////////////////////////////////////////////////////

// #4
// MVC, Model, View, Controller

// Application logic => "Controller"
// => Code about the application
// Ex. managing request and responses

// Business Logic => "Model"
// => Code that solves business problems
// Ex. Creating new tours in database, Check users password, Validating users input data

// FAT MODELS/THIN CONTROLLES:
// => Offload ad much logic as possible into the model
// => Keep the controllers as simple/little logic as possible

//////////////////////////////////////////////////////////////////////////////

// #5
// Refactoring for MVC (Model, View, Controller)

// "./models/tourModel.js" => created
// => for Schema & Model