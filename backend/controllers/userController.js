import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ✅ GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { currentPassword, password, hobbies, favourites, ...rest } = req.body;

    let updateData = { ...rest };

    // ✅ force array updates
    if (hobbies) {
      updateData.hobbies = hobbies;
    }

    if (favourites) {
      updateData.favourites = favourites;
    }

    // ✅ Handle password securely
    if (password) {
      const user = await User.findById(req.user.id);

      // 🔐 check current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          msg: "Current password is incorrect"
        });
      }

      // 🔒 hash new password
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

       res.json({
      msg: "✅ Profile updated successfully",
      user: updated
    });

  } catch (err) {
    res.status(500).json({
      msg: "⚠️ Something went wrong. Try again."
    });
  }
};