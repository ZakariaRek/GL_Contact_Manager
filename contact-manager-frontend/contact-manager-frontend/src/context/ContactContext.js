import React, { createContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contactService';
import api from '../services/api';

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentContact, setCurrentContact] = useState(null);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContacts();
      // Ensure data is an array before setting it
      const contactsArray = Array.isArray(data) ? data : 
                           (data && data.data && Array.isArray(data.data)) ? data.data : [];
      
      setContacts(contactsArray);
      setFilteredContacts(contactsArray);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load contacts');
      // Set empty arrays on error
      setContacts([]);
      setFilteredContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter(
        contact =>
          contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.phoneNumber.includes(searchTerm)
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchTerm, contacts]);

  const getContact = async (id) => {
    setLoading(true);
    try {
      const data = await getContactById(id); // Use the imported service function
      if (data) {
        setCurrentContact(data);
        return data;
      }
      throw new Error('Contact not found');
    } catch (error) {
      setError(error.message);
      toast.error('Failed to load contact details');
      return null;
    } finally {
      setLoading(false);
    }
  };
  const searchContacts = async (searchTerm) => {
    setLoading(true);
    try {
      const data = await api.get(`/contacts/search?term=${encodeURIComponent(searchTerm)}`);
      const searchResults = Array.isArray(data) ? data : [];
      setFilteredContacts(searchResults);
      setError(null);
      return searchResults;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to search contacts');
      setFilteredContacts([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData) => {
    setLoading(true);
    try {
      const newContact = await createContact(contactData);
      setContacts(prev => [...prev, newContact]);
      toast.success('Contact added successfully');
      return newContact;
    } catch (err) {
      toast.error('Failed to add contact');
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editContact = async (id, contactData) => {
    setLoading(true);
    try {
      const updatedContact = await updateContact(id, contactData);
      setContacts(prev =>
        prev.map(contact => (contact._id === id ? updatedContact : contact))
      );
      toast.success('Contact updated successfully');
      return updatedContact;
    } catch (err) {
      toast.error('Failed to update contact');
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeContact = async (id) => {
    setLoading(true);
    try {
      await deleteContact(id);
      setContacts(prev => prev.filter(contact => contact._id !== id));
      toast.success('Contact deleted successfully');
      return true;
    } catch (err) {
      toast.error('Failed to delete contact');
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  
  const filterContactsByGroup = (groupId) => {
    if (!groupId) {
      setFilteredContacts(contacts || []);
      return;
    }
    
    if (!Array.isArray(contacts)) {
      setFilteredContacts([]);
      return;
    }
    
    const filtered = contacts.filter(contact => 
      contact.groups && contact.groups.includes(groupId)
    );
    setFilteredContacts(filtered);
  };
  const value = {
    contacts,
    filteredContacts,
    loading,
    error,
    currentContact,
    searchTerm,
    setSearchTerm,
    getContact,
    addContact,
    editContact,
    removeContact,
    fetchContacts,
    filterContactsByGroup,
  };

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
};