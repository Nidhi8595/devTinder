const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 60
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        lowercase: true,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Invalid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://imgs.search.brave.com/zpr2R5bXaV-zRljd0C4Xsrc0AeM_mhrzMSb1AXnmPPk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9i/L2JiL0Nvd29rLnBu/Zw",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL");
            }
        }
    },
    about: {
        type: String
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);



