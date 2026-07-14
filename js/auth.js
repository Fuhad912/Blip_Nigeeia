import { isValidEmail, checkPasswordStrength, setInputError, clearInputError, setInputSuccess } from './validation.js';
import { supabaseAuth } from './supabase.js';
import { initPasswordToggles, showSuccessOverlay } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI features
  initPasswordToggles();

  // Handle Page Transition Loader
  const transition = document.getElementById('pageTransition');
  if (transition) {
    setTimeout(() => {
      transition.classList.add('loaded');
    }, 400); // Small delay to let fonts/styles load
  }

  // --- LOGIN FORM ---
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Email
      if (!isValidEmail(emailInput.value)) {
        setInputError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearInputError(emailInput, emailError);
      }

      // Validate Password
      if (passwordInput.value.length < 6) {
        setInputError(passwordInput, passwordError, 'Password must be at least 6 characters.');
        isValid = false;
      } else {
        clearInputError(passwordInput, passwordError);
      }

      if (!isValid) return;

      // Submit
      submitBtn.classList.add('loading');
      
      const { error, user } = await supabaseAuth.signIn(emailInput.value, passwordInput.value);
      
      submitBtn.classList.remove('loading');

      if (error) {
        setInputError(passwordInput, passwordError, error.message);
      } else {
        showSuccessOverlay('Welcome Back!', 'Taking you to your dashboard...');
      }
    });
  }

  // --- SIGN UP FORM ---
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const termsCheck = document.getElementById('terms');
    
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmError = document.getElementById('confirmError');
    const termsError = document.getElementById('termsError');
    
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const submitBtn = signupForm.querySelector('button[type="submit"]');

    // Live password strength
    passwordInput.addEventListener('input', (e) => {
      const { score, status } = checkPasswordStrength(e.target.value);
      
      if (score === 0) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = 'rgba(var(--rgb-text), 0.15)';
      } else if (status === 'Weak') {
        strengthBar.style.width = '33%';
        strengthBar.style.backgroundColor = 'var(--color-error)';
      } else if (status === 'Medium') {
        strengthBar.style.width = '66%';
        strengthBar.style.backgroundColor = 'var(--color-cta)';
      } else {
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = 'var(--color-success)';
      }
      
      strengthText.textContent = status === 'None' ? '' : status;
    });

    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      if (!nameInput.value.trim()) {
        setInputError(nameInput, nameError, 'Full name is required.');
        isValid = false;
      } else {
        clearInputError(nameInput, nameError);
      }

      if (!isValidEmail(emailInput.value)) {
        setInputError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearInputError(emailInput, emailError);
      }

      if (passwordInput.value.length < 6) {
        setInputError(passwordInput, passwordError, 'Password must be at least 6 characters.');
        isValid = false;
      } else {
        clearInputError(passwordInput, passwordError);
      }

      if (passwordInput.value !== confirmInput.value) {
        setInputError(confirmInput, confirmError, 'Passwords do not match.');
        isValid = false;
      } else {
        clearInputError(confirmInput, confirmError);
      }

      if (!termsCheck.checked) {
        termsError.textContent = 'You must agree to the terms.';
        termsError.classList.add('show');
        isValid = false;
      } else {
        termsError.classList.remove('show');
      }

      if (!isValid) return;

      submitBtn.classList.add('loading');
      const { error, user } = await supabaseAuth.signUp(nameInput.value, emailInput.value, passwordInput.value);
      submitBtn.classList.remove('loading');

      if (error) {
        setInputError(emailInput, emailError, error.message);
      } else {
        // Show OTP Modal instead of immediate success
        const otpModal = document.getElementById('otpModal');
        const otpEmailDisplay = document.getElementById('otpEmailDisplay');
        if (otpModal && otpEmailDisplay) {
          otpEmailDisplay.textContent = emailInput.value;
          otpModal.classList.add('active');
          initOtpLogic(emailInput.value);
        } else {
          showSuccessOverlay('Account Created!', 'Let\'s get you set up...');
        }
      }
    });
  }

  // --- OTP LOGIC ---
  function initOtpLogic(email) {
    const otpInputs = document.querySelectorAll('.otp-input');
    const otpForm = document.getElementById('otpForm');
    const otpError = document.getElementById('otpError');
    const resendBtn = document.getElementById('resendOtpBtn');
    
    // Auto-advance inputs
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
    });

    // Handle verification
    if (otpForm) {
      otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let token = '';
        otpInputs.forEach(input => token += input.value);
        
        if (token.length !== 6) {
          otpError.textContent = 'Please enter all 6 digits.';
          return;
        }
        
        otpError.textContent = '';
        const submitBtn = otpForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        
        const { error, session } = await supabaseAuth.verifyOtp(email, token, 'signup');
        submitBtn.classList.remove('loading');
        
        if (error) {
          otpError.textContent = error.message;
          otpInputs.forEach(input => input.classList.add('error'));
        } else {
          document.getElementById('otpModal').classList.remove('active');
          showSuccessOverlay('Verified!', 'Redirecting to your dashboard...');
        }
      });
    }

    // Handle resend
    if (resendBtn) {
      resendBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        resendBtn.disabled = true;
        const originalText = resendBtn.textContent;
        resendBtn.textContent = 'Sending...';
        
        const { error } = await supabaseAuth.resendOtp(email, 'signup');
        
        if (error) {
          otpError.textContent = error.message;
          resendBtn.disabled = false;
          resendBtn.textContent = originalText;
        } else {
          resendBtn.textContent = 'Sent!';
          setTimeout(() => {
            resendBtn.disabled = false;
            resendBtn.textContent = originalText;
          }, 3000);
        }
      });
    }
  }

  // --- FORGOT PASSWORD FORM ---
  const forgotForm = document.getElementById('forgotForm');
  if (forgotForm) {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const submitBtn = forgotForm.querySelector('button[type="submit"]');

    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!isValidEmail(emailInput.value)) {
        setInputError(emailInput, emailError, 'Please enter a valid email address.');
        return;
      }
      clearInputError(emailInput, emailError);

      submitBtn.classList.add('loading');
      const { error, message } = await supabaseAuth.resetPassword(emailInput.value);
      submitBtn.classList.remove('loading');

      if (error) {
        setInputError(emailInput, emailError, error.message);
      } else {
        showSuccessOverlay('Link Sent!', 'Check your email for reset instructions.');
      }
    });
  }

  // --- GOOGLE AUTH BUTTONS ---
  const googleBtns = document.querySelectorAll('.btn-google');
  googleBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const currentText = btn.innerHTML;
      btn.innerHTML = '<span class="loader-spinner"></span> Connecting...';
      btn.disabled = true;
      
      const { error } = await supabaseAuth.signInWithGoogle();
      
      if (error) {
        btn.innerHTML = currentText;
        btn.disabled = false;
        alert(error.message);
      }
    });
  });

  // --- UPDATE PASSWORD FORM ---
  const updatePasswordForm = document.getElementById('updatePasswordForm');
  if (updatePasswordForm) {
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    const newPasswordError = document.getElementById('newPasswordError');
    const confirmNewPasswordError = document.getElementById('confirmNewPasswordError');
    const updateStrengthBar = document.getElementById('updateStrengthBar');
    const updateStrengthText = document.getElementById('updateStrengthText');

    newPassword.addEventListener('input', () => {
      clearInputError(newPassword, newPasswordError);
      updatePasswordStrength(newPassword.value, updateStrengthBar, updateStrengthText);
      if (confirmNewPassword.value) {
        if (newPassword.value !== confirmNewPassword.value) {
          setInputError(confirmNewPassword, confirmNewPasswordError, 'Passwords do not match');
        } else {
          clearInputError(confirmNewPassword, confirmNewPasswordError);
        }
      }
    });

    confirmNewPassword.addEventListener('input', () => {
      if (newPassword.value !== confirmNewPassword.value) {
        setInputError(confirmNewPassword, confirmNewPasswordError, 'Passwords do not match');
      } else {
        clearInputError(confirmNewPassword, confirmNewPasswordError);
      }
    });

    updatePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isValid = true;
      if (!validatePassword(newPassword.value)) {
        setInputError(newPassword, newPasswordError, 'Password must be at least 8 characters');
        isValid = false;
      }
      
      if (newPassword.value !== confirmNewPassword.value) {
        setInputError(confirmNewPassword, confirmNewPasswordError, 'Passwords do not match');
        isValid = false;
      }
      
      if (!isValid) return;

      const submitBtn = updatePasswordForm.querySelector('button[type="submit"]');
      submitBtn.classList.add('loading');
      
      const { error } = await supabaseAuth.updatePassword(newPassword.value);
      submitBtn.classList.remove('loading');

      if (error) {
        setInputError(newPassword, newPasswordError, error.message);
      } else {
        showSuccessOverlay('Password Reset!', 'Your password has been successfully updated. Redirecting to login...', () => {
          window.location.href = './login.html';
        });
      }
    });
  }
