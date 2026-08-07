import api from './axios';

export const getAllOpportunities = (filters = {}) =>
  api.get('/opportunities', { params: filters });

export const createOpportunity = (data) => api.post('/opportunities', data);

export const deleteOpportunity = (id) => api.delete(`/opportunities/${id}`);