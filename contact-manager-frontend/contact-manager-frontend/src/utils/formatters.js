

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return '';
  }
};

export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Format according to French standard if it's a French number
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  } 
  // Format for international numbers
  else if (cleaned.length > 10) {
    return `+${cleaned.substring(0, cleaned.length - 9)} ${cleaned.substring(cleaned.length - 9)}`.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  }
  
  // Return as is if we can't format it
  return phoneNumber;
};
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  try {
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return null;
  }
};