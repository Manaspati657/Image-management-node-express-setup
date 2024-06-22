const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bools = [true, false];
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    first_name: { type: String, default: '' },
    last_name: { type: String, default: '' },
    full_name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false, enum: bools },
  
  }, { timestamps: true, versionKey: false });

  // generating a hash
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  
  
  // checking if password is valid
  UserSchema.methods.validPassword = function (password, checkPassword) {
    return bcrypt.compareSync(password, checkPassword);
  };

  module.exports = mongoose.model('User', UserSchema);