const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: String,
        username: String,
    },
    { versionKey: false }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
