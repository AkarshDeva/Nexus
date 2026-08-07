import api from './axios';

export const getAllUsers = (role) => api.get('/users', { params: role ? { role } : {} });