import React, { useContext, useState } from 'react';
import { ContactContext } from '../../context/ContactContext';
import { FiSearch, FiX } from 'react-icons/fi';

const ContactSearch = () => {
  const { searchTerm, setSearchTerm } = useContext(ContactContext);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   setSearchTerm(localSearchTerm);
  // };
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm.trim());
  };
  
  const clearSearch = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
  };
  
  return (
    <form onSubmit={handleSearch} className="search-form">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search contacts..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="search-input"
        />
        {localSearchTerm && (
          <button 
            type="button" 
            className="clear-search" 
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
        <button type="submit" className="search-button" aria-label="Search">
          <FiSearch />
        </button>
      </div>
    </form>
  );
};

export default ContactSearch;