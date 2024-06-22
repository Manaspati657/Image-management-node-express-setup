const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bools = [true, false];
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const ImageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'UserSchema' },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    tags: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false, enum: bools },
  },
  { timestamps: true, versionKey: false }
);

// For pagination
ImageSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Image", ImageSchema);
