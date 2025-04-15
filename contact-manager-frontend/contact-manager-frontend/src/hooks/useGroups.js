import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  getGroups, 
  getGroupById, 
  createGroup, 
  updateGroup, 
  deleteGroup 
} from '../services/groupService';

const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGroups();
      setGroups(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);
  
  const fetchGroupById = async (id) => {
    setLoading(true);
    try {
      const data = await getGroupById(id);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load group details');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const addGroup = async (groupData) => {
    setLoading(true);
    try {
      const newGroup = await createGroup(groupData);
      setGroups(prev => [...prev, newGroup]);
      toast.success('Group added successfully');
      setError(null);
      return newGroup;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to add group');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const editGroup = async (id, groupData) => {
    setLoading(true);
    try {
      const updatedGroup = await updateGroup(id, groupData);
      setGroups(prev => 
        prev.map(group => (group._id === id ? updatedGroup : group))
      );
      toast.success('Group updated successfully');
      setError(null);
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update group');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const removeGroup = async (id) => {
    setLoading(true);
    try {
      await deleteGroup(id);
      setGroups(prev => prev.filter(group => group._id !== id));
      toast.success('Group deleted successfully');
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete group');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    groups,
    loading,
    error,
    fetchGroups,
    fetchGroupById,
    addGroup,
    editGroup,
    removeGroup
  };
};

export default useGroups;