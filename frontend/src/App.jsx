import Home from "./pages/Home"
import LandingPage from "./pages/Landing.jsx"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from "./pages/AuthPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ResumeUploadPage from "./pages/ResumeUploadPage"
import ChatWindowPage from "./pages/ChatWindowPage"
import PricingPage from "./pages/PricingPage"

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthPage />} />
            {/* Add other routes here */}
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/resume-upload" element={<ResumeUploadPage />} />
            <Route path="/chat" element={<ChatWindowPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            {/* Add a catch-all route for 404 */}
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    </Router>
);

export default App;