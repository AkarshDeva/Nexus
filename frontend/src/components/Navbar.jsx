import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUnreadMessageCount, getPendingConnectionCount } from '../api/notifications';

const LINKS_BY_ROLE = {
  STUDENT: [
    { path: '/dashboard', label: 'Home' },
    { path: '/opportunities', label: 'Opportunities' },
    { path: '/roadmap', label: 'Roadmap' },
    { path: '/interview-prep', label: 'Interview Prep' },
    { path: '/profile', label: 'Profile' },
  ],
  MENTOR: [
    { path: '/dashboard', label: 'Home' },
    { path: '/mentees', label: 'My Mentees' },
    { path: '/discover', label: 'Find Students' },
    { path: '/connections', label: 'Connections' },
    { path: '/messages', label: 'Messages' },
    { path: '/profile', label: 'Profile' },
  ],
  RECRUITER: [
    { path: '/dashboard', label: 'Home' },
    { path: '/opportunities', label: 'My Postings' },
    { path: '/discover', label: 'Candidates' },
    { path: '/connections', label: 'Connections' },
    { path: '/messages', label: 'Messages' },
    { path: '/profile', label: 'Profile' },
  ],
  ALUMNI: [
    { path: '/dashboard', label: 'Home' },
    { path: '/discover', label: 'Discover' },
    { path: '/connections', label: 'Connections' },
    { path: '/opportunities', label: 'Opportunities' },
    { path: '/messages', label: 'Messages' },
    { path: '/profile', label: 'Profile' },
  ],
  STARTUP: [
    { path: '/dashboard', label: 'Home' },
    { path: '/opportunities', label: 'My Bounties' },
    { path: '/discover', label: 'Talent' },
    { path: '/connections', label: 'Connections' },
    { path: '/messages', label: 'Messages' },
    { path: '/profile', label: 'Profile' },
  ],
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const links = LINKS_BY_ROLE[user?.role] || LINKS_BY_ROLE.STUDENT;
 const [unreadMessages, setUnreadMessages] = useState(0);
const [pendingConnections, setPendingConnections] = useState(0);

  useEffect(() => {
  loadNotifCount();
  const interval = setInterval(loadNotifCount, 15000); // refresh every 15s
  return () => clearInterval(interval);
}, [location.pathname]);  

 const loadNotifCount = async () => {
  try {
    const [msgRes, connRes] = await Promise.all([
      getUnreadMessageCount(),
      getPendingConnectionCount(),
    ]);
    setUnreadMessages(msgRes.data.count);
    setPendingConnections(connRes.data.count);
  } catch (err) {
    // fail silently, not critical
  }
};
const handleBellClick = () => {
  if (pendingConnections > 0 && unreadMessages > 0) {
    // Both — go to whichever is more urgent, connections first since they need action
    navigate('/connections');
  } else if (pendingConnections > 0) {
    navigate('/connections');
  } else if (unreadMessages > 0) {
    navigate('/messages');
  } else {
    navigate('/connections');
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const styles = `
    .navbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: #FFF7E8;
      border-bottom: 4px solid #14171A;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 32px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .nav-logo {
      font-family: 'Archivo Black', sans-serif;
      font-size: 17px;
      color: #14171A;
      cursor: pointer;
      flex-shrink: 0;
    }
    .nav-links { display: flex; gap: 6px; flex-wrap: wrap; }
    .nav-link {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 12px;
      font-weight: 700;
      padding: 7px 12px;
      border: 2.5px solid #14171A;
      border-radius: 100px;
      background: #fff;
      cursor: pointer;
      transition: transform .15s, box-shadow .15s, background .15s;
      white-space: nowrap;
    }
    .nav-link:hover { transform: translateY(-2px); }
    .nav-link.active { background: #C6FF3D; box-shadow: 3px 3px 0 #14171A; }
    .nav-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
    .nav-user { font-size: 12px; font-weight: 600; color: #14171A; }
    .bell-wrap {
      position: relative;
      width: 34px;
      height: 34px;
      border: 2.5px solid #14171A;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: #fff;
      transition: transform .15s, box-shadow .15s;
    }
    .bell-wrap:hover { transform: translateY(-2px); box-shadow: 3px 3px 0px #14171A; }
    .bell-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: #FF3B7F;
      color: #fff;
      border: 2px solid #14171A;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }
    .nav-logout {
      background: #fff; border: 2.5px solid #14171A; border-radius: 100px;
      padding: 7px 14px; font-size: 12px; font-weight: 700; cursor: pointer;
      box-shadow: 3px 3px 0px #14171A; transition: transform .15s, box-shadow .15s;
    }
    .nav-logout:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px #14171A; }
    @media (max-width: 800px) { .nav-links { order: 3; width: 100%; justify-content: center; } }
  `;

  return (
    <nav className="navbar">
      <style>{styles}</style>
      <div className="nav-logo" onClick={() => navigate('/dashboard')}>Nexus</div>

      <div className="nav-links">
        {links.map((l) => (
          <div
            key={l.path}
            className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}
            onClick={() => navigate(l.path)}
          >
            {l.label}
          </div>
        ))}
      </div>

      <div className="nav-right">
        {user && <span className="nav-user">{user.fullName || user.email}</span>}

       <div className="bell-wrap" onClick={handleBellClick}>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14171A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
  {(unreadMessages + pendingConnections) > 0 && (
    <span className="bell-badge">
      {(unreadMessages + pendingConnections) > 9 ? '9+' : unreadMessages + pendingConnections}
    </span>
  )}
</div>

        <button className="nav-logout" onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}