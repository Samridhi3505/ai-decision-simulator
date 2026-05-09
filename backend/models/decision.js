// models/Decision.js
import mongoose from "mongoose";

const decisionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: String,
  result: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Decision", decisionSchema);