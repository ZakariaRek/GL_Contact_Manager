import React, { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import ContactList from '../components/contacts/ContactList';
import ContactForm from '../components/contacts/ContactForm';
import ContactDetail from '../components/contacts/ContactDetail';
import ContactImportExport from '../components/contacts/ContactImportExport';
import Button from '../components/common/Button';
import { FiPlus, FiDownload, FiUpload } from 'react-icons/fi';

const ContactsPage = () => {
  const location = useLocation();
  const [showImportExport, setShowImportExport] = useState(false);
  
  // Only show main contacts page at /contacts path
  const isMainContactsPage = location.pathname === '/contacts';

  return (
    <div className="contacts-page">
      <Routes>
        <Route path="/" element={
          <>
            <div className="page-header">
              <h1>Contacts</h1>
              <div className="page-actions">
                <Button 
                  onClick={() => setShowImportExport(!showImportExport)}
                  variant="secondary"
                  icon={showImportExport ? <FiUpload /> : <FiDownload />}
                >
                  {showImportExport ? 'Hide Import/Export' : 'Import/Export'}
                </Button>
                <Link to="/contacts/new" className="btn btn-primary">
                  <FiPlus /> Add Contact
                </Link>
              </div>
            </div>
            
            {showImportExport && <ContactImportExport />}
            <ContactList />
          </>
        } />
        <Route path="/new" element={<ContactForm />} />
        <Route path="/edit/:id" element={<ContactForm />} />
        <Route path="/:id" element={<ContactDetail />} />
      </Routes>
    </div>
  );
};

export default ContactsPage;