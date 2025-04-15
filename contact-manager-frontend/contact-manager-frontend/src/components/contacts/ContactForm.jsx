import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContactContext } from '../../context/ContactContext';
import { GroupContext } from '../../context/GroupContext';
import Button from '../common/Button';
import GroupSelector from '../groups/GroupSelector';
import { validateContact } from '../../utils/validation';
import toast from 'react-hot-toast';
import './ContactForm.css'; // Add this import

const initialState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  address: '',
  birthDate: '',
  notes: '',
  groups: [],
};

const ContactForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const isEditMode = Boolean(id);

  const { getContact, addContact, editContact, loading } = useContext(ContactContext);
  const { groups } = useContext(GroupContext);

  useEffect(() => {
    if (isEditMode) {
      const fetchContact = async () => {
        const contact = await getContact(id);
        if (contact) {
          setFormData({
            ...contact,
            birthDate: contact.birthDate ? new Date(contact.birthDate).toISOString().slice(0, 10) : '',
            groups: contact.groups || [],
          });
          if (contact.photo) {
            setPhotoPreview(contact.photo);
          }
        }
      };
      fetchContact();
    }
  }, [id, isEditMode, getContact]);

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

  const handleGroupChange = (selectedGroups) => {
    setFormData(prev => ({
      ...prev,
      groups: selectedGroups
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateContact(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    // Create form data to handle file upload
    const contactFormData = new FormData();
    
    // Add all form fields to the FormData
    Object.keys(formData).forEach(key => {
      if (key === 'birthDate' && formData[key]) {
        // Format date for the API
        contactFormData.append(key, new Date(formData[key]).toISOString());
      } else if (key === 'groups') {
        // Handle groups array properly
        if (Array.isArray(formData.groups) && formData.groups.length > 0) {
          formData.groups.forEach(groupId => {
            contactFormData.append('groups[]', groupId);
          });
        }
      } else if (formData[key] !== null && formData[key] !== undefined) {
        contactFormData.append(key, formData[key]);
      }
    });
  
    if (photoFile) {
      contactFormData.append('photo', photoFile);
    }
  
    let success;
    try {
      if (isEditMode) {
        success = await editContact(id, contactFormData);
      } else {
        success = await addContact(contactFormData);
      }
  
      if (success) {
        toast.success(isEditMode ? 'Contact mis à jour avec succès' : 'Contact ajouté avec succès');
        navigate('/contacts');
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Une erreur est survenue lors de l\'enregistrement du contact');
    }
  };

  return (
    <div className="contact-form-container">
      <h2>{isEditMode ? 'Edit Contact' : 'Add New Contact'}</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
              required
            />
            {errors.firstName && <div className="error-text">{errors.firstName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
              required
            />
            {errors.lastName && <div className="error-text">{errors.lastName}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number*</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={errors.phoneNumber ? 'error' : ''}
              required
            />
            {errors.phoneNumber && <div className="error-text">{errors.phoneNumber}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="birthDate">Birth Date</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="groups">Groups</label>
            <GroupSelector 
              groups={groups} 
              selectedGroupIds={formData.groups} 
              onChange={handleGroupChange}
              multiple={true}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="photo">Photo</label>
          <div className="photo-upload-container">
            {photoPreview && (
              <div className="photo-preview">
                <img src={photoPreview} alt="Contact" />
              </div>
            )}
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handlePhotoChange}
              accept="image/*"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={() => navigate('/contacts')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Contact' : 'Add Contact')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;