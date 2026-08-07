import api from './axios';

export const getUnreadMessageCount = () => api.get('/messages/unread-count');
export const getPendingConnectionCount = () => api.get('/connections/pending-count');