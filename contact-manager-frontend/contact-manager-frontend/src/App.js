import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ContactProvider } from './context/ContactContext';
import { GroupProvider } from './context/GroupContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import Dashboard from './pages/Dashboard';
import ContactsPage from './pages/ContactsPage';
import GroupsPage from './pages/GroupsPage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';
import ContactForm from './components/contacts/ContactForm';
import ContactDetail from './components/contacts/ContactDetail';
import GroupForm from './components/groups/GroupForm';
import './styles/index.css';

function App() {
  return (
    <Router>
      <ContactProvider>
        <GroupProvider>
          <div className="app">
            <Toaster position="top-right" />
            <Header />
            <div className="app-container">
              <Sidebar />
              <MainContent>
                <Routes>
                  {/* Dashboard */}
                  <Route path="/" element={<Dashboard />} />
                  
                  {/* Contacts Routes */}
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/contacts/new" element={<ContactForm />} />
                  <Route path="/contacts/edit/:id" element={<ContactForm />} />
                  <Route path="/contacts/:id" element={<ContactDetail />} />
                  
                  {/* Groups Routes */}
                  <Route path="/groups" element={<GroupsPage />} />
                  <Route path="/groups/new" element={<GroupForm />} />
                  <Route path="/groups/edit/:id" element={<GroupForm />} />
                  
                  {/* Settings */}
                  <Route path="/settings" element={<SettingsPage />} />
                  
                  {/* Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainContent>
            </div>
          </div>
        </GroupProvider>
      </ContactProvider>
    </Router>
  );
}

export default App;