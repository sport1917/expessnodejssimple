const mongoose = require("mongoose");
const users = new mongoose.Schema({
    user_id: {type: Number, unique:true},
    username: {type: String, unique:true},
    password: {type: String},
    firstname: {type: String},
    lastname: {type: String},
    old: {type: Number},
    sex: {type: String}
});
module.exports = mongoose.model("users", users);