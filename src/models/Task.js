const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: String
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema)