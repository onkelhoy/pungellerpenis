const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    creator: {type: Schema.Types.ObjectId, ref: 'User'}
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Group", GroupSchema);