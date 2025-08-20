
import { FaUsers, FaUpload, FaGoogleDrive } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from "../context/AuthContext.jsx";
import LightRays from '../bits/Backgrounds/LightRays/LightRays.jsx';
const Landing = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    
    const handleProfileClick = () => {
        if(user) {
            navigate("/profile");
        } else {
            navigate("/signup");
        }
    }
    return (
  <div className="relative min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
    {/* LightRays Background */}
    <div className="absolute inset-0 z-0">
      <LightRays />
    </div>

    {/* Page Content */}
    <div className="relative z-10">
      {/* Navbar */}
      <nav className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">StudyGroupHub</span>
        </div>

        <div className="flex items-center space-x-4">
          <div
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold">
                {user?.name?.[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>

          {!user && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="border border-purple-500 text-purple-400 font-semibold py-2 px-6 rounded-full hover:bg-purple-600 hover:text-white transition-colors duration-300">
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300">
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 text-center">
        {/* Hero Section */}
        <section className="mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 leading-tight">
            Share Files with Your Study Groups
          </h1>
          <p className="mt-8 text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Connect with classmates, create study groups, and share files seamlessly with Google Drive integration. Perfect for collaborative learning and academic success.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <button
            onClick={()=>navigate('/signup')} 
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300">
              Get Started
            </button>
            <button className="border border-purple-600 text-purple-400 font-semibold py-3 px-8 rounded-full hover:bg-purple-600 hover:text-white transition-colors duration-300">
              Learn More
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center text-center hover:bg-gray-700 transition-colors duration-300 shadow-lg">
            <div className="text-4xl text-purple-400 mb-4">
              <FaUsers />
            </div>
            <h3 className="text-xl font-bold mb-2">Create Groups</h3>
            <p className="text-gray-400">
              Form study groups with your classmates and collaborate on assignments together.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center text-center hover:bg-gray-700 transition-colors duration-300 shadow-lg">
            <div className="text-4xl text-purple-400 mb-4">
              <FaUpload />
            </div>
            <h3 className="text-xl font-bold mb-2">Share Files</h3>
            <p className="text-gray-400">
              Upload and share documents, presentations, and resources with your group members.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center text-center hover:bg-gray-700 transition-colors duration-300 shadow-lg">
            <div className="text-4xl text-purple-400 mb-4">
              <FaGoogleDrive />
            </div>
            <h3 className="text-xl font-bold mb-2">Google Drive</h3>
            <p className="text-gray-400">
              Seamless integration with Google Drive for secure and accessible file storage.
            </p>
          </div>
        </section>
      </main>

      <footer className="w-full text-right p-4 text-gray-500 text-sm"></footer>
    </div>
  </div>
);
};

export default Landing;