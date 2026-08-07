import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { sendMessage, getConversation, getConversationsList, markMessagesAsRead } from '../api/messages';
import Navbar from '../components/Navbar';

export default function Messages() {
  const me = JSON.parse(localStorage.getItem('user') || 'null');
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [thread, setThread] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadConversations();
    if (location.state?.openUser) {
      openThread(location.state.openUser);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await getConversationsList();
      setConversations(res.data.conversations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openThread = async (partner) => {
    setActivePartner(partner);
    try {
      const res = await getConversation(partner.id);
      setThread(res.data.messages);
      await markMessagesAsRead(partner.id);
      loadConversations(); // refresh so the unread dot clears in the list
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activePartner) return;
    try {
      await sendMessage(activePartner.id, text.trim());
      setText('');
      const res = await getConversation(activePartner.id);
      setThread(res.data.messages);
      loadConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const styles = `
    .msg-page {
      min-height: 100vh;
      background: #FFF7E8;
      background-image: radial-gradient(circle, #14171A11 1.5px, transparent 1.5px);
      background-size: 22px 22px;
      font-family: 'Space Grotesk', sans-serif;
      padding-bottom: 60px;
    }
    .wrap { max-width: 900px; margin: 0 auto; padding: 40px 20px 0; }
    h1 { font-family: 'Archivo Black', sans-serif; font-size: 28px; color: #14171A; margin-bottom: 4px; }
    .sub { font-family: 'Caveat', cursive; font-size: 19px; color: #14171A; margin-bottom: 22px; }
    .layout { display: grid; grid-template-columns: 280px 1fr; gap: 20px; }
    @media (max-width: 720px) { .layout { grid-template-columns: 1fr; } }
    .panel { background: #fff; border: 4px solid #14171A; border-radius: 18px; box-shadow: 8px 8px 0px #14171A; overflow: hidden; }
    .list-panel { padding: 18px; }
    .list-panel h2 { font-family: 'Archivo Black', sans-serif; font-size: 14px; margin-bottom: 12px; }
    .convo-item { padding: 10px; border-radius: 10px; cursor: pointer; margin-bottom: 6px; transition: background .15s;
      position: relative; }
    .convo-item:hover, .convo-item.active { background: #FFF1D8; }
    .convo-item.unread { background: #FFE4EF; border: 2px solid #14171A; }
    .convo-top-row { display: flex; align-items: center; justify-content: space-between; }
    .convo-item strong { display: block; font-size: 13px; color: #14171A; }
    .convo-role { font-size: 10px; font-weight: 700; color: #8A8D96; text-transform: uppercase; letter-spacing: 0.03em; }
    .convo-item .preview { font-size: 11px; color: #8A8D96; display: block; margin-top: 2px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .unread-dot { width: 9px; height: 9px; border-radius: 50%; background: #FF3B7F; border: 2px solid #14171A; flex-shrink: 0; }
    .empty { font-family: 'Caveat', cursive; font-size: 16px; color: #8A8D96; }
    .chat-panel { display: flex; flex-direction: column; height: 520px; }
    .chat-header { padding: 16px 20px; border-bottom: 3px solid #14171A; background: #FFF1D8; }
    .chat-header strong { display: block; font-size: 15px; font-weight: 700; }
    .chat-header span { font-size: 11px; font-weight: 700; color: #8A8D96; text-transform: uppercase; letter-spacing: 0.03em; }
    .chat-body { flex: 1; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 10px; }
    .bubble { max-width: 70%; padding: 10px 14px; border-radius: 14px; border: 2.5px solid #14171A; font-size: 13px; }
    .bubble.mine { align-self: flex-end; background: #C6FF3D; }
    .bubble.theirs { align-self: flex-start; background: #FFF; }
    .chat-form { display: flex; gap: 8px; padding: 14px; border-top: 3px solid #14171A; }
    .chat-form input { flex: 1; padding: 10px 14px; border: 2.5px solid #14171A; border-radius: 10px;
      font-size: 13px; background: #FFF7E8; outline: none; }
    .chat-form button { background: #FF3B7F; color: #fff; border: 2.5px solid #14171A; border-radius: 10px;
      padding: 10px 18px; font-weight: 700; font-size: 13px; cursor: pointer; }
    .chat-placeholder { flex: 1; display: flex; align-items: center; justify-content: center;
      font-family: 'Caveat', cursive; font-size: 20px; color: #8A8D96; }
  `;

  return (
    <div className="msg-page">
      <style>{styles}</style>
      <Navbar />

      <div className="wrap">
        <h1>Messages</h1>
        <p className="sub">where the real conversations happen</p>

        <div className="layout">
          <div className="panel list-panel">
            <h2>Conversations</h2>
            {loading ? (
              <p className="empty">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="empty">No messages yet — click Message on someone's card in Discover to start!</p>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.partner.id}
                  className={`convo-item ${activePartner?.id === c.partner.id ? 'active' : ''} ${c.unread ? 'unread' : ''}`}
                  onClick={() => openThread(c.partner)}
                >
                  <div className="convo-top-row">
                    <div>
                      <strong>{c.partner.profile?.fullName || c.partner.email}</strong>
                      <span className="convo-role">{c.partner.role}</span>
                    </div>
                    {c.unread && <div className="unread-dot"></div>}
                  </div>
                  <span className="preview">{c.lastMessage}</span>
                </div>
              ))
            )}
          </div>

          <div className="panel chat-panel">
            {activePartner ? (
              <>
                <div className="chat-header">
                  <strong>{activePartner.profile?.fullName || activePartner.email}</strong>
                  <span>{activePartner.role}</span>
                </div>
                <div className="chat-body">
                  {thread.map((m) => (
                    <div key={m.id} className={`bubble ${m.senderId === me.id ? 'mine' : 'theirs'}`}>
                      {m.content}
                    </div>
                  ))}
                  <div ref={bottomRef}></div>
                </div>
                <form className="chat-form" onSubmit={handleSend}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button type="submit">Send →</button>
                </form>
              </>
            ) : (
              <div className="chat-placeholder">Pick a conversation to start chatting</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}