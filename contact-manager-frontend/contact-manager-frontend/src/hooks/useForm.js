import { useState, useEffect } from 'react';

const useForm = (initialValues, validate, onSubmit, resetAfterSubmit = true) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form if initialValues change (like when editing vs creating)
  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  // Validate fields on change when they've been touched
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const touchedErrors = {};
      Object.keys(touched).forEach(field => {
        if (touched[field]) {
          const fieldErrors = validate({ [field]: values[field] });
          if (fieldErrors[field]) {
            touchedErrors[field] = fieldErrors[field];
          }
        }
      });
      setErrors(touchedErrors);
    }
  }, [values, touched, validate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const formErrors = validate(values);
    setErrors(formErrors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // If no errors, submit
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        if (resetAfterSubmit) {
          resetForm();
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    resetForm
  };
};

export default useForm;