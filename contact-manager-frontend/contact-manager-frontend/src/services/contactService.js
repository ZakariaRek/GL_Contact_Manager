import api from './api';

export const getContacts = () => api.get('/contacts');

export const getContactById = async (id) => {
  try {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch contact');
  }
};

export const createContact = (contactData) => {
  // If contactData is a FormData object, we can send it directly
  if (contactData instanceof FormData) {
    return api.post('/contacts', contactData);
  }
  
  // Otherwise, format the data
  const formattedData = { ...contactData };
  
  // Format birthDate if it exists
  if (formattedData.birthDate) {
    formattedData.birthDate = new Date(formattedData.birthDate).toISOString();
  }
  
  return api.post('/contacts', formattedData);
};
export const updateContact = (id, contactData) => {
  // If contactData is a FormData object, we can send it directly
  if (contactData instanceof FormData) {
    return api.put(`/contacts/${id}`, contactData);
  }
  
  // Otherwise, format the data
  const formattedData = { ...contactData };
  
  // Format birthDate if it exists
  if (formattedData.birthDate) {
    formattedData.birthDate = new Date(formattedData.birthDate).toISOString();
  }
  
  return api.put(`/contacts/${id}`, formattedData);
};
export const deleteContact = (id) => api.delete(`/contacts/${id}`);

export const addContactToGroup = (contactId, groupId) => 
  api.put(`/contacts/${contactId}/groups/${groupId}`);

export const removeContactFromGroup = (contactId, groupId) => 
  api.delete(`/contacts/${contactId}/groups/${groupId}`);

export const importContacts = (formData) => {
  return api.post('/contacts/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const exportContacts = (format = 'csv') => api.get(`/contacts/export?format=${format}`, { 
  responseType: 'blob' 
});