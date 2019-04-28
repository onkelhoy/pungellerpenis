const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const filter = require('../../util/filter')

const UserSchema = new Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      validate: [filter.email, 'Provide a valid email']
    },
    upload: Date,
    password: { type: String, required: true },
    groups: [{type: Schema.Types.ObjectId, ref: 'Group'}]
  },
  { timestamps: true }
);

UserSchema.pre('save', function (next) {
  let user = this
  
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  user.upload = new Date()
  
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function (pass) {
  return bcrypt.compareSync(pass, this.password)
}

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("User", UserSchema);