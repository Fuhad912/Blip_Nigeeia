/**
 * Blip Shell Navigation Logic
 * Handles sidebar toggles, active states, and mobile overlay
 */

export function initNavigation() {
  const sidebar = document.getElementById('sidebar-container');
  const overlay = document.getElementById('sidebarOverlay');
  const openBtn = document.getElementById('openSidebarBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');
  const navItems = document.querySelectorAll('.nav-item');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling on mobile
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Toggle Events
  if (openBtn) openBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Handle active states and routing
  navItems.forEach(item => {
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const targetPage = e.currentTarget.getAttribute('data-page');
      if (targetPage && window.blipLoadPage) {
        navItems.forEach(nav => nav.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Trigger SPA router
        await window.blipLoadPage(targetPage);
      }

      // Close sidebar on mobile after navigating
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });
}
