import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { respondToRequest, getMyConnections, getPendingRequests, getSentRequests } from '../api/connections';
import Navbar from '../components/Navbar';

export default function Connections() {
  const navigate = useNavigate();
  const me = JSON.parse(localStorage.getItem('user') || 'null');
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [sent, setSent] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [connRes, pendRes, sentRes] = await Promise.all([
        getMyConnections(),
        getPendingRequests(),
        getSentRequests(),
      ]);
      setConnections(connRes.data.connections);
      setPending(pendRes.data.pending);
      setSent(sentRes.data.sent);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id, action) => {
    try {
      await respondToRequest(id, action);
      loadAll();
    } catch (err) {
      setMessage('⚠️ ' + (err.response?.data?.error || 'Failed to respond'));
    }
  };

  const styles = `
    .conn-page {
      min-height: 100vh;
      background: #FFF7E8;
      background-image: radial-gradient(circle, #14171A11 1.5px, transparent 1.5px);
      background-size: 22px 22px;
      font-family: 'Space Grotesk', sans-serif;
      padding-bottom: 60px;
    }
    .wrap { max-width: 720px; margin: 0 auto; padding: 40px 20px 0; }
    h1 { font-family: 'Archivo Black', sans-serif; font-size: 28px; color: #14171A; margin-bottom: 4px; }
    .sub { font-family: 'Caveat', cursive; font-size: 19px; color: #14171A; margin-bottom: 26px; }
    .panel { background: #fff; border: 4px solid #14171A; border-radius: 18px; box-shadow: 8px 8px 0px #14171A;
      padding: 26px 26px; margin-bottom: 26px; }
    .panel h2 { font-family: 'Archivo Black', sans-serif; font-size: 16px; margin-bottom: 14px; color: #14171A; }
    .msg { margin-top: 12px; font-size: 13px; font-weight: 600; }
    .person-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0;
      border-bottom: 2px dashed #14171A22; }
    .person-row:last-child { border-bottom: none; }
    .person-info strong { display: block; font-size: 14px; color: #14171A; }
    .person-info span { font-size: 12px; color: #8A8D96; }
    .row-actions { display: flex; align-items: center; gap: 8px; }
    .row-actions button { border: 2.5px solid #14171A; border-radius: 8px; padding: 6px 14px; font-size: 12px;
      font-weight: 700; cursor: pointer; transition: transform .15s; }
    .row-actions button:hover { transform: translateY(-2px); }
    .accept-btn { background: #C6FF3D; }
    .reject-btn { background: #FFE3E3; }
    .msg-btn { background: #E4EBFF; border: 2px solid #14171A; border-radius: 8px; padding: 6px 12px;
      font-size: 12px; font-weight: 700; cursor: pointer; }
    .waiting-tag { background: #FFF1D8; border: 2px solid #14171A; border-radius: 100px; padding: 4px 12px;
      font-size: 11px; font-weight: 700; color: #14171A; }
    .empty { font-family: 'Caveat', cursive; font-size: 18px; color: #8A8D96; padding: 6px 0; }
    .hint-panel { background: #E4EBFF; border: 3px solid #14171A; border-radius: 14px; padding: 16px 20px;
      margin-bottom: 24px; font-size: 13px; }
    .hint-panel a { color: #2B5AF0; font-weight: 700; cursor: pointer; text-decoration: underline; }
  `;

  return (
    <div className="conn-page">
      <style>{styles}</style>
      <Navbar />

      <div className="wrap">
        <h1>Your People</h1>
        <p className="sub">grow your network, one connection at a time</p>

        <div className="hint-panel">
          Want to connect with someone new? Head to{' '}
          <a onClick={() => navigate('/discover')}>Discover</a> and hit Connect on their card.
        </div>

        {message && <div className="msg">{message}</div>}

        <div className="panel">
          <h2>Pending requests {pending.length > 0 && `(${pending.length})`}</h2>
          {loading ? (
            <p className="empty">Loading...</p>
          ) : pending.length === 0 ? (
            <p className="empty">Nothing here yet — check back later!</p>
          ) : (
            pending.map((req) => (
              <div className="person-row" key={req.id}>
                <div className="person-info">
                  <strong>{req.sender.profile?.fullName || req.sender.email}</strong>
                  <span>{req.sender.role}</span>
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
          <h2>Requests you've sent {sent.length > 0 && `(${sent.length})`}</h2>
          {loading ? (
            <p className="empty">Loading...</p>
          ) : sent.length === 0 ? (
            <p className="empty">You haven't sent any pending requests.</p>
          ) : (
            sent.map((req) => (
              <div className="person-row" key={req.id}>
                <div className="person-info">
                  <strong>{req.receiver.profile?.fullName || req.receiver.email}</strong>
                  <span>{req.receiver.role}</span>
                </div>
                <span className="waiting-tag">Waiting for response</span>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <h2>Your connections {connections.length > 0 && `(${connections.length})`}</h2>
          {loading ? (
            <p className="empty">Loading...</p>
          ) : connections.length === 0 ? (
            <p className="empty">No connections yet — go find people in Discover!</p>
          ) : (
            connections.map((c) => {
              const other = c.senderId === me.id ? c.receiver : c.sender;
              return (
                <div className="person-row" key={c.id}>
                  <div className="person-info">
                    <strong>{other.profile?.fullName || other.email}</strong>
                    <span>{other.role}</span>
                  </div>
                  <button
                    className="msg-btn"
                    onClick={() => navigate('/messages', { state: { openUser: other } })}
                  >
                    Message
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}