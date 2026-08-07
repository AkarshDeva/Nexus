import { useEffect, useState } from 'react';
import { getAllOpportunities, createOpportunity, deleteOpportunity } from '../api/opportunities';
import { matchOpportunity } from '../api/ai';
import Navbar from '../components/Navbar';

const TYPE_EMOJI = { internship: '🎯', job: '💼', bounty: '🏗️' };

// Roles that POST opportunities see "My Postings" by default and never see "Check My Fit"
const POSTER_ROLES = ['RECRUITER', 'STARTUP'];
const ROLE_COPY = {
  STUDENT: { title: 'Opportunities 🎯', sub: 'internships, jobs & bounties, all in one place', showFit: true, defaultMine: false },
  MENTOR: { title: 'Opportunities 🎯', sub: 'share roles with your students', showFit: false, defaultMine: false },
  RECRUITER: { title: 'My Postings 📢', sub: 'manage the roles you have posted', showFit: false, defaultMine: true },
  ALUMNI: { title: 'Opportunities 🎯', sub: 'share a role from your company', showFit: false, defaultMine: false },
  STARTUP: { title: 'My Bounties 🏗️', sub: 'manage what you have posted', showFit: false, defaultMine: true },
};

export default function Opportunities() {
  const me = JSON.parse(localStorage.getItem('user') || 'null');
  const copy = ROLE_COPY[me?.role] || ROLE_COPY.STUDENT;
  const isPoster = POSTER_ROLES.includes(me?.role);

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showMineOnly, setShowMineOnly] = useState(copy.defaultMine);
  const [form, setForm] = useState({ title: '', description: '', type: 'internship', skillsNeeded: '' });
  const [message, setMessage] = useState('');
  const [matchResults, setMatchResults] = useState({});
  const [matchLoadingId, setMatchLoadingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllOpportunities();
      setOpportunities(res.data.opportunities);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await createOpportunity({
        ...form,
        skillsNeeded: form.skillsNeeded.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setForm({ title: '', description: '', type: 'internship', skillsNeeded: '' });
      setShowForm(false);
      setMessage('✅ Opportunity posted!');
      load();
    } catch (err) {
      setMessage('⚠️ ' + (err.response?.data?.error || 'Failed to post'));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOpportunity(id);
      load();
    } catch (err) {
      setMessage('⚠️ ' + (err.response?.data?.error || 'Failed to delete'));
    }
  };

  const handleCheckFit = async (id) => {
    setMatchLoadingId(id);
    try {
      const res = await matchOpportunity(id);
      setMatchResults({ ...matchResults, [id]: res.data.result });
    } catch (err) {
      setMatchResults({ ...matchResults, [id]: '⚠️ Could not check fit right now.' });
    } finally {
      setMatchLoadingId(null);
    }
  };

  const visibleOpportunities = showMineOnly
    ? opportunities.filter((o) => o.postedById === me?.id)
    : opportunities;

  const styles = `
    .opp-page {
      min-height: 100vh;
      background: #FFF7E8;
      background-image: radial-gradient(circle, #14171A11 1.5px, transparent 1.5px);
      background-size: 22px 22px;
      font-family: 'Space Grotesk', sans-serif;
      position: relative;
      overflow: hidden;
      padding-bottom: 60px;
    }
    .blob { position: absolute; border: 4px solid #14171A; z-index: 0; }
    .blob1 { width: 90px; height: 90px; background: #2B5AF0; top: 6%; right: 8%; border-radius: 50%;
      animation: float1 6s ease-in-out infinite; }
    @keyframes float1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(8deg); } }
    .wrap { max-width: 800px; margin: 0 auto; padding: 40px 20px 0; position: relative; z-index: 2; }
    .top-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
    h1 { font-family: 'Archivo Black', sans-serif; font-size: 28px; color: #14171A; margin-bottom: 4px; }
    .sub { font-family: 'Caveat', cursive; font-size: 19px; color: #14171A; }
    .post-btn { background: #FF3B7F; color: #fff; border: 3px solid #14171A; border-radius: 100px;
      padding: 10px 20px; font-family: 'Archivo Black', sans-serif; font-size: 13px; cursor: pointer;
      box-shadow: 4px 4px 0px #14171A; transition: transform .15s, box-shadow .15s; white-space: nowrap; }
    .post-btn:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px #14171A; }
    .toggle-row { display: flex; gap: 8px; margin-bottom: 22px; }
    .toggle-chip { border: 2.5px solid #14171A; border-radius: 100px; padding: 6px 16px; font-size: 12px;
      font-weight: 700; cursor: pointer; background: #fff; transition: transform .15s, box-shadow .15s; }
    .toggle-chip.active { background: #C6FF3D; box-shadow: 3px 3px 0 #14171A; }
    .form-panel { background: #fff; border: 4px solid #14171A; border-radius: 18px; box-shadow: 8px 8px 0px #14171A;
      padding: 24px; margin-bottom: 24px; }
    .form-panel label { display: block; font-weight: 700; font-size: 12px; text-transform: uppercase;
      margin-top: 12px; margin-bottom: 6px; }
    .form-panel input, .form-panel textarea, .form-panel select { width: 100%; padding: 10px 12px;
      border: 3px solid #14171A; border-radius: 10px; font-family: 'Space Grotesk', sans-serif; font-size: 13px;
      background: #FFF7E8; outline: none; }
    .form-panel button.submit { margin-top: 16px; background: #C6FF3D; border: 3px solid #14171A; border-radius: 10px;
      padding: 10px 18px; font-family: 'Archivo Black', sans-serif; font-size: 13px; cursor: pointer;
      box-shadow: 4px 4px 0px #14171A; }
    .msg { font-size: 13px; font-weight: 600; margin-bottom: 16px; }
    .opp-card { background: #fff; border: 4px solid #14171A; border-radius: 18px; box-shadow: 6px 6px 0px #14171A;
      padding: 20px 22px; margin-bottom: 18px; }
    .opp-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .opp-title { font-family: 'Archivo Black', sans-serif; font-size: 17px; color: #14171A; }
    .opp-type { display: inline-block; background: #FFF1D8; border: 2px solid #14171A; border-radius: 100px;
      padding: 3px 12px; font-size: 11px; font-weight: 700; margin-top: 6px; }
    .opp-desc { font-size: 13px; color: #4A4D55; margin: 10px 0; line-height: 1.5; }
    .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .skill-tag { background: #E4EBFF; border: 2px solid #14171A; border-radius: 100px; padding: 3px 10px; font-size: 11px; font-weight: 600; }
    .opp-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 11px; color: #8A8D96; }
    .del-btn { background: #FFE3E3; border: 2px solid #14171A; border-radius: 8px; padding: 4px 10px;
      font-size: 11px; font-weight: 700; cursor: pointer; }
    .empty { font-family: 'Caveat', cursive; font-size: 18px; color: #8A8D96; }
    .fit-btn { margin-top: 14px; background: #C6FF3D; border: 2.5px solid #14171A; border-radius: 10px;
      padding: 8px 16px; font-family: 'Archivo Black', sans-serif; font-size: 12px; color: #14171A;
      cursor: pointer; box-shadow: 3px 3px 0px #14171A; transition: transform .15s, box-shadow .15s, opacity .15s; }
    .fit-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 5px 5px 0px #14171A; }
    .fit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .fit-result { margin-top: 12px; background: #FFF1D8; border: 2.5px solid #14171A; border-radius: 10px;
      padding: 12px 14px; font-size: 12px; line-height: 1.6; color: #14171A; }
    @media (prefers-reduced-motion: reduce) { .blob { animation: none; } }
  `;

  return (
    <div className="opp-page">
      <style>{styles}</style>
      <Navbar />
      <div className="blob blob1"></div>

      <div className="wrap">
        <div className="top-row">
          <div>
            <h1>{copy.title}</h1>
            <p className="sub">{copy.sub}</p>
          </div>
          <button className="post-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Post one'}
          </button>
        </div>

        {isPoster && (
          <div className="toggle-row">
            <div className={`toggle-chip ${showMineOnly ? 'active' : ''}`} onClick={() => setShowMineOnly(true)}>
              📌 My Postings
            </div>
            <div className={`toggle-chip ${!showMineOnly ? 'active' : ''}`} onClick={() => setShowMineOnly(false)}>
              🌐 All Postings
            </div>
          </div>
        )}

        {message && <div className="msg">{message}</div>}

        {showForm && (
          <div className="form-panel">
            <form onSubmit={handleCreate}>
              <label>Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required />

              <label>Description</label>
              <textarea name="description" rows="3" value={form.description} onChange={handleChange} required />

              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="internship">Internship</option>
                <option value="job">Job</option>
                <option value="bounty">Bounty</option>
              </select>

              <label>Skills needed (comma separated)</label>
              <input type="text" name="skillsNeeded" placeholder="React, Node.js" value={form.skillsNeeded} onChange={handleChange} />

              <button type="submit" className="submit">Post it →</button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="empty">Loading opportunities...</p>
        ) : visibleOpportunities.length === 0 ? (
          <p className="empty">
            {showMineOnly ? "You haven't posted anything yet — hit + Post one!" : 'Nothing posted yet — be the first! 🚀'}
          </p>
        ) : (
          visibleOpportunities.map((o) => (
            <div className="opp-card" key={o.id}>
              <div className="opp-top">
                <div>
                  <div className="opp-title">{TYPE_EMOJI[o.type] || '📌'} {o.title}</div>
                  <span className="opp-type">{o.type}</span>
                </div>
              </div>
              <p className="opp-desc">{o.description}</p>
              {o.skillsNeeded?.length > 0 && (
                <div className="skill-tags">
                  {o.skillsNeeded.map((s, i) => <span className="skill-tag" key={i}>{s}</span>)}
                </div>
              )}
              <div className="opp-footer">
                <span>Posted by {o.postedBy?.profile?.fullName || 'someone'}</span>
                {o.postedById === me?.id && (
                  <button className="del-btn" onClick={() => handleDelete(o.id)}>Delete</button>
                )}
              </div>

              {copy.showFit && (
                <>
                  <button
                    className="fit-btn"
                    onClick={() => handleCheckFit(o.id)}
                    disabled={matchLoadingId === o.id}
                  >
                    {matchLoadingId === o.id ? 'Checking...' : '✨ Check My Fit'}
                  </button>
                  {matchResults[o.id] && (
                    <div className="fit-result">
                      {matchResults[o.id].split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}