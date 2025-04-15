import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { ContactContext } from '../../context/ContactContext';
import { importContacts, exportContacts } from '../../services/contactService';
import Button from '../common/Button';
import { FiUpload, FiDownload } from 'react-icons/fi';

const ContactImportExport = () => {
  const { fetchContacts } = useContext(ContactContext);
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleFileChange = (e) => {
    setImportFile(e.target.files[0]);
  };
  
  const handleImport = async (e) => {
    e.preventDefault();
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', importFile);
    
    setIsImporting(true);
    try {
      const result = await importContacts(formData);
      toast.success(`Successfully imported ${result.imported} contacts`);
      fetchContacts();
      setImportFile(null);
      // Reset file input
      e.target.reset();
    } catch (error) {
      toast.error(`Import failed: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleExport = async (format = 'csv') => {
    setIsExporting(true);
    try {
      const blob = await exportContacts(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts_export_${new Date().toISOString().slice(0, 10)}.${format}`;
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
  
  return (
    <div className="import-export-container">
      <div className="import-section">
        <h3>Import Contacts</h3>
        <form onSubmit={handleImport} className="import-form">
          <div className="file-input-container">
            <input 
              type="file" 
              id="importFile" 
              onChange={handleFileChange} 
              accept=".csv"
              className="file-input"
            />
            <label htmlFor="importFile" className="file-input-label">
              {importFile ? importFile.name : 'Choose CSV file'}
            </label>
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            icon={<FiUpload />} 
            disabled={!importFile || isImporting}
          >
            {isImporting ? 'Importing...' : 'Import'}
          </Button>
        </form>
        <p className="helper-text">
          Supported format: CSV with columns: firstName, lastName, email, phoneNumber, address, notes
        </p>
      </div>
      
      <div className="export-section">
        <h3>Export Contacts</h3>
        <Button 
          onClick={() => handleExport('csv')} 
          variant="secondary" 
          icon={<FiDownload />} 
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export as CSV'}
        </Button>
        <p className="helper-text">
          Export all your contacts to a CSV file that you can use in other applications
        </p>
      </div>
    </div>
  );
};

export default ContactImportExport;