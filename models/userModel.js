const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    // validator => imported module
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8,
    select: false,
    // hide
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      // This only works on SAVE()/CREATE()
      validator: function (el) {
        // returns => true/false => if false => error
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// _________________________________________________________________________
// #3
// Managing Passwords

// Middleware that Runs before ".save()"
// async/await => because ".hash" => returns a promise
userSchema.pre('save', async function (next) {
  // Run if password is modified
  if (!this.isModified('password')) return next();

  // Hash password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  // Clear passwordConfirm field => No need to be saved
  // => we already validate passwordConfirm using "validator: function()"
  this.passwordConfirm = undefined;

  next();
});
// _________________________________________________________________________
// #13 - s10
// Password Reset Functionality: Setting new Password

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // Optional If PC is Slow
  // -1 seconds => To ensure the token is always created after the password has been changed
  // .protect() => Check if user changed password after the token was issued
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
// _________________________________________________________________________
// #16 - s10
// Deleting the Current User

// Middleware that runs before ".find()"

// /^find/ => look string/words that starts with "find"
userSchema.pre(/^find/, function (next) {
  // .find() => returns all the objects that has {active: {$notEqual to false}}
  // $ne => not equal to:
  this.find({ active: { $ne: false } });
  next();
});

// _________________________________________________________________________
// #6
// Logging in Users
// Instance method

// .methods => to create a method for all the instances of "userChema"
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // this.password => is not possible because, "select: false" in the schema
  return await bcrypt.compare(candidatePassword, userPassword);
};
// _________________________________________________________________________
// #8
// Protecting Tour Routes - p2

// Check if password has changed in our log in session before (req, res) anything
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // Convert date into miliseconds
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // true if => token creation date (is before "<") passwordchange date
    // true => if passwordchanged after creation of token
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// _________________________________________________________________________
// #11 - s10
// Password Reset Functionality: Reset Token

userSchema.methods.createPasswordResetToken = function () {
  // create random 32 long data => convert into string in hex format
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Encrypting the random data & save to Schema
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //console.log({ resetToken }, this.passwordResetToken);

  // Token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
// _________________________________________________________________________

const User = mongoose.model('User', userSchema);

module.exports = User;
