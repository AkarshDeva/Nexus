import { useEffect, useState } from 'react';
import { getMyConnections, getPendingRequests, respondToRequest } from '../api/connections';
import Navbar from '../components/Navbar';

export default function Mentees() {
  const me = JSON.parse(localStorage.getItem('user') || 'null');
  const [mentees, setMentees] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [connRes, pendRes] = await Promise.all([getMyConnections(), getPendingRequests()]);
      setMentees(connRes.data.connections);
      setPending(pendRes.data.pending);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id, action) => {
    try {
      await respondToRequest(id, action);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const styles = `
    .mentees-page {
      min-height: 100vh;
      background: #FFF7E8;
      background-image: radial-gradient(circle, #14171A11 1.5px, transparent 1.5px);
      background-size: 22px 22px;
      font-family: 'Space Grotesk', sans-serif;
      padding-bottom: 60px;
    }
    .wrap { max-width: 760px; margin: 0 auto; padding: 40px 20px 0; }
    h1 { font-family: 'Archivo Black', sans-serif; font-size: 28px; color: #14171A; margin-bottom: 4px; }
    .sub { font-family: 'Caveat', cursive; font-size: 19px; color: #14171A; margin-bottom: 26px; }
    .stats-row { display: flex; gap: 16px; margin-bottom: 26px; }
    .stat-card { flex: 1; background: #fff; border: 4px solid #14171A; border-radius: 16px;
      padding: 18px; text-align: center; box-shadow: 6px 6px 0px #14171A; }
    .stat-num { font-family: 'Archivo Black', sans-serif; font-size: 28px; color: #14171A; }
    .stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #8A8D96; margin-top: 4px; }
    .panel { background: #fff; border: 4px solid #14171A; border-radius: 18px; box-shadow: 8px 8px 0px #14171A;
      padding: 26px; margin-bottom: 24px; }
    .panel h2 { font-family: 'Archivo Black', sans-serif; font-size: 16px; margin-bottom: 14px; color: #14171A; }
    .person-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0;
      border-bottom: 2px dashed #14171A22; }
    .person-row:last-child { border-bottom: none; }
    .p-left { display: flex; align-items: center; gap: 12px; }
    .p-avatar { width: 40px; height: 40px; border-radius: 50%; background: #F1FFDA; border: 2.5px solid #14171A;
      display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .person-info strong { display: block; font-size: 14px; color: #14171A; }
    .person-info span { font-size: 12px; color: #8A8D96; }
    .row-actions button { border: 2.5px solid #14171A; border-radius: 8px; padding: 6px 14px; font-size: 12px;
      font-weight: 700; cursor: pointer; margin-left: 8px; transition: transform .15s; }
    .row-actions button:hover { transform: translateY(-2px); }
    .accept-btn { background: #C6FF3D; }
    .reject-btn { background: #FFE3E3; }
    .empty { font-family: 'Caveat', cursive; font-size: 18px; color: #8A8D96; padding: 6px 0; }
  `;

  return (
    <div className="mentees-page">
      <style>{styles}</style>
      <Navbar />

      <div className="wrap">
        <h1>Your Mentees 🌱</h1>
        <p className="sub">the people you're helping grow</p>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">{mentees.length}</div>
            <div className="stat-label">Active Mentees</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{pending.length}</div>
            <div className="stat-label">New Requests</div>
          </div>
        </div>

        <div className="panel">
          <h2>📥 New mentee requests {pending.length > 0 && `(${pending.length})`}</h2>
          {loading ? (
            <p className="empty">Loading...</p>
          ) : pending.length === 0 ? (
            <p className="empty">No new requests right now — check back later!</p>
          ) : (
            pending.map((req) => (
              <div className="person-row" key={req.id}>
                <div className="p-left">
                  <div className="p-avatar">🎓</div>
                  <div className="person-info">
                    <strong>{req.sender.profile?.fullName || req.sender.email}</strong>
                    <span>wants you as a mentor</span>
                  </div>
                </div>
                <div className="row-actions">
                  <button className="accept-btn" onClick={() => handleRespond(req.id, 'ACCEPTED')}>Accept</button>
                  <button className="reject-btn" onClick={() => handleRespond(req.id, 'REJECTED')}>Decline</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <h2>🌱 Your mentees {mentees.length > 0 && `(${mentees.length})`}</h2>
          {loading ? (
            <p className="empty">Loading...</p>
          ) : mentees.length === 0 ? (
            <p className="empty">No mentees yet — accepted requests will show up here.</p>
          ) : (
            mentees.map((c) => {
              const other = c.senderId === me.id ? c.receiver : c.sender;
              return (
                <div className="person-row" key={c.id}>
                  <div className="p-left">
                    <div className="p-avatar">🎓</div>
                    <div className="person-info">
                      <strong>{other.profile?.fullName || other.email}</strong>
                      <span>{other.profile?.bio || 'No bio yet'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}