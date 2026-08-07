import api from './axios';

export const sendMessage = (receiverId, content) =>
  api.post('/messages', { receiverId, content });

export const getConversation = (userId) => api.get(`/messages/${userId}`);

export const getConversationsList = () => api.get('/messages');

export const markMessagesAsRead = (userId) => api.put(`/messages/${userId}/mark-read`);