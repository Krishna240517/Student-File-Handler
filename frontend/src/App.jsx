import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthPage from "./pages/AuthPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Group from "./pages/GroupPage.jsx";
import GroupDetails from "./pages/GroupDetails.jsx"
import { UserProvider } from "./context/userContext.jsx";
function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/usergroups" element={<Group />} />
                    <Route path="/usergroups/:groupId" element={<GroupDetails />} />
                </Routes>
                <Toaster />
            </Router>
        </UserProvider>
    );
}

export default App;
