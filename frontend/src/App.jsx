import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Connections from './pages/Connections';
import Messages from './pages/Messages';
import Opportunities from './pages/Opportunities';
import Discover from './pages/Discover';
import Roadmap from './pages/Roadmap';
import InterviewPrep from './pages/InterviewPrep';
import Mentees from './pages/Mentees';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/mentees" element={<Mentees />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;