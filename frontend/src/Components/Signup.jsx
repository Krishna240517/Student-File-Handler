import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState, useContext } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api-auth/signup", formData, {
        withCredentials: true
      });

      const userResponse = await api.get("/api-auth/me",{
        withCredentials: true
      })
      setUser(userResponse.data.user);
      toast.success("Signup Successful",{
        duration: 1500
      })
      navigate('/');
    } catch (error) {
      toast.error("Signup Not Successful",{
        duration: 1500
      })
      console.error(error.response?.data || error.message);
    }
  }
  
  const handleGoogleSignup = () => {
    window.location.href="http://localhost:3000/auth/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex rounded-3xl shadow-lg overflow-hidden max-w-4xl w-full min-h-[600px] bg-gray-900">

        {/* Left Section */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Sign Up</h2>
          <p className="text-lg text-gray-400 mb-8">Create your account to join</p>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleInputChange}
            className="w-full mb-5 p-4 border border-gray-700 rounded-lg text-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
            className="w-full mb-5 p-4 border border-gray-700 rounded-lg text-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="relative w-full mb-5">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              className="w-full p-4 pr-12 border border-gray-700 rounded-lg text-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <MdOutlineVisibilityOff size={24} />
              ) : (
                <MdOutlineVisibility size={24} />
              )}
            </button>
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-purple-600 text-white py-3 rounded-lg mb-5 hover:bg-purple-700 text-lg font-semibold transition">
            Sign Up
          </button>
          {/* OR Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow h-px bg-gray-700"></div>
            <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
            <div className="flex-grow h-px bg-gray-700"></div>
          </div>
          {/* Google Button */}
          <button 
            onClick={handleGoogleSignup}
            className="w-full border border-gray-600 flex items-center justify-center py-3 rounded-lg hover:bg-gray-700 text-lg font-medium text-white">
            <FcGoogle size={24} className="mr-3" />
            Continue with Google
          </button>

          <p className="mt-8 text-base text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="font-bold text-purple-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>

        {/* Right Section */}
        <div
          className="w-1/2 relative bg-cover bg-center flex items-end p-8 text-white"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1525182008055-f88b95ff7980?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-light">
              Be a Part of <span className="font-bold">Something Beautiful</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
