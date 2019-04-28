// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const types = Object.freeze({
  Pung: 'pung',
  Penis: 'penis'
})

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    type: { 
      type: String,
      required: true,
      enum: Object.values(types)
    }
  },
  { timestamps: true }
);

Object.assign(ImageSchema.statics, types)
// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Image", ImageSchema);