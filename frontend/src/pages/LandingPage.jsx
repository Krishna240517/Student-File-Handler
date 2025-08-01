import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../context/userContext.jsx';
import { useNavigate } from "react-router-dom";
import { Folder, Lock, Upload } from 'lucide-react';
import axios from 'axios';
import './cssFiles/LandingPage.css';
const LandingPage = () => {
  const { setUser } = useContext(UserContext);
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");


  const navigate = useNavigate();
  useEffect(() => {
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.7
    });

    cards.forEach(card => observer.observe(card));
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/auth/profile", {
          withCredentials: true
        })
        const userInfo = response.data.user;
        setName(userInfo.name);
        setRole(userInfo.role);
      } catch (err) {
        console.error("Error fetching userinfo profile", err);
      }
    }
    fetchData();
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/auth/logout", {
        withCredentials: true
      })
      setUser(null);
      navigate("/auth")
    } catch (err) {
      console.error("Logout failed", err);
    }
  }
  const handleAuthRedirect = () => {
    navigate("/auth");
  };

  const handleGroupRedirect = () => {
    navigate("/usergroups");
  }

  return (
    <>
      <header id="home">

        <nav>
          <div id="left">
            <i className="ri-book-line"></i>
            <h1>StudentGroupHub</h1>
          </div>
          <div id="right">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#" onClick={handleGroupRedirect}>My Groups</a>
            <button id="reglog" onClick={handleAuthRedirect}>Register/Login</button>
          </div>

          <div className="profile-container">
            <img src="./cssFiles/profile-user.png" alt="Profile" className="profile-icon" />
            <div className="profile-card">
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Role:</strong> {role}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </nav>
      </header>
      <section id="hero">
        <div id="Content">
          <h1>Easily Upload and Share Files Within Your Groups</h1>
          <h3>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit eaque laborum similique, magnam cumque, et
            dicta dignissimos voluptate quisquam atque incidunt molestiae distinctio ut eius, ullam tempore libero
            quam recusandae ipsum aspernatur excepturi. Aut, facere itaque excepturi quidem pariatur aliquam
            quibusdam quaerat. Quod, exercitationem voluptatum.</h3>
        </div>
        <div id="imageContainer"></div>
      </section>
      <section id="about">
        <Card icon={<Folder size={100} color="#1b10f0" />} title="Organized by Groups" desc="Upload and access files in dedicated groups." />
        <Card icon={<Lock size={100} color="#1b10f0" />} title="Secure Login" desc="Only group members can access relevant files." />
        <Card icon={<Upload size={100} color="#1b10f0" />} title="Simple Upload Interface" desc="Drag and Drop or Browse to upload files." />
      </section>
    </>
  );
};

const Card = (props) => {
  return (
    <div className="card" id={props.id}>
      <div className="iconContainer">
        {props.icon}
      </div>
      <div id="content">
        <h2>{props.title}</h2>
        <p>{props.desc}</p>
      </div>
    </div>
  )
}
export default LandingPage;
