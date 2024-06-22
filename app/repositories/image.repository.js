
const ImageSchema = require('../models/image.model');
const _ = require('lodash');
const userRepository = {
    getByField: async (params) => {
        try {
            let image = await ImageSchema.findOne(params).exec();
            if (!image) {
                return null;
            }
            return image;

        } catch (e) {
            throw e;
        }
    },
    save: async (data) => {
        try {
            let image = await ImageSchema.create(data);

            if (!image) {
                return null;
            }
            return image;
        } catch (e) {
            throw e;
        }
    },
    updateById: async (data, id) => {
        try {
            let record = await ImageSchema.findByIdAndUpdate(id, data, {
                new: true
            });
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            return e;
        }
    },
    getImageDetails: async (params) => {
        try {
            let aggregate = await ImageSchema.aggregate([
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
    getAllImages: async (params, pagination, search) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push(
                params
            );
            if (!_.isEmpty(search)) {
                and_clauses.push({
                    $or: [
                        { 'title': { $regex: "^"+search.trim(), $options: 'i' } },
                        { 'tags': { $regex: "^"+search.trim(), $options: 'i' } }
                    ]
                });
            }
            conditions['$and'] = and_clauses;

            let aggregate = ImageSchema.aggregate([
                {
                    $match: conditions
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$userId']
                                            },
                                            {
                                                $eq: ['$isDeleted', false]
                                            },
                                        ]
                                    }
                                }
                            },
                            // {
                            //     $addFields: {
                            //       photographer_name: '$full_name'
                            //     }
                            // },
                            {
                                $project: {
                                    'photographer_name': "$full_name",
                                }
                            },
                        ],
                        as: 'user_details'
                    }
                },
                {
                    $unwind: {
                        path: '$user_details'
                    }
                },
                {
                    $project: {
                        updatedAt: 0,
                        isDeleted: 0,
                    }
                },
                {
                    $sort: { createdAt: -1 }
                }
            ])

            let allRecord = await ImageSchema.aggregatePaginate(aggregate, pagination);

            if (!allRecord) {
                return null;
            }
            return allRecord;
        } catch (e) {
            throw e
        }
    },
    getUserImages: async (params, pagination) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push(
                params
            );
            conditions['$and'] = and_clauses;
            console.log(params);
            let aggregate = ImageSchema.aggregate([
                {
                    $match: conditions
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$_id', '$$userId']
                                            },
                                            {
                                                $eq: ['$isDeleted', false]
                                            },
                                        ]
                                    }
                                }
                            },
                            // {
                            //     $addFields: {
                            //       photographer_name: '$full_name'
                            //     }
                            // },
                            {
                                $project: {
                                    'photographer_name': "$full_name",
                                }
                            },
                        ],
                        as: 'user_details'
                    }
                },
                {
                    $unwind: {
                        path: '$user_details'
                    }
                },
                {
                    $project: {
                        updatedAt: 0,
                        isDeleted: 0,
                    }
                },
                {
                    $sort: { createdAt: -1 }
                }
            ])

            let allRecord = await ImageSchema.aggregatePaginate(aggregate, pagination);

            if (!allRecord) {
                return null;
            }
            return allRecord;
        } catch (e) {
            throw e
        }
    }


};
module.exports = userRepository;