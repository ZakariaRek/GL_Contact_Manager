import React from 'react';

const GroupSelector = ({ 
  groups = [], // Default to empty array
  selectedGroupId, 
  selectedGroupIds = [], // Default to empty array
  onChange, 
  multiple = false,
  includeAllOption = false 
}) => {
  // Ensure groups is always an array
  const safeGroups = Array.isArray(groups) ? groups : [];
  
  if (multiple) {
    // Multiple selection mode (used in forms)
    return (
      <div className="group-selector multiple">
        {safeGroups.map(group => (
          <div key={group._id} className="group-checkbox-item">
            <input
              type="checkbox"
              id={`group-${group._id}`}
              checked={selectedGroupIds && selectedGroupIds.includes(group._id)}
              onChange={() => {
                const newSelection = selectedGroupIds ? [...selectedGroupIds] : [];
                if (newSelection.includes(group._id)) {
                  onChange(newSelection.filter(id => id !== group._id));
                } else {
                  onChange([...newSelection, group._id]);
                }
              }}
            />
            <label htmlFor={`group-${group._id}`} className="group-checkbox-label">
              <span 
                className="group-color-dot" 
                style={{ backgroundColor: group.color || '#e0e0e0' }}
              />
              {group.name}
            </label>
          </div>
        ))}
      </div>
    );
  }
  
  // Single selection mode (used in filters)
  return (
    <div className="group-selector single">
      <select
        value={selectedGroupId || ''}
        onChange={(e) => onChange(e.target.value)}
        className="group-select"
      >
        {includeAllOption && (
          <option value="">All Groups</option>
        )}
        {safeGroups.map(group => (
          <option key={group._id} value={group._id}>
            {group.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GroupSelector;