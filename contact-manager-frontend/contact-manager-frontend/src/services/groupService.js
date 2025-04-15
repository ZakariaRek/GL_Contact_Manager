import api from './api';

export const getGroups = () => api.get('/groups');

export const getGroupById = (id) => api.get(`/groups/${id}`);

export const createGroup = (groupData) => api.post('/groups', groupData);

export const updateGroup = (id, groupData) => api.put(`/groups/${id}`, groupData);

export const deleteGroup = (id) => api.delete(`/groups/${id}`);

export const getGroupContacts = (id) => api.get(`/groups/${id}/contacts`);