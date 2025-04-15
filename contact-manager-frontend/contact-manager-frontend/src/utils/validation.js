export const validateContact = (contact) => {
  const errors = {};
  
  // Required fields validation
  if (!contact.firstName || contact.firstName.trim() === '') {
    errors.firstName = 'Le prénom est requis';
  }
  
  if (!contact.lastName || contact.lastName.trim() === '') {
    errors.lastName = 'Le nom est requis';
  }
  
  if (!contact.phoneNumber || contact.phoneNumber.trim() === '') {
    errors.phoneNumber = 'Le numéro de téléphone est requis';
  }
  
  // Email validation with same regex as backend
  if (contact.email && contact.email.trim() !== '') {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(contact.email)) {
      errors.email = 'Veuillez fournir une adresse email valide';
    }
  }
  
  // Date validation for birthDate
  if (contact.birthDate && isNaN(new Date(contact.birthDate).getTime())) {
    errors.birthDate = 'Format de date invalide';
  }
  
  return errors;
};

export const validateGroup = (group) => {
  const errors = {};
  
  // Required name field validation
  if (!group.name || group.name.trim() === '') {
    errors.name = 'Le nom du groupe est requis';
  }
  
  // Color field validation (if provided)
  if (group.color && !/^#([0-9A-F]{6})$/i.test(group.color)) {
    errors.color = 'La couleur doit être au format hexadécimal (#RRGGBB)';
  }
  
  return errors;
};