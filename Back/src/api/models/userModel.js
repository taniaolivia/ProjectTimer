const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    connected: {
        type: Boolean,
        required: true,
        default: 0
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: "Group",
        default: []
    }],
    projects: [{
        type: Schema.Types.ObjectId,
        ref: "Project",
        default: []
    }]
});

module.exports = mongoose.model("User", userSchema);