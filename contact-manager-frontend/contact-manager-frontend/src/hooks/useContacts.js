import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  getContacts, 
  getContactById, 
  createContact, 
  updateContact, 
  deleteContact 
} from '../services/contactService';

const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContacts();
      setContacts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);
  
  const fetchContactById = async (id) => {
    setLoading(true);
    try {
      const data = await getContactById(id);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load contact details');
      return null;
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
      setError(null);
      return newContact;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to add contact');
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
      setError(null);
      return updatedContact;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update contact');
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
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete contact');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    contacts,
    loading,
    error,
    fetchContacts,
    fetchContactById,
    addContact,
    editContact,
    removeContact
  };
};

export default useContacts;