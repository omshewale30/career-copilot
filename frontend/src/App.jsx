import Home from "./pages/Home"
import LandingPage from "./pages/Landing.jsx"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from "./pages/AuthPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Add other routes here */}
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Add a catch-all route for 404 */}
        </Routes>
    </Router>
);

export default App;