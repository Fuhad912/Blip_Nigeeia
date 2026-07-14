/**
 * Blip Main App Shell Initialization
 * Fetches and injects modular components, then boots the shell.
 */

import { initNavigation } from './navigation.js?v=2';

// Simple SPA Router Configuration
const routes = {
  'dashboard': { html: 'dashboard.html', title: 'Dashboard', module: null },
  'my-classes': { html: 'my-classes.html', title: 'My Classes', module: './my-classes.js' },
  'timetable': { html: 'timetable.html', title: 'Timetable', module: './timetable.js' },
  'recordings': { html: 'recordings.html', title: 'Recordings', module: './recordings.js' }
};

// Global function to load a page dynamically
window.blipLoadPage = async function(pageId) {
  const route = routes[pageId];
  if (!route) return;

  const contentArea = document.getElementById('main-content');
  const titleElement = document.getElementById('pageTitlePlaceholder');
  
  try {
    // 1. Show skeleton or loading state (optional, here we rely on the component's internal loader)
    // 2. Fetch HTML
    const res = await fetch(route.html);
    const html = await res.text();
    
    // 3. Inject HTML
    contentArea.innerHTML = html;
    
    // 4. Update Header
    if (titleElement) titleElement.textContent = route.title;
    
    // 5. Load and execute specific JS module if required
    if (route.module) {
      const pageModule = await import(route.module);
      // Ensure the module exports an initialization function corresponding to the page
      if (pageId === 'my-classes' && pageModule.initMyClasses) {
        pageModule.initMyClasses();
      } else if (pageId === 'timetable' && pageModule.initTimetable) {
        pageModule.initTimetable();
      } else if (pageId === 'recordings' && pageModule.initRecordings) {
        pageModule.initRecordings();
      }
    }

    // 6. Refresh Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

  } catch (err) {
    console.error(`Failed to load page: ${pageId}`, err);
    contentArea.innerHTML = `<div class="empty-state"><h2>Error loading page</h2></div>`;
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1. Fetch shell structural components
    const [sidebarRes, navbarRes, loaderRes] = await Promise.all([
      fetch('components/sidebar.html'),
      fetch('components/navbar.html'),
      fetch('components/app-loader.html')
    ]);

    const sidebarHtml = await sidebarRes.text();
    const navbarHtml = await navbarRes.text();
    const loaderHtml = await loaderRes.text();

    document.getElementById('sidebar-container').innerHTML = sidebarHtml;
    document.getElementById('navbar-container').innerHTML = navbarHtml;
    document.body.insertAdjacentHTML('afterbegin', loaderHtml);

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    initNavigation();

    // 2. Load the default route
    await window.blipLoadPage('dashboard');

    // 3. Remove global loader
    setTimeout(() => {
      const loader = document.getElementById('appLoader');
      if (loader) {
        loader.classList.add('loaded');
        setTimeout(() => loader.remove(), 500);
      }
    }, 400);

  } catch (error) {
    console.error('Failed to initialize App Shell components:', error);
  }
});
