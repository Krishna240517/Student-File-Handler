import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { motion } from "framer-motion";
import { FaUserShield, FaUsers, FaFolder } from "react-icons/fa";
import toast from "react-hot-toast";

const Group = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState("members");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(
          `/user-group/get-group/${groupId}`,
          { withCredentials: true }
        );
        setGroup(res.data.group);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    }
    fetchData();
  }, [groupId]);

  if (!group) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl">
        Loading group...
      </div>
    );
  }
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.custom("Please select a file first!",{
      style:{
        color: "black"
      }
    });

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("groupId", group._id);
      const res = await api.post("/user-file/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log("File Uploaded", res.data.file);

      const updatedGroup = await api.get(`/user-group/get-group/${group._id}`,{withCredentials: true});
      setGroup(updatedGroup.data.group);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
        toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await api.delete(`/user-file/delete/${fileId}`, {
        withCredentials: true,
      });

      setGroup((prev) => ({
        ...prev,
        files: prev.files.filter((f) => f._id !== fileId),
      }));
      toast.success("File Deleted Successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Error in deleting the file")
    }
  };

  const handleViewFile = async (fileId) => {
    try {
      const res = await api.get(
        `/user-file/downloadUrl/${fileId}`,
        { withCredentials: true }
      );
      window.open(res.data.url, "_blank");
    } catch (err) {
      console.error("View failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-2xl p-6 shadow-lg mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">{group.groupName}</h1>
        <div className="flex items-center gap-3">
          <span className="text-gray-400">Created by:</span>
          <span className="font-semibold">{group.createdBy.name}</span>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500 rounded-full text-sm font-medium flex items-center gap-2">
            <FaUserShield /> Admin
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-xl font-semibold transition ${activeTab === "members"
              ? "bg-green-500 text-black shadow-lg"
              : "bg-gray-800/50 text-gray-400 hover:text-white"
            }`}
        >
          <FaUsers className="inline mr-2" /> Members
        </button>
        <button
          onClick={() => setActiveTab("files")}
          className={`px-4 py-2 rounded-xl font-semibold transition ${activeTab === "files"
              ? "bg-green-500 text-black shadow-lg"
              : "bg-gray-800/50 text-gray-400 hover:text-white"
            }`}
        >
          <FaFolder className="inline mr-2" /> Files
        </button>
      </div>

      {/* Members Tab */}
      {activeTab === "members" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FaUsers /> Members
          </h2>
          <ul className="space-y-3 max-h-[400px] overflow-y-auto">
            {group.members.map((member) => (
              <li
                key={member._id}
                className="flex justify-between bg-gray-900/60 px-4 py-3 rounded-lg hover:bg-gray-700/40"
              >
                <span className="font-medium">{member.name}</span>
                <span className="text-gray-400 text-sm">{member.email}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Files Tab */}
      {activeTab === "files" && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FaFolder /> Files
          </h2>

          {/* File List */}
          <div className="space-y-3 mb-6">
            {group.files?.length > 0 ? (
              group.files.map((file) => (
                <div
                  key={file._id}
                  className="flex justify-between bg-gray-900/60 px-4 py-3 rounded-lg hover:bg-gray-700/40"
                >
                  <button
                    onClick={() => handleViewFile(file._id)}
                    className="text-green-400 hover:underline"
                  >
                    {file.originalName}
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No files uploaded yet.</p>
            )}
          </div>

          {/* Upload Section */}
          <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-600 rounded-xl text-center">
            <input
              type="file"
              name="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Choose File
            </button>

            {selectedFile && (
              <p className="text-gray-300">
                Selected: <span className="font-semibold">{selectedFile.name}</span>
              </p>
            )}

            <button
              onClick={handleUploadFile}
              disabled={!selectedFile || uploading}
              className="px-6 py-2 bg-green-500 text-black font-semibold rounded-lg shadow-lg hover:bg-green-400 transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Group;
