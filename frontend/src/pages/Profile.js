import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/profile.css";

const getInitials = (name) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (
    words[0][0].toUpperCase() +
    words[words.length - 1][0].toUpperCase()
  );
};

export default function Profile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMoodOptions, setShowMoodOptions] = useState(false);

  const [profile, setProfile] = useState({ hobbies: [] });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // ✅ NEW: message state (replaces alert)
  const [message, setMessage] = useState("");

  const moods = [
    "🌿 Calm",
    "😊 Happy",
    "🔥 Motivated",
    "😴 Sleepy",
    "🌸 Peaceful"
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/user/profile");

        setProfile({
          ...res.data,
          hobbies: res.data.hobbies || []
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  /* ===== PASSWORD CHANGE ===== */
  const handlePasswordChange = async () => {
    if (!passwords.current) {
      setMessage("⚠️ Enter current password");
      return;
    }

    if (!passwords.new) {
      setMessage("⚠️ Enter new password");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const res = await API.put("/user/profile", {
        currentPassword: passwords.current,
        password: passwords.new
      });

      setMessage("✅ Password updated successfully!");
      setProfile(res.data);

      setPasswords({ current: "", new: "", confirm: "" });
      setShowPassword(false);

    } catch (err) {
      setMessage(err.response?.data?.msg || "❌ Error updating password");
    }
  };

  const updateList = (field, index, value) => {
    const updated = [...(profile[field] || [])];
    updated[index] = value;
    setProfile({ ...profile, [field]: updated });
  };

  return (
    <div className={darkMode ? "profile-page dark" : "profile-page"}>

      {/* ✅ MESSAGE BOX */}
      {message && <div className="msg-box">{message}</div>}

      <div className="action-section">
        <div className="top-actions">
          <button
            onClick={async () => {
              if (isEditing) {
                try {
                  const res = await API.put("/user/profile", {
                    name: profile.name,
                    email: profile.email,
                    mood: profile.mood,
                    about: profile.about,
                    hobbies: profile.hobbies.map(h => h || "")
                  });

                  setProfile(res.data);
                  setMessage("✅ Profile updated!");
                } catch (err) {
                  setMessage("❌ Failed to update profile");
                }
              }
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </button>

          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/decision")}
        >
          ← Back to Decision Page
        </button>
      </div>

      <div className="cover-container">
        <div className="cover-photo">
          <div className="cover-overlay">
            <h1>My Profile ✨</h1>
          </div>
        </div>

        <div className="profile-info">
          <div className="avatar-initials">
            {getInitials(profile.name)}
          </div>

          {isEditing ? (
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
          ) : (
            <h2>{profile.name}</h2>
          )}
        </div>
      </div>

      <div className="grid">

        <div className="card">
          <h3>Email</h3>
          {isEditing ? (
            <input
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          ) : (
            <p>{profile.email}</p>
          )}
        </div>

        <div className="card">
          <h3>Mood</h3>
          <p>{profile.mood}</p>

          <button onClick={() => setShowMoodOptions(!showMoodOptions)}>
            Change
          </button>

          {showMoodOptions && (
            <div className="mood-options">
              {moods.map((mood, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setProfile({ ...profile, mood });
                    setShowMoodOptions(false);
                  }}
                >
                  {mood}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card wide">
          <h3>About</h3>
          {isEditing ? (
            <textarea
              value={profile.about}
              onChange={(e) =>
                setProfile({ ...profile, about: e.target.value })
              }
            />
          ) : (
            <p>{profile.about}</p>
          )}
        </div>

        <div className="card">
          <h3>Hobbies</h3>
          <ul>
            {[0, 1, 2].map((i) => (
              <li key={i}>
                {isEditing ? (
                  <input
                    placeholder={`Hobby ${i + 1}`}
                    value={profile.hobbies?.[i] || ""}
                    onChange={(e) =>
                      updateList("hobbies", i, e.target.value)
                    }
                  />
                ) : (
                  profile.hobbies?.[i]
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="card wide">
          <h3>Password</h3>

          {!showPassword ? (
            <button onClick={() => setShowPassword(true)}>
              Change Password
            </button>
          ) : (
            <div className="password-section">

              <input
                type="password"
                placeholder="Current Password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="New Password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
              />

              <div className="pwd-actions">
                <button onClick={handlePasswordChange}>Save</button>

                <button
                  className="cancel-btn"
                  onClick={() => setShowPassword(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}