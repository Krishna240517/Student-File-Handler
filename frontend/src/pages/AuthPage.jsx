import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";
import "./cssFiles/auth.css";
import toast from "react-hot-toast";

const AuthPage = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const backendurl = 'http://localhost:3000'
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? `${backendurl}/api/v1/auth/login` : `${backendurl}/api/v1/auth/signup`;
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    const res = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(`${isLogin ? "Login" : "Signup"} successful`, {
        duration: 2000,
      });
      try {
        const profileRes = await fetch(`${backendurl}/api/v1/auth/profile`, {
          credentials: "include",
        });
        const userData = await profileRes.json();
        setUser(userData); // 🧠 this updates UserContext globally
      } catch (err) {
        console.error("Failed to fetch user profile after auth", err);
      }
      navigate("/");
    } else {
      toast.error(data.msg || "Error occurred", {
        duration: 2000,
      });
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        {!isLogin && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            required
            minLength="6"
            onChange={handleChange}
          />
        </div>

        <button className="btn" type="submit">
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <a className="toggle-link" onClick={toggleForm}>
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </a>
      </form>
    </div>
  );
};

export default AuthPage;
