import { useState } from 'react';
import { getInterviewPrep } from '../api/ai';
import Navbar from '../components/Navbar';

export default function InterviewPrep() {
  const [targetRole, setTargetRole] = useState('');
  const [prep, setPrep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetRole.trim()) return;
    setLoading(true);
    setError('');
    setPrep('');
    try {
      const res = await getInterviewPrep(targetRole.trim());
      setPrep(res.data.prep);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate interview prep');
    } finally {
      setLoading(false);
    }
  };

  // Split the raw text into question blocks (each starting with **Q)
  const blocks = prep
    ? prep.split(/(?=\*\*Q\d:)/).filter((b) => b.trim())
    : [];

  const styles = `
    .interview-page {
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
    .blob1 { width: 90px; height: 90px; background: #FF3B7F; top: 8%; right: 8%;
      border-radius: 42% 58% 65% 35% / 45% 45% 55% 55%; animation: float1 6s ease-in-out infinite; }
    @keyframes float1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(8deg); } }
    .wrap { max-width: 680px; margin: 0 auto; padding: 40px 20px 0; position: relative; z-index: 2; }
    h1 { font-family: 'Archivo Black', sans-serif; font-size: 28px; color: #14171A; margin-bottom: 4px; }
    .sub { font-family: 'Caveat', cursive; font-size: 19px; color: #14171A; margin-bottom: 24px; }
    .panel { background: #fff; border: 4px solid #14171A; border-radius: 18px; box-shadow: 8px 8px 0px #14171A;
      padding: 28px; }
    .panel label { display: block; font-weight: 700; font-size: 12px; text-transform: uppercase;
      letter-spacing: 0.05em; margin-bottom: 8px; }
    .role-form { display: flex; gap: 10px; }
    .role-form input { flex: 1; padding: 12px 14px; border: 3px solid #14171A; border-radius: 10px;
      font-family: 'Space Grotesk', sans-serif; font-size: 14px; background: #FFF7E8; outline: none; }
    .role-form button { background: #FF3B7F; color: #fff; border: 3px solid #14171A; border-radius: 10px;
      padding: 12px 22px; font-family: 'Archivo Black', sans-serif; font-size: 13px; cursor: pointer;
      box-shadow: 4px 4px 0px #14171A; transition: transform .15s, box-shadow .15s, opacity .15s; white-space: nowrap; }
    .role-form button:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px #14171A; }
    .role-form button:disabled { opacity: 0.6; cursor: not-allowed; }
    .error-box { margin-top: 14px; padding: 10px 14px; background: #FFE3E3; border: 2px solid #14171A;
      border-radius: 10px; font-size: 13px; font-weight: 600; }
    .q-list { margin-top: 22px; }
    .q-card { background: #E4EBFF; border: 3px solid #14171A; border-radius: 12px; padding: 16px 18px;
      margin-bottom: 12px; font-size: 13px; line-height: 1.6; color: #14171A; white-space: pre-line; }
    .empty { font-family: 'Caveat', cursive; font-size: 17px; color: #8A8D96; margin-top: 20px; text-align: center; }
    @media (prefers-reduced-motion: reduce) { .blob { animation: none; } }
  `;

  return (
    <div className="interview-page">
      <style>{styles}</style>
      <Navbar />
      <div className="blob blob1"></div>

      <div className="wrap">
        <h1>Interview Prep 🎤</h1>
        <p className="sub">practice questions, tailored to you</p>

        <div className="panel">
          <label>What role are you interviewing for?</label>
          <form className="role-form" onSubmit={handleGenerate}>
            <input
              type="text"
              placeholder="e.g. Backend Engineer, Product Manager"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Prepping...' : 'Generate →'}
            </button>
          </form>

          {error && <div className="error-box">⚠️ {error}</div>}

          {blocks.length > 0 && (
            <div className="q-list">
              {blocks.map((b, i) => (
                <div className="q-card" key={i}>{b.trim()}</div>
              ))}
            </div>
          )}

          {blocks.length === 0 && !loading && !error && (
            <p className="empty">Your practice questions will show up here ✨</p>
          )}
        </div>
      </div>
    </div>
  );
}