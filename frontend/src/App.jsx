import Landing from "./Components/Landing.jsx";
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";
import Profile from "./Components/Profile.jsx";
import MyGroups from "./Components/MyGroups.jsx";
import MyFiles from "./Components/MyFiles.jsx";
import Group from "./Components/Group.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}  />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/my-groups" element={<MyGroups/>} />
        <Route path="/my-files" element={<MyFiles/>}  />
        <Route path="/group/:groupId" element={<Group/>} />
      </Routes>
      <Toaster/>
    </BrowserRouter>
  )
}

export default App