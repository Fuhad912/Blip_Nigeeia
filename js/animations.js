/**
 * JS Animations & Interactions for Blip Auth
 */

export const initPasswordToggles = () => {
  const toggleBtns = document.querySelectorAll('.password-toggle');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const inputId = btn.getAttribute('data-target');
      const input = document.getElementById(inputId);
      
      if (input.type === 'password') {
        input.type = 'text';
        // Eye open icon
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      } else {
        input.type = 'password';
        // Eye closed icon
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
      }
    });
  });
};

export const showSuccessOverlay = (message = 'Success!', submessage = 'Redirecting...') => {
  const overlay = document.getElementById('successOverlay');
  if (!overlay) return;
  
  const title = overlay.querySelector('h3');
  const desc = overlay.querySelector('p');
  
  if (title) title.textContent = message;
  if (desc) desc.textContent = submessage;
  
  overlay.classList.add('active');
};
