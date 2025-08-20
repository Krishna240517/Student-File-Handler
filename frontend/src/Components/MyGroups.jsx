import { useState, useEffect, useContext, useRef } from "react";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaRegCopy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyGroups = () => {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [fabOpen, setFabOpen] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await api.get(
          "/user-group/get-my-groups",
          { withCredentials: true }
        );
        setGroups(response.data.userGroups);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    }
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-6 relative">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name}</h1>
        <h2 className="text-xl text-gray-400">Your Groups</h2>
      </header>

      {/* Inside MyGroups component */}
      {showJoinInput && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
        >
          <JoinGroupInline
            onJoin={(newGroup) => {
              if (newGroup) setGroups((prev) => [...prev, newGroup]); 
              setShowJoinInput(false); 
            }}
          />
        </motion.div>
      )}
      {showCreateModal && (
        <CreateGroupModal
          onCreate={(newGroup) => {
            if (newGroup) setGroups((prev) => [...prev, newGroup]);
            setShowCreateModal(false);
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      )}
      <section className="w-full max-w-6xl mt-6">
        {groups.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 text-lg">
            OOPS! Seems like you haven't joined any group 😔
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => (
              {group},
              <GroupCard
                key={group._id}
                id={group._id}
                name={group.groupName}
                createdBy={group.createdBy.name}
                membersCount={group.members.length}
                filesCount={group.files.length}
                joinCode={group.joinCode}
                isCreator={group.createdBy._id.toString() === user._id.toString()}
              />
            ))}
          </div>
        )}
      </section>


      <div className="fixed bottom-8 right-8 flex flex-col items-end">
        <AnimatePresence>
          {fabOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4 flex flex-col gap-3"
            >
              <button
                onClick={() => {
                  setShowJoinInput((prev) => !prev);
                  setFabOpen(false);
                }}
                className="bg-gray-800 bg-opacity-70 backdrop-blur-md px-4 py-2 rounded-xl text-white font-semibold shadow-lg hover:bg-gray-700 transition"
              >
                Join Group
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gray-800 bg-opacity-70 backdrop-blur-md px-4 py-2 rounded-xl text-white font-semibold shadow-lg hover:bg-gray-700 transition"
              >
                Create Group
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setFabOpen(!fabOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl text-2xl"
        >
          <FaPlus />
        </motion.button>
      </div>
    </div>
  );
};

const GroupCard = ({ id, name, createdBy, membersCount, filesCount, joinCode, isCreator }) => {
  const navigate = useNavigate();
  const handleCopy = () => {
    navigator.clipboard.writeText(joinCode);
    toast.success("Group code copied!");
  };
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(255, 255, 255, 0.2)" }}
      className="bg-gray-800 bg-opacity-30 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between shadow-md transition-all duration-300"
    >
      <div>
        <h3 className="text-2xl font-semibold mb-2 text-white">{name}</h3>
        <p className="text-gray-300"><strong>Created By:</strong> {createdBy}</p>
        <p className="text-gray-300"><strong>Members:</strong> {membersCount}</p>
        <p className="text-gray-300"><strong>Files:</strong> {filesCount}</p>
        {/* Show join code only if user is creator */}
        {isCreator && (
          <div className="mt-3 flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
            <span className="text-gray-200 font-mono">Code: {joinCode}</span>
            <button
              onClick={handleCopy}
              className="text-blue-400 hover:text-blue-300 transition"
            >
              <FaRegCopy />
            </button>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(`/group/${id}`)}
        className="mt-4 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors duration-200"
      >
        View Group
      </motion.button>
    </motion.div>
  );
};

const JoinGroupInline = ({ onJoin }) => {
  const CODE_LENGTH = 6;
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputRef = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.toUpperCase();
    if (/^[A-Z0-9]?$/.test(val)) {
      const newCode = [...code];
      newCode[idx] = val;
      setCode(newCode);
      if (val && idx < CODE_LENGTH - 1) inputRef.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRef.current[idx - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const joinCode = code.join("");
    if (joinCode.length !== CODE_LENGTH) return;
    try {
      const res = await api.post(
        "/user-group/join-group",
        { code: joinCode },
        { withCredentials: true }
      );
      toast.success(res.data.msg);
      setCode(Array(CODE_LENGTH).fill(""));
      onJoin(res.data.group);
    } catch (err) {
      console.error("Error joining group:", err);
      toast.error("Invalid code!");
    }
  };
  
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="bg-gray-800 rounded-2xl p-2 flex flex-col items-center shadow-2xl w-full max-w-md"
    >
      <p className="text-white text-lg mb-4">Enter Group Code</p>
      <div className="flex gap-3 mb-6">
        {code.map((c, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={c}
            ref={(el) => (inputRef.current[idx] = el)}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-14 h-14 text-center rounded-lg bg-gray-700 text-white text-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500 transition"
          />
        ))}
      </div>
      <motion.button
        onClick={handleSubmit}
        whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition"
      >
        Join
      </motion.button>
      <button
        onClick={() => onJoin(null)}
        className="mt-4 text-gray-400 hover:text-white transition"
      >
        Cancel
      </button>
    </motion.div>
  );
};


const CreateGroupModal = ({ onCreate, onCancel }) => {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    try {
      const res = await api.post("/user-group/create-group", { name: groupName }, { withCredentials: true });
      const data = res.data;
      if (data.group) {
        onCreate(data.group);
        toast.success("Group Created Successfully");
      }
    } catch (error) {
      toast.error("Error in creating group");
      console.error("Error creating group:", error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-96 border border-gray-700"
      >
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          Create New Group
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
export default MyGroups;
