import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  mood: {
    type: String,
    default: "🌿 Calm"
  },

  about: {
    type: String,
    default: ""
  },

  hobbies: {
    type: [String],
    default: []
  },

  favorites: {
    type: [String],
    default: []
  }
});

export default mongoose.model("User", userSchema);