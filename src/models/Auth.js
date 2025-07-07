const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:true
    },
    name: {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        }
    },
    mobile:{
        type:Number,
        required:true,
    },
    email: {
        type: String,
        required: true,
    },
    role: {
    type: String,
    enum: ["Admin", "User"],
    required: true,
    default: "User"
},
    password: {
        type: String,
        required: true,
    },
    profileImage: String
}, { timestamps: true });

module.exports = mongoose.model("Author", AuthorSchema)