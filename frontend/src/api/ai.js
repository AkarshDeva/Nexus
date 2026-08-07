import api from './axios';

export const getProfileFeedback = () => api.post('/ai/profile-feedback');
export const matchOpportunity = (id) => api.post(`/ai/match-opportunity/${id}`);
export const generateRoadmap = (targetRole) => api.post('/ai/roadmap', { targetRole });
export const getInterviewPrep = (targetRole) => api.post('/ai/interview-prep', { targetRole });
export const getMentorMatches = () => api.post('/ai/mentor-match');
export const getProjectIdeas = () => api.post('/ai/project-ideas');