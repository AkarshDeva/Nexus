import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../api/users';
import { sendConnectionRequest, getPendingRequests, respondToRequest, getSentRequests, getMyConnections } from '../api/connections';
import { getMentorMatches } from '../api/ai';
import Navbar from '../components/Navbar';

const ROLE_EMOJI = { STUDENT: '', MENTOR: '', RECRUITER: '', ALUMNI: '', STARTUP: '' };

const ROLE_CONFIG = {
  STUDENT: {
    title: 'Discover People ',
    sub: 'find your next mentor, teammate, or connection',
    filters: ['ALL', 'STUDENT', 'MENTOR', 'RECRUITER', 'ALUMNI', 'STARTUP'],
    defaultFilter: 'ALL',
    showMentorAI: true,
    showRequests: false,
  },
  MENTOR: {
    title: 'Find Students ',
    sub: 'discover students to guide and mentor',
    filters: ['STUDENT'],
    defaultFilter: 'STUDENT',
    showMentorAI: false,
    showRequests: true,
  },
  RECRUITER: {
    title: 'Browse Candidates ',
    sub: 'find students and alumni for your openings',
    filters: ['STUDENT', 'ALUMNI'],
    defaultFilter: 'STUDENT',
    showMentorAI: false,
    showRequests: false,
  },
  ALUMNI: {
    title: 'Discover Students ',
    sub: 'give back — find students to support',
    filters: ['STUDENT'],
    defaultFilter: 'STUDENT',
    showMentorAI: false,
    showRequests: true,
  },
  STARTUP: {
    title: 'Discover Talent ',
    sub: 'find students and builders for your team',
    filters: ['STUDENT', 'ALUMNI'],
    defaultFilter: 'STUDENT',
    showMentorAI: false,
    showRequests: false,
  },
};

export default function Discover() {
  const me = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();
  const config = ROLE_CONFIG[me?.role] || ROLE_CONFIG.STUDENT;

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(config.defaultFilter);
  const [loading, setLoading] = useState(true);
  const [sentIds, setSentIds] = useState([]);
  const [message, setMessage] = useState('');
  const [matches, setMatches] = useState('');
  const [matchLoading, setMatchLoading] = useState(false);
  const [pending, setPending] = useState([]);
const [excludedIds, setExcludedIds] = useState([]);
useEffect(() => {
  load();
  loadExcluded();
  if (config.showRequests) loadPending();
}, [filter]);

const loadExcluded = async () => {
  try {
    const [sentRes, connRes] = await Promise.all([getSentRequests(), getMyConnections()]);
    const sentIds = sentRes.data.sent.map((r) => r.receiver.id);
    const connectedIds = connRes.data.connections.map((c) =>
      c.senderId === me?.id ? c.receiverId : c.senderId
    );
    setExcludedIds([...sentIds, ...connectedIds]);
  } catch (err) {
    console.error(err);
  }
};

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers(filter === 'ALL' ? null : filter);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPending = async () => {
    try {
      const res = await getPendingRequests();
      setPending(res.data.pending);
    } catch (err) {
      console.error(err);
    }
  };

const handleConnect = async (userId) => {
  try {
    await sendConnectionRequest(userId);
    setSentIds([...sentIds, userId]);
    setMessage('✅ Request sent!');
  } catch (err) {
    if (err.response?.status === 409) {
      // Already connected or already requested — treat as "sent" so the button reflects reality
      setSentIds([...sentIds, userId]);
      setMessage('You already have a connection with this person.');
    } else {
      setMessage('⚠️ ' + (err.response?.data?.error || 'Failed to send request'));
    }
  }
};

  const handleRespond = async (id, action) => {
    try {
      await respondToRequest(id, action);
      loadPending();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFindMentors = async () => {
    setMatchLoading(true);
    setMatches('');
    try {
      const res = await getMentorMatches();
      setMatches(res.data.matches);
    } catch (err) {
      setMatches('⚠️ Could not find matches right now.');
    } finally {
      setMatchLoading(false);
    }
  };

  const styles = `
    .disc-page {
      min-height: 100vh;
      background: #FFF7E8;
      background-image: radial-gradient(circle, #14171A11 1.5px, transparent 1.5px);
      background-size: 22px 22px;
      font-family: 'Space Grotesk', sans-serif;
      padding-bottom: 60px;
    }
    .wrap { max-width: 900px; margin: 0 auto; padding: 40px 20px 0; }
    h1 { font-family: 'Archivo Black', sans-serif; font-size: 28px; color: #14171A; margin-bottom: 4px; }
    .sub { font-family: 'Caveat', cursive; font-size: 19px; color: #14171A; margin-bottom: 20px; }
    .ai-panel { background: #E4EBFF; border: 4px solid #14171A; border-radius: 18px; box-shadow: 8px 8px 0px #14171A;
      padding: 22px 24px; margin-bottom: 26px; }
    .ai-panel h2 { font-family: 'Archivo Black', sans-serif; font-size: 15px; margin-bottom: 10px; }
    .ai-find-btn { background: #2B5AF0; color: #fff; border: 3px solid #14171A; border-radius: 10px;
      padding: 10px 20px; font-family: 'Archivo Black', sans-serif; font-size: 13px; cursor: pointer;
      box-shadow: 4px 4px 0px #14171A; transition: transform .15s, box-shadow .15s, opacity .15s; }
    .ai-find-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px #14171A; }
    .ai-find-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .ai-result { margin-top: 14px; background: #fff; border: 3px solid #14171A; border-radius: 12px;
      padding: 14px 16px; font-size: 13px; line-height: 1.7; color: #14171A; white-space: pre-line; }
    .requests-panel { background: #FFF1D8; border: 4px solid #14171A; border-radius: 18px; box-shadow: 8px 8px 0px #14171A;
      padding: 22px 24px; margin-bottom: 26px; }
    .requests-panel h2 { font-family: 'Archivo Black', sans-serif; font-size: 15px; margin-bottom: 12px; }
    .req-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0;
      border-bottom: 2px dashed #14171A22; }
    .req-row:last-child { border-bottom: none; }
    .req-row strong { font-size: 13px; color: #14171A; }
    .req-actions button { border: 2.5px solid #14171A; border-radius: 8px; padding: 5px 12px; font-size: 11px;
      font-weight: 700; cursor: pointer; margin-left: 8px; }
    .accept-btn { background: #C6FF3D; }
    .reject-btn { background: #FFE3E3; }
    .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
    .filter-chip { border: 2.5px solid #14171A; border-radius: 100px; padding: 6px 16px; font-size: 12px;
      font-weight: 700; cursor: pointer; background: #fff; transition: transform .15s, box-shadow .15s; }
    .filter-chip:hover { transform: translateY(-2px); }
    .filter-chip.active { background: #C6FF3D; box-shadow: 3px 3px 0 #14171A; }
    .msg { font-size: 13px; font-weight: 600; margin-bottom: 16px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
    .person-card { background: #fff; border: 4px solid #14171A; border-radius: 16px; box-shadow: 6px 6px 0px #14171A;
      padding: 20px; }
    .p-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .p-avatar { width: 40px; height: 40px; border-radius: 50%; background: #E4EBFF; border: 2.5px solid #14171A;
      display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .p-name { font-family: 'Archivo Black', sans-serif; font-size: 14px; color: #14171A; }
    .p-role { font-size: 11px; color: #8A8D96; font-weight: 600; }
    .p-bio { font-size: 12px; color: #4A4D55; margin: 8px 0; line-height: 1.5; min-height: 18px; }
    .p-skills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
    .p-skill { background: #FFF1D8; border: 2px solid #14171A; border-radius: 100px; padding: 2px 10px; font-size: 10px; font-weight: 600; }
    .card-actions { display: flex; gap: 8px; }
    .connect-btn { flex: 1; background: #FF3B7F; color: #fff; border: 2.5px solid #14171A; border-radius: 10px;
      padding: 8px; font-family: 'Archivo Black', sans-serif; font-size: 12px; cursor: pointer;
      box-shadow: 3px 3px 0px #14171A; transition: transform .15s, box-shadow .15s; }
    .connect-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px #14171A; }
    .connect-btn:disabled { background: #E4FFD1; color: #14171A; cursor: default; box-shadow: none; }
    .message-btn { background: #E4EBFF; border: 2.5px solid #14171A; border-radius: 10px;
      padding: 8px 14px; font-size: 14px; cursor: pointer; box-shadow: 3px 3px 0px #14171A;
      transition: transform .15s, box-shadow .15s; }
    .message-btn:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px #14171A; }
    .empty { font-family: 'Caveat', cursive; font-size: 18px; color: #8A8D96; }
  `;

  return (
    <div className="disc-page">
      <style>{styles}</style>
      <Navbar />

      <div className="wrap">
        <h1>{config.title}</h1>
        <p className="sub">{config.sub}</p>

        {config.showRequests && pending.length > 0 && (
          <div className="requests-panel">
            <h2> People who reached out to you ({pending.length})</h2>
            {pending.map((req) => (
              <div className="req-row" key={req.id}>
                <strong>{req.sender.profile?.fullName || req.sender.email}</strong>
                <div className="req-actions">
                  <button className="accept-btn" onClick={() => handleRespond(req.id, 'ACCEPTED')}>Accept</button>
                  <button className="reject-btn" onClick={() => handleRespond(req.id, 'REJECTED')}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {config.showMentorAI && (
          <div className="ai-panel">
            <h2> Let AI find your best-fit mentors</h2>
            <button className="ai-find-btn" onClick={handleFindMentors} disabled={matchLoading}>
              {matchLoading ? 'Matching...' : 'Find My Mentors →'}
            </button>
            {matches && <div className="ai-result">{matches}</div>}
          </div>
        )}

        {config.filters.length > 1 && (
          <div className="filters">
            {config.filters.map((f) => (
              <div
                key={f}
                className={`filter-chip ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'ALL' ? ' All' : `${ROLE_EMOJI[f]} ${f.charAt(0) + f.slice(1).toLowerCase()}`}
              </div>
            ))}
          </div>
        )}

        {message && <div className="msg">{message}</div>}
{loading ? (
  <p className="empty">Loading people...</p>
) : users.filter((u) => !excludedIds.includes(u.id)).length === 0 ? (
  <p className="empty">No one new to discover right now!</p>
) : (
  <div className="grid">
    {users.filter((u) => !excludedIds.includes(u.id)).map((u) => (
              <div className="person-card" key={u.id}>
                <div className="p-top">
                  <div className="p-avatar">{ROLE_EMOJI[u.role] || '✨'}</div>
                  <div>
                    <div className="p-name">{u.profile?.fullName || u.email}</div>
                    <div className="p-role">{u.role}</div>
                  </div>
                </div>
                <p className="p-bio">{u.profile?.bio || 'No bio yet.'}</p>
                {u.profile?.skills?.length > 0 && (
                  <div className="p-skills">
                    {u.profile.skills.slice(0, 4).map((s, i) => <span className="p-skill" key={i}>{s}</span>)}
                  </div>
                )}
                <div className="card-actions">
                  <button
                    className="connect-btn"
                    disabled={sentIds.includes(u.id)}
                    onClick={() => handleConnect(u.id)}
                  >
                    {sentIds.includes(u.id) ? '✓ Sent' : 'Connect →'}
                  </button>
                  <button
                    className="message-btn"
                    onClick={() => navigate('/messages', { state: { openUser: u } })}
                  >
                    💬
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}