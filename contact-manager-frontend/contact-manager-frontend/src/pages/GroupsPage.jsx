import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import GroupList from '../components/groups/GroupList';
import GroupForm from '../components/groups/GroupForm';
import { FiPlus } from 'react-icons/fi';

const GroupsPage = () => {
  const location = useLocation();
  const isMainGroupsPage = location.pathname === '/groups';

  return (
    <div className="groups-page">
      <Routes>
        <Route path="/" element={
          <>
            <div className="page-header">
              <h1>Groups</h1>
              <div className="page-actions">
                <Link to="/groups/new" className="btn btn-primary">
                  <FiPlus /> Add Group
                </Link>
              </div>
            </div>
            <GroupList />
          </>
        } />
        <Route path="/new" element={<GroupForm />} />
        <Route path="/edit/:id" element={<GroupForm />} />
      </Routes>
    </div>
  );
};

export default GroupsPage;