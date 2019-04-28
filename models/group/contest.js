const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ContestSchema = new Schema(
  {
    name: { type: String, required: true },
    scrorelist: [{ value: Number, user: { type: Schema.Types.ObjectId, ref: 'User' } }],
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    images: {type: Number, required: true} 
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Contest", ContestSchema);