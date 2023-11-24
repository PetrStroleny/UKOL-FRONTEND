import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const userSchema = new Schema({
    name: {type: String, required: true},
    token: {type: String, required: true},
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

export default User;