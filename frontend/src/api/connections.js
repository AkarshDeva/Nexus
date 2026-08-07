import api from './axios';

export const sendConnectionRequest = (receiverId) =>
  api.post('/connections/request', { receiverId });

export const respondToRequest = (id, action) =>
  api.put(`/connections/${id}/respond`, { action });

export const getMyConnections = () => api.get('/connections');

export const getPendingRequests = () => api.get('/connections/pending');

export const getSentRequests = () => api.get('/connections/sent');