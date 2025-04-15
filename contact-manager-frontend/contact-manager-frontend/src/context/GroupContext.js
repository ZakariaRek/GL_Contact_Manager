import React, { createContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getGroups, getGroupById, createGroup, updateGroup, deleteGroup } from '../services/groupService';

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  // Initialize with an empty array, not null or undefined
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGroups();
      // Ensure data is an array before setting it
      const groupsArray = Array.isArray(data) ? data : 
                         (data && data.data && Array.isArray(data.data)) ? data.data : [];
      
      setGroups(groupsArray);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load groups');
      // Set empty array on error
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const getGroup = async (id) => {
    setLoading(true);
    try {
      const data = await getGroupById(id);
      setCurrentGroup(data);
      return data;
    } catch (err) {
      toast.error('Failed to get group details');
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addGroup = async (groupData) => {
    setLoading(true);
    try {
      const newGroup = await createGroup(groupData);
      setGroups(prev => Array.isArray(prev) ? [...prev, newGroup] : [newGroup]);
      toast.success('Group added successfully');
      return newGroup;
    } catch (err) {
      toast.error('Failed to add group');
      setError(err.message);
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
        Array.isArray(prev) 
          ? prev.map(group => (group._id === id ? updatedGroup : group))
          : [updatedGroup]
      );
      toast.success('Group updated successfully');
      return updatedGroup;
    } catch (err) {
      toast.error('Failed to update group');
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeGroup = async (id) => {
    setLoading(true);
    try {
      await deleteGroup(id);
      setGroups(prev => 
        Array.isArray(prev) 
          ? prev.filter(group => group._id !== id)
          : []
      );
      toast.success('Group deleted successfully');
      return true;
    } catch (err) {
      toast.error('Failed to delete group');
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    groups,
    loading,
    error,
    currentGroup,
    getGroup,
    addGroup,
    editGroup,
    removeGroup,
    fetchGroups,
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
};