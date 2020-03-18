const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, unique: true },
    password: String
});

mongoose.model("Users", userSchema);
