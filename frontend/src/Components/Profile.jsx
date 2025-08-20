import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import Silk from "../bits/Backgrounds/Silk/Silk.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";
const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [newName, setNewName] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await api.post("/api-auth/logout", {}, { withCredentials: true });
      setUser(null);
      toast.success("Logout Successful");
      navigate("/");
    } catch (error) {
      console.error(error.message);
      toast.error("Logout Not Successful");
    }
  }


  const handleEditProfile = async () => {
    try {
      const response = await api.put("/user/edit-profile", { name: newName }, { withCredentials: true });
      setUser((prev) => ({ ...prev, name: response.data.user.name }));
      toast.success("Profile Updated Successfully");
      setIsEditing(false);
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to update profile");
    }
  }


  return (
  <div className="relative min-h-screen">
    {/* Fullscreen Silk background */}
    <div className="absolute inset-0 -z-10">
      <Silk />
    </div>

    {/* Content */}
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 text-gray-100">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          {isEditing ? (
            <input
              className="bg-gray-700 px-3 py-2 rounded-md text-white"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          ) : (
            <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
          )}
          <p className="text-gray-400 text-sm">Member since Jan 2025</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-purple-400" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-purple-400" />
            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
          {isEditing ? (
            <button
              onClick={handleEditProfile}
              className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition"
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={() => navigate("/my-groups")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition"
          >
            Groups
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
);
}

export default Profile

