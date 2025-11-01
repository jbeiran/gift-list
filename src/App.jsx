import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginOrCreate from "./components/LoginOrCreate";
import AdminPanel from "./components/AdminPanel";
import GuestView from "./components/GuestView";
import Snowfall from "./components/Snowfall";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden">
        <Snowfall />
        <Routes>
          <Route path="/" element={<LoginOrCreate />} />
          <Route path="/admin/:listId" element={<AdminPanel />} />
          <Route path="/lista/:listId" element={<GuestView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
