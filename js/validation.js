/**
 * Validation utilities for Blip Auth forms
 */

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const checkPasswordStrength = (password) => {
  let score = 0;
  let status = 'Weak';
  
  if (!password) return { score: 0, status: 'None' };
  
  // Length check
  if (password.length > 5) score += 1;
  if (password.length > 8) score += 1;
  
  // Contains lower and upper case
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  
  // Contains number
  if (/\d/.test(password)) score += 1;
  
  // Contains special char
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  if (score < 2) {
    status = 'Weak';
  } else if (score < 4) {
    status = 'Medium';
  } else {
    status = 'Strong';
  }
  
  return { score, status };
};

export const setInputError = (input, messageElement, message) => {
  input.classList.add('error');
  input.classList.remove('success');
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.classList.add('show');
  }
};

export const clearInputError = (input, messageElement) => {
  input.classList.remove('error');
  if (messageElement) {
    messageElement.classList.remove('show');
    messageElement.textContent = '';
  }
};

export const setInputSuccess = (input, messageElement) => {
  input.classList.remove('error');
  input.classList.add('success');
  if (messageElement) {
    messageElement.classList.remove('show');
  }
};
