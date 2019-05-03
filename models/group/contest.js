const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ContestSchema = new Schema(
  {
    name: { type: String, required: true },
    scorelist: [{ value: Number, index: Number, user: { type: Schema.Types.ObjectId, ref: 'User' } }],
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    images: [{type: Schema.Types.ObjectId, ref: 'Image' }] 
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Contest", ContestSchema);