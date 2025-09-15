import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default:'' },
    isAdmin: { type: Boolean, default: false },
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

export default User;