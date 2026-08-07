import { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '../api/profile';
import { getProfileFeedback, getProjectIdeas } from '../api/ai';
import Navbar from '../components/Navbar';

const ROLE_COPY = {
  STUDENT: {
    title: 'Your Profile',
    sub: "this is what mentors & recruiters see",
    showFeedback: true,
    showIdeas: true,
  },
  MENTOR: {
    title: 'Your Mentoring Profile',
    sub: "this is what students see when they find you",
    showFeedback: false,
    showIdeas: false,
  },
  RECRUITER: {
    title: 'Your Company Profile',
    sub: "this is what candidates see about you",
    showFeedback: false,
    showIdeas: false,
  },
  ALUMNI: {
    title: 'Your Profile',
    sub: "this is what students & mentees see",
    showFeedback: false,
    showIdeas: false,
  },
  STARTUP: {
    title: 'Your Startup Profile',
    sub: "this is what talent sees about you",
    showFeedback: false,
    showIdeas: false,
  },
};

export default function Profile() {
  const me = JSON.parse(localStorage.getItem('user') || 'null');
  const copy = ROLE_COPY[me?.role] || ROLE_COPY.STUDENT;

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    bio: '',
    skills: '',
    githubUrl: '',
    resumeUrl: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [ideas, setIdeas] = useState('');
  const [ideasLoading, setIdeasLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMyProfile();
      const p = res.data.profile;
      setProfile(p);
      setForm({
        fullName: p.fullName || '',
        bio: p.bio || '',
        skills: (p.skills || []).join(', '),
        githubUrl: p.githubUrl || '',
        resumeUrl: p.resumeUrl || '',
        location: p.location || '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await updateMyProfile(payload);
      setProfile(res.data.profile);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleGetFeedback = async () => {
    setFeedbackLoading(true);
    setFeedback('');
    try {
      const res = await getProfileFeedback();
      setFeedback(res.data.feedback);
    } catch (err) {
      setFeedback('⚠️ Could not generate feedback right now.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleGetIdeas = async () => {
    setIdeasLoading(true);
    setIdeas('');
    try {
      const res = await getProjectIdeas();
      setIdeas(res.data.ideas);
    } catch (err) {
      setIdeas('⚠️ Could not generate ideas right now.');
    } finally {
      setIdeasLoading(false);
    }
  };

  const styles = `
    .profile-page {
      min-height: 100vh;
      background: #FFF7E8;
      background-image: radial-gradient(circle, #14171A11 1.5px, transparent 1.5px);
      background-size: 22px 22px;
      font-family: 'Space Grotesk', sans-serif;
      position: relative;
      overflow: hidden;
      padding-bottom: 60px;
    }
    .content { display: flex; flex-direction: column; align-items: center; padding: 40px 20px 0; }
    .loading-state { align-items: center; justify-content: center; font-family: 'Caveat', cursive; font-size: 22px; padding: 60px 0; text-align: center; }
    .blob { position: absolute; border: 4px solid #14171A; z-index: 0; }
    .blob1 { width: 90px; height: 90px; background: #FF7A33; top: 12%; right: 8%;
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; animation: float1 6s ease-in-out infinite; }
    @keyframes float1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(8deg); } }
    .profile-card { position: relative; z-index: 2; width: 520px; max-width: 92vw; background: #fff;
      border: 4px solid #14171A; border-radius: 18px; box-shadow: 10px 10px 0px #14171A; padding: 38px 34px; }
    .tape { position: absolute; top: -18px; left: 50%; transform: translateX(-50%) rotate(-3deg);
      width: 110px; height: 34px; background: rgba(43,90,240,0.75); border: 2px solid #14171A; }
    .profile-card h1 { font-family: 'Archivo Black', sans-serif; font-size: 26px; color: #14171A; margin-bottom: 4px; }
    .wave { font-size: 22px; }
    .profile-card .sub { font-family: 'Caveat', cursive; font-size: 19px; color: #14171A; margin-bottom: 22px; }
    .profile-card label { display: block; font-weight: 700; font-size: 12px; text-transform: uppercase;
      letter-spacing: 0.05em; margin-top: 16px; margin-bottom: 6px; color: #14171A; }
    .profile-card label .hint { text-transform: none; font-weight: 400; color: #8A8D96; font-size: 11px; }
    .profile-card input, .profile-card textarea { width: 100%; padding: 12px 14px; border: 3px solid #14171A;
      border-radius: 10px; font-family: 'Space Grotesk', sans-serif; font-size: 14px; background: #FFF7E8;
      outline: none; resize: vertical; transition: transform .15s, box-shadow .15s; }
    .profile-card input:focus, .profile-card textarea:focus { transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0px #2B5AF0; background: #fff; }
    .save-btn { width: 100%; margin-top: 26px; padding: 14px; background: #2B5AF0; border: 3px solid #14171A;
      border-radius: 12px; font-family: 'Archivo Black', sans-serif; font-size: 15px; color: #fff; cursor: pointer;
      box-shadow: 5px 5px 0px #14171A; transition: transform .15s, box-shadow .15s, opacity .15s; }
    .save-btn:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 7px 7px 0px #14171A; }
    .save-btn:active:not(:disabled) { transform: translate(2px, 2px); box-shadow: 2px 2px 0px #14171A; }
    .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .profile-error { margin-top: 16px; padding: 10px 14px; background: #FFE3E3; border: 2px solid #14171A;
      border-radius: 10px; font-size: 13px; font-weight: 600; }
    .profile-saved { margin-top: 16px; padding: 10px 14px; background: #E4FFD1; border: 2px solid #14171A;
      border-radius: 10px; font-size: 13px; font-weight: 600; }
    .ai-row { display: flex; gap: 10px; margin-top: 14px; }
    .ai-btn { flex: 1; padding: 13px; background: #C6FF3D; border: 3px solid #14171A;
      border-radius: 12px; font-family: 'Archivo Black', sans-serif; font-size: 13px; color: #14171A;
      cursor: pointer; box-shadow: 5px 5px 0px #14171A; transition: transform .15s, box-shadow .15s, opacity .15s; }
    .ai-btn.alt { background: #FFD166; }
    .ai-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 7px 7px 0px #14171A; }
    .ai-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .ai-feedback { margin-top: 18px; background: #FFF1D8; border: 3px solid #14171A; border-radius: 12px;
      padding: 16px 18px; font-size: 13px; line-height: 1.6; color: #14171A; white-space: pre-line; }
    @media (prefers-reduced-motion: reduce) { .blob { animation: none; } }
  `;

  if (loading) {
    return (
      <div className="profile-page">
        <style>{styles}</style>
        <Navbar />
        <div className="loading-state">Loading your profile... 📄</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <style>{styles}</style>
      <Navbar />
      <div className="blob blob1"></div>

      <div className="content">
        <div className="profile-card">
          <div className="tape"></div>
          <h1>{copy.title} <span className="wave">📄</span></h1>
          <p className="sub">{copy.sub}</p>

          <form onSubmit={handleSave}>
            <label>Full name</label>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} />

            <label>Bio</label>
            <textarea name="bio" rows="3" placeholder="Tell people what you're about..." value={form.bio} onChange={handleChange} />

            <label>Skills <span className="hint">(comma separated)</span></label>
            <input type="text" name="skills" placeholder="React, Node.js, Python" value={form.skills} onChange={handleChange} />

            <label>GitHub URL</label>
            <input type="text" name="githubUrl" placeholder="https://github.com/yourname" value={form.githubUrl} onChange={handleChange} />

            <label>Resume URL</label>
            <input type="text" name="resumeUrl" placeholder="link to your resume" value={form.resumeUrl} onChange={handleChange} />

            <label>Location</label>
            <input type="text" name="location" placeholder="City, Country" value={form.location} onChange={handleChange} />

            {error && <div className="profile-error">⚠️ {error}</div>}
            {saved && <div className="profile-saved">✅ Saved!</div>}

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes →'}
            </button>
          </form>

          {(copy.showFeedback || copy.showIdeas) && (
            <div className="ai-row">
              {copy.showFeedback && (
                <button type="button" className="ai-btn" onClick={handleGetFeedback} disabled={feedbackLoading}>
                  {feedbackLoading ? 'Thinking...' : '✨ AI Feedback'}
                </button>
              )}
              {copy.showIdeas && (
                <button type="button" className="ai-btn alt" onClick={handleGetIdeas} disabled={ideasLoading}>
                  {ideasLoading ? 'Thinking...' : '💡 Project Ideas'}
                </button>
              )}
            </div>
          )}

          {feedback && <div className="ai-feedback">{feedback}</div>}
          {ideas && <div className="ai-feedback">{ideas}</div>}
        </div>
      </div>
    </div>
  );
}