import { useState } from 'react';
import { generateRoadmap } from '../api/ai';
import Navbar from '../components/Navbar';

export default function Roadmap() {
  const [targetRole, setTargetRole] = useState('');
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetRole.trim()) return;
    setLoading(true);
    setError('');
    setRoadmap('');
    try {
      const res = await generateRoadmap(targetRole.trim());
      setRoadmap(res.data.roadmap);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    .roadmap-page {
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
    .blob1 { width: 90px; height: 90px; background: #FF7A33; top: 8%; right: 8%;
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; animation: float1 6s ease-in-out infinite; }
    @keyframes float1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(8deg); } }
    .wrap { max-width: 640px; margin: 0 auto; padding: 40px 20px 0; position: relative; z-index: 2; }
    h1 { font-family: 'Archivo Black', sans-serif; font-size: 28px; color: #14171A; margin-bottom: 4px; }
    .sub { font-family: 'Caveat', cursive; font-size: 19px; color: #14171A; margin-bottom: 24px; }
    .panel { background: #fff; border: 4px solid #14171A; border-radius: 18px; box-shadow: 8px 8px 0px #14171A;
      padding: 28px; }
    .panel label { display: block; font-weight: 700; font-size: 12px; text-transform: uppercase;
      letter-spacing: 0.05em; margin-bottom: 8px; }
    .role-form { display: flex; gap: 10px; }
    .role-form input { flex: 1; padding: 12px 14px; border: 3px solid #14171A; border-radius: 10px;
      font-family: 'Space Grotesk', sans-serif; font-size: 14px; background: #FFF7E8; outline: none; }
    .role-form button { background: #2B5AF0; color: #fff; border: 3px solid #14171A; border-radius: 10px;
      padding: 12px 22px; font-family: 'Archivo Black', sans-serif; font-size: 13px; cursor: pointer;
      box-shadow: 4px 4px 0px #14171A; transition: transform .15s, box-shadow .15s, opacity .15s; white-space: nowrap; }
    .role-form button:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 6px 6px 0px #14171A; }
    .role-form button:disabled { opacity: 0.6; cursor: not-allowed; }
    .error-box { margin-top: 14px; padding: 10px 14px; background: #FFE3E3; border: 2px solid #14171A;
      border-radius: 10px; font-size: 13px; font-weight: 600; }
    .roadmap-result { margin-top: 22px; }
    .roadmap-step { background: #FFF1D8; border: 3px solid #14171A; border-radius: 12px; padding: 14px 16px;
      margin-bottom: 12px; font-size: 13px; line-height: 1.6; color: #14171A; }
    .empty { font-family: 'Caveat', cursive; font-size: 17px; color: #8A8D96; margin-top: 20px; text-align: center; }
    @media (prefers-reduced-motion: reduce) { .blob { animation: none; } }
  `;

  return (
    <div className="roadmap-page">
      <style>{styles}</style>
      <Navbar />
      <div className="blob blob1"></div>

      <div className="wrap">
        <h1>Learning Roadmap 🗺️</h1>
        <p className="sub">tell us where you want to go, we'll map the path</p>

        <div className="panel">
          <label>I want to become a...</label>
          <form className="role-form" onSubmit={handleGenerate}>
            <input
              type="text"
              placeholder="e.g. Frontend Developer, Data Scientist"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Mapping...' : 'Generate →'}
            </button>
          </form>

          {error && <div className="error-box">⚠️ {error}</div>}

          {roadmap && (
            <div className="roadmap-result">
              {roadmap.split('\n').filter(Boolean).map((line, i) => (
                <div className="roadmap-step" key={i}>{line}</div>
              ))}
            </div>
          )}

          {!roadmap && !loading && !error && (
            <p className="empty">Your personalized roadmap will show up here ✨</p>
          )}
        </div>
      </div>
    </div>
  );
}