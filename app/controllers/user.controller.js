const userRepo = require('../repositories/user.repository');
const _ = require('lodash');
const RequestHandler = require('../helper/RequestHandler');
const requestHandler = new RequestHandler();
const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const config = require('../../config/auth.config');
const mongoose = require('mongoose');

exports.signup = async (req, res) => {
      try {
          if (!_.has(req.body, 'email') || ((_.has(req.body, 'email') && (_.isUndefined(req.body.email)) || _.isNull(req.body.email) || _.isEmpty(req.body.email.trim())))) {
              requestHandler.throwError(400, 'Bad Request', 'Email is required!')();
          }
          if (!_.has(req.body, 'password') || ((_.has(req.body, 'password') && (_.isUndefined(req.body.password)) || _.isNull(req.body.password) || _.isEmpty(req.body.password.trim())))) {
              requestHandler.throwError(400, 'Bad Request', 'Password is required!')();
          }
          if (!_.has(req.body, 'first_name') || ((_.has(req.body, 'first_name') && (_.isUndefined(req.body.first_name)) || _.isNull(req.body.first_name) || _.isEmpty(req.body.first_name.trim())))) {
              requestHandler.throwError(400, 'Bad Request', 'First name is required!')();
          }

          if (!_.has(req.body, 'last_name') || ((_.has(req.body, 'last_name') && (_.isUndefined(req.body.last_name)) || _.isNull(req.body.last_name) || _.isEmpty(req.body.last_name.trim())))) {
              requestHandler.throwError(400, 'Bad Request', 'Last name is required!')();
          }
          if (!_.has(req.body, 'phone') || ((_.has(req.body, 'phone') && (_.isUndefined(req.body.last_name)) || _.isNull(req.body.last_name) || _.isEmpty(req.body.last_name.trim())))) {
            requestHandler.throwError(400, 'Bad Request', 'Phone is required!')();
        }
          req.body.email = req.body.email.trim().toLowerCase();
          req.body.first_name = req.body.first_name.trim();
          req.body.last_name = req.body.last_name.trim();
          req.body.phone = req.body.phone.trim();
          req.body.full_name = `${req.body.first_name} ${req.body.last_name}`;
          let userAvailable = await userRepo.getByField({ email: req.body.email, isDeleted: false });
          if (!_.isEmpty(userAvailable)) {
              requestHandler.throwError(403, 'Forbidden', 'Account already exist for this email!')();
          } else {
              req.body.password = new User().generateHash(req.body.password);
              let saveUser = await userRepo.save(req.body);
              if (!_.isEmpty(saveUser) && saveUser._id) {
                  const payload = {
                      id: saveUser._id
                  };
                  let token = jwt.sign(payload, config.jwtSecret, {
                      expiresIn: config.jwt_expires_in
                  });
                  let userData = await userRepo.getUserDetails({ _id: saveUser._id });
                  requestHandler.sendSuccess(res, 'Account has been created successfully')(userData[0], { token });
              } else {
                  requestHandler.throwError(400, 'Bad Request', 'Something went wrong!')();
              }
          }
  } catch (err) {
          return requestHandler.sendError(req, res, err);
      }
};
exports.signIn = async (req, res) => {
    try {
        if (!_.has(req.body, 'email') || ((_.has(req.body, 'email') && (_.isUndefined(req.body.email)) || _.isNull(req.body.email) || _.isEmpty(req.body.email.trim())))) {
            requestHandler.throwError(400, 'Bad Request', 'Email is required!')();
        } else if (!_.has(req.body, 'password') || ((_.has(req.body, 'password') && (_.isUndefined(req.body.password)) || _.isNull(req.body.password) || _.isEmpty(req.body.password.trim())))) {
            requestHandler.throwError(400, 'Bad Request', 'Password is required!')();
        } else {
            req.body.email = req.body.email.trim().toLowerCase();
            let userAvailable = await userRepo.getByField({ email: req.body.email, isDeleted: false });
            if (_.isEmpty(userAvailable)) {
                requestHandler.throwError(403, 'Forbidden', 'No account found! Please proceed to signup')();
            }else {
                let isPasswordMatched = new User().validPassword(req.body.password, userAvailable.password);
                if (!isPasswordMatched) {
                    requestHandler.throwError(400, 'Forbidden', 'Authentication failed!')();
                } else {
                    const payload = {
                        id: userAvailable._id
                    };

                    let token = jwt.sign(payload, config.jwtSecret, {
                        expiresIn: config.jwt_expires_in
                    });

                    let userData = await userRepo.getUserDetails({ _id: userAvailable._id });
                    requestHandler.sendSuccess(res, 'Logged in successfully!')(userData[0], { token });
                }
            }
        }
    } catch (error) {
        return requestHandler.sendError(req, res, error);
    }
};
exports.getDetails = async (req, res) => {
    try {
        let userData = await userRepo.getUserDetails({ _id: new mongoose.Types.ObjectId(req.userId) });
        if (!_.isEmpty(userData)) {
            return requestHandler.sendSuccess(res, 'Profile details fetched successfully.')(userData);
        } else {
            return requestHandler.throwError(400, 'Bad Request', 'User not found!')();
        }
    } catch (error) {
        return requestHandler.sendError(req, res, error);
    }
};
