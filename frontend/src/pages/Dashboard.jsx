import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ROLE_EMOJI = {
  STUDENT: '',
  MENTOR: '',
  RECRUITER: '',
  ALUMNI: '',
  STARTUP: '',
};

// Role-specific tile sets — same underlying pages, different framing/priority per role
const ROLE_TILES = {
  STUDENT: [
    { path: '/discover', emoji: '', title: 'Discover People', desc: 'Find mentors, alumni & peers', color: 'tile-pink' },
    { path: '/opportunities', emoji: '', title: 'Opportunities', desc: 'Internships, jobs & bounties', color: 'tile-blue' },
    { path: '/roadmap', emoji: '', title: 'Learning Roadmap', desc: 'AI-mapped path to your goal', color: 'tile-lime' },
    { path: '/messages', emoji: '', title: 'Messages', desc: 'Your conversations live here', color: 'tile-orange' },
  ],
  MENTOR: [
   { path: '/mentees', emoji: '', title: 'Your Mentees', desc: 'Requests & people you guide', color: 'tile-pink' },
    { path: '/discover', emoji: '', title: 'Discover Students', desc: 'Find students to mentor', color: 'tile-blue' },
    { path: '/messages', emoji: '', title: 'Messages', desc: 'Your conversations live here', color: 'tile-lime' },
    { path: '/profile', emoji: '', title: 'My Profile', desc: 'Skills, bio & availability', color: 'tile-orange' },
  ],
  RECRUITER: [
    { path: '/opportunities', emoji: '', title: 'Post an Opportunity', desc: 'Internships, jobs & bounties', color: 'tile-pink' },
    { path: '/discover', emoji: '', title: 'Browse Candidates', desc: 'Find talent by skill & role', color: 'tile-blue' },
    { path: '/messages', emoji: '', title: 'Messages', desc: 'Your conversations live here', color: 'tile-lime' },
    { path: '/profile', emoji: '', title: 'Company Profile', desc: 'How candidates see you', color: 'tile-orange' },
  ],
 ALUMNI: [
  { path: '/discover', emoji: '', title: 'Discover Students', desc: 'Give back — find who to help', color: 'tile-pink' },
  { path: '/opportunities', emoji: '', title: 'Share a Role', desc: 'Post roles from your company', color: 'tile-blue' },
  { path: '/messages', emoji: '', title: 'Messages', desc: 'Your conversations live here', color: 'tile-lime' },
  { path: '/profile', emoji: '', title: 'My Profile', desc: 'Bio, skills & background', color: 'tile-orange' },
],
  STARTUP: [
    { path: '/opportunities', emoji: '', title: 'Post a Bounty', desc: 'Internships, jobs & bounties', color: 'tile-pink' },
    { path: '/discover', emoji: '', title: 'Discover Talent', desc: 'Find students & builders', color: 'tile-blue' },
    { path: '/messages', emoji: '', title: 'Messages', desc: 'Your conversations live here', color: 'tile-lime' },
    { path: '/profile', emoji: '', title: 'Startup Profile', desc: 'How candidates see you', color: 'tile-orange' },
  ],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    navigate('/');
    return null;
  }

  const roleEmoji = ROLE_EMOJI[user.role] || '';
  const tiles = ROLE_TILES[user.role] || ROLE_TILES.STUDENT;

  const styles = `
    .dash-page {
      min-height: 100vh;
      background: #FFF7E8;
      background-image: radial-gradient(circle, #14171A11 1.5px, transparent 1.5px);
      background-size: 22px 22px;
      font-family: 'Space Grotesk', sans-serif;
      position: relative;
      overflow: hidden;
      padding: 0 0 60px;
    }
    .blob { position: absolute; border: 4px solid #14171A; z-index: 0; }
    .blob1 { width: 100px; height: 100px; background: #C6FF3D; top: 12%; right: 6%;
      border-radius: 42% 58% 65% 35% / 45% 45% 55% 55%; animation: float1 6s ease-in-out infinite; }
    .blob2 { width: 70px; height: 70px; background: #2B5AF0; bottom: 8%; left: 5%;
      border-radius: 50%; animation: float2 7s ease-in-out infinite; }
    @keyframes float1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(8deg); } }
    @keyframes float2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(12px) rotate(-6deg); } }
    .welcome-note { position: relative; z-index: 2; max-width: 640px; margin: 36px auto 44px; padding: 0 24px; }
    .welcome-note .hey { font-family: 'Caveat', cursive; font-size: 22px; color: #14171A; margin-bottom: 2px; }
    .welcome-note h1 { font-family: 'Archivo Black', sans-serif; font-size: 32px; color: #14171A; margin-bottom: 12px; }
    .role-pill { display: inline-block; background: #FF3B7F; color: #fff; border: 2.5px solid #14171A;
      border-radius: 100px; padding: 5px 16px; font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
      box-shadow: 3px 3px 0px #14171A; }
    .grid { position: relative; z-index: 2; max-width: 900px; margin: 0 auto; padding: 0 24px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
    .tile { background: #fff; border: 4px solid #14171A; border-radius: 18px; padding: 28px 24px;
      box-shadow: 8px 8px 0px #14171A; cursor: pointer; transition: transform .2s, box-shadow .2s; }
    .tile:hover { transform: translate(-3px, -3px); box-shadow: 11px 11px 0px #14171A; }
    .tile-emoji { font-size: 32px; display: block; margin-bottom: 10px; }
    .tile h3 { font-family: 'Archivo Black', sans-serif; font-size: 18px; color: #14171A; margin-bottom: 6px; }
    .tile p { font-size: 13px; color: #5B5F6B; }
    .tile-pink { background: #FFE4EF; }
    .tile-lime { background: #F1FFDA; }
    .tile-blue { background: #E4EBFF; }
    .tile-orange { background: #FFEBE0; }
    @media (prefers-reduced-motion: reduce) { .blob { animation: none; } }
  `;

  return (
    <div className="dash-page">
      <style>{styles}</style>
      <Navbar />

      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      <div className="welcome-note">
        <p className="hey">Hey there,</p>
        <h1>{user.fullName || user.email} {roleEmoji}</h1>
        <span className="role-pill">{user.role}</span>
      </div>

      <div className="grid">
        {tiles.map((t) => (
          <div key={t.path} className={`tile ${t.color}`} onClick={() => navigate(t.path)}>
            <span className="tile-emoji">{t.emoji}</span>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}