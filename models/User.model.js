const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    username: { 
      type: String,
      required: [true, 'Name is required.'],
      unique: true
    },
    portfolio: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Portfolio', 
      },
    ],
    alerts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Alert', 
      },
    ],   
  },
  {   
    timestamps: true
  }
);

module.exports = model("User", userSchema);
