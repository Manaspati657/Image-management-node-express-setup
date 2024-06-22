const mongoose = require('mongoose');
const User = require('../models/user.model');

const userRepository = {
    getByField: async (params) => {
        try {
            let user = await User.findOne(params).exec();
            if (!user) {
                return null;
            }
            return user;

        } catch (e) {
            throw e;
        }
    },
    save: async (data) => {
        try {
            let user = await User.create(data);

            if (!user) {
                return null;
            }
            return user;
        } catch (e) {
            throw e;
        }
    },
    getUserDetails: async (params) => {
        try {
            let aggregate = await User.aggregate([
                { $match: params },
                {
                    $project: {
                        password: 0,
                        isDeleted: 0,
                        updatedAt: 0,
                    }
                },
            ]);
            if (!aggregate) return null;
            return aggregate;
        } catch (e) {
            throw e;
        }
    },

};
module.exports = userRepository;