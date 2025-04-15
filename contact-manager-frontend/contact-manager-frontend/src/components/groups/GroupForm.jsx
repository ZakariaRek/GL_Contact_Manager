import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GroupContext } from '../../context/GroupContext';
import Button from '../common/Button';
import { validateGroup } from '../../utils/validation';

const initialState = {
  name: '',
  description: '',
  color: '#4285F4',
};

const GroupForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(id);

  const { getGroup, addGroup, editGroup, loading } = useContext(GroupContext);

  useEffect(() => {
    if (isEditMode) {
      const fetchGroup = async () => {
        const group = await getGroup(id);
        if (group) {
          setFormData({
            name: group.name || '',
            description: group.description || '',
            color: group.color || '#4285F4',
          });
        }
      };
      fetchGroup();
    }
  }, [id, isEditMode, getGroup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateGroup(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let success;
    if (isEditMode) {
      success = await editGroup(id, formData);
    } else {
      success = await addGroup(formData);
    }

    if (success) {
      navigate('/groups');
    }
  };

  return (
    <div className="group-form-container">
      <h2>{isEditMode ? 'Edit Group' : 'Create New Group'}</h2>
      <form onSubmit={handleSubmit} className="group-form">
        <div className="form-group">
          <label htmlFor="name">Group Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            required
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="color">Color</label>
          <div className="color-picker">
            <input
              type="color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className={errors.color ? 'error' : ''}
            />
            <span className="color-value">{formData.color}</span>
          </div>
          {errors.color && <div className="error-text">{errors.color}</div>}
        </div>
        
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={() => navigate('/groups')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Group' : 'Create Group')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GroupForm;