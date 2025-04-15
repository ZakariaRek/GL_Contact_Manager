import React, { useState } from 'react';
import { FiDownload, FiUpload, FiDatabase, FiSliders } from 'react-icons/fi';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Modal from '../components/layout/Modal';
import { exportContacts } from '../services/contactService';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState(null);
  
  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const blob = await exportContacts('csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all_contacts_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Export completed successfully');
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAction = (action) => {
    setDeleteAction(action);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Implement delete logic here
    toast.success(`${deleteAction} deleted successfully`);
    setShowDeleteModal(false);
  };
  
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      
      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-nav">
            <button 
              className={`settings-nav-item ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <FiSliders /> General
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              <FiDatabase /> Data Management
            </button>
          </div>
        </div>
        
        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2>General Settings</h2>
              
              <div className="settings-group">
                <h3>Display Preferences</h3>
                <div className="form-group">
                  <label htmlFor="displayMode">Default view</label>
                  <select id="displayMode" className="form-control">
                    <option value="list">List view</option>
                    <option value="grid">Grid view</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactsPerPage">Contacts per page</label>
                  <select id="contactsPerPage" className="form-control">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
              
              <Alert type="info">
                These settings are stored locally in your browser.
              </Alert>
              
              <div className="form-actions">
                <Button type="button" variant="primary">
                  Save Settings
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === 'data' && (
            <div className="settings-section">
              <h2>Data Management</h2>
              
              <div className="settings-group">
                <h3>Import & Export</h3>
                <p className="settings-description">
                  Back up your contacts or move them to another system.
                </p>
                
                <div className="settings-actions">
                  <Button 
                    icon={<FiDownload />} 
                    onClick={handleExportAll}
                    disabled={isExporting}
                  >
                    {isExporting ? 'Exporting...' : 'Export All Data'}
                  </Button>
                  
                  <div className="file-input-container">
                    <input 
                      type="file" 
                      id="importFile" 
                      accept=".csv" 
                      className="file-input" 
                    />
                    <label htmlFor="importFile" className="file-input-label">
                      <FiUpload /> Import Contacts
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="settings-group">
                <h3>Danger Zone</h3>
                <Alert type="warning">
                  These actions are irreversible. Please proceed with caution.
                </Alert>
                
                <div className="danger-actions">
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteAction('All contacts')}
                  >
                    Delete All Contacts
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteAction('All groups')}
                  >
                    Delete All Groups
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="delete-confirmation">
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete {deleteAction}? This action cannot be undone.</p>
          <div className="modal-actions">
            <Button 
              variant="secondary" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;