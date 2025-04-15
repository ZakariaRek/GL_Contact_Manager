import React from 'react';

const colors = [
  '#4285F4', // blue
  '#34A853', // green
  '#FBBC05', // yellow
  '#EA4335', // red
  '#8C44DB', // purple
  '#0F9D58', // dark green
  '#F06292', // pink
  '#FF7043', // orange
];

const Avatar = ({ name, src, size = 'medium', className = '' }) => {
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  const getRandomColor = (initials) => {
    if (!initials || initials === '?') return colors[0];
    
    // Use the sum of char codes to determine the color index
    const charCodeSum = initials.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };
  
  const initials = getInitials(name);
  const backgroundColor = getRandomColor(initials);
  
  const sizeClass = {
    small: 'avatar-sm',
    medium: 'avatar-md',
    large: 'avatar-lg',
  }[size] || 'avatar-md';
  
  if (src) {
    return (
      <div className={`avatar ${sizeClass} ${className}`}>
        <img src={src} alt={name || 'Avatar'} className="avatar-img" />
      </div>
    );
  }
  
  return (
    <div 
      className={`avatar ${sizeClass} ${className}`}
      style={{ backgroundColor }}
    >
      <span className="avatar-initials">{initials}</span>
    </div>
  );
};

export default Avatar;