import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, login } from '../api/auth';
import './Auth.css';

const ROLES = [
  { value: 'STUDENT', label: 'Student', emoji: '🎓' },
  { value: 'MENTOR', label: 'Mentor', emoji: '🧑‍🏫' },
  { value: 'RECRUITER', label: 'Recruiter', emoji: '💼' },
  { value: 'ALUMNI', label: 'Alumni', emoji: '🏆' },
  { value: 'STARTUP', label: 'Startup', emoji: '🚀' },
];

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = mode === 'signup' ? await signup(form) : await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
   } catch (err) {
  const data = err.response?.data;
  const msg = data?.error || data?.errors?.[0]?.msg || 'Something went wrong';
  setError(msg);
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      <div className="card-wrap">
        <div className="tape"></div>
        <div className="auth-card">
          <div className="badge">
            {mode === 'login' ? 'welcome\nback' : 'new\nhere?'}
          </div>

          <div className="logo">
            <span className="emoji">🚀</span>Nexus
          </div>

          <h1>
            {mode === 'login' ? (
              <>Good to<br /><span className="highlight">see you</span> 👋</>
            ) : (
              <>Let's get you<br /><span className="highlight">plugged in</span> ✨</>
            )}
          </h1>
          <p className="sub">
            {mode === 'login' ? 'your network missed you →' : 'your career people are waiting →'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <label>I am a...</label>
                <div className="roles">
                  {ROLES.map((r) => (
                    <div
                      key={r.value}
                      className={`role-chip ${form.role === r.value ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, role: r.value })}
                    >
                      <span className="e">{r.emoji}</span>
                      {r.label}
                    </div>
                  ))}
                </div>

                <label>Full name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Riya Sharma"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && <div className="auth-error">⚠️ {error}</div>}

            <button type="submit" className="submit" disabled={loading}>
              {loading ? 'Hang tight...' : mode === 'login' ? 'Sign in →' : 'Create my account →'}
            </button>
          </form>

          <p className="toggle">
            {mode === 'login' ? "New here? " : 'Already in? '}
            <span onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? 'Create an account' : 'Sign in here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}