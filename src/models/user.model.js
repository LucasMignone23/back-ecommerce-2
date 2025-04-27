import mongoose from "mongoose";
import { generateHash } from "../utils.js";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  role: { type: String, default: "user" },
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = generateHash(this.password);
  next();
});

const User = mongoose.model(userCollection, userSchema);

export default User;