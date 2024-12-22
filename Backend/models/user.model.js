import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "First name must be at least 3 characters long"]
        },
        lastname: {
            type: String,
            minlength: [1, "Last name must be at least 1 characters long"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email must be at least 5 characters long"],
    },
    password: {
        type: String,
        required: true,
        select: false
    }
})

userSchema.methods.genrateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" })
    return token
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}

const UserModel = mongoose.model("User", userSchema)
export default UserModel
