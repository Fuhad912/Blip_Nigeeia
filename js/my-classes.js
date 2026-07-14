/**
 * Blip "My Classes" Module
 * Handles rendering, filtering, search, and interactions for the My Classes page.
 */

const mockClasses = [
  {
    id: 1,
    subject: "Mathematics",
    teacher: "Mrs. Adewale",
    icon: "book-open",
    status: "live", // live, upcoming, recording, completed
    schedule: "Monday • 4:00 PM",
    progress: 68,
    meetLink: "https://meet.google.com/mock-math",
    recordingLink: null
  },
  {
    id: 2,
    subject: "English Language",
    teacher: "Mr. Okafor",
    icon: "languages",
    status: "upcoming",
    schedule: "Tuesday • 10:00 AM",
    progress: 45,
    meetLink: null,
    recordingLink: null
  },
  {
    id: 3,
    subject: "Biology",
    teacher: "Dr. Bello",
    icon: "leaf",
    status: "recording",
    schedule: "Wednesday • 2:00 PM",
    progress: 85,
    meetLink: null,
    recordingLink: "https://youtube.com/mock-bio"
  },
  {
    id: 4,
    subject: "Chemistry",
    teacher: "Miss Tolu",
    icon: "flask-conical",
    status: "recording",
    schedule: "Thursday • 11:00 AM",
    progress: 92,
    meetLink: null,
    recordingLink: "https://youtube.com/mock-chem"
  },
  {
    id: 5,
    subject: "Physics",
    teacher: "Mr. Adeyemi",
    icon: "atom",
    status: "upcoming",
    schedule: "Friday • 1:00 PM",
    progress: 30,
    meetLink: null,
    recordingLink: null
  },
  {
    id: 6,
    subject: "Computer Studies",
    teacher: "Mrs. Nwosu",
    icon: "monitor",
    status: "completed",
    schedule: "Completed",
    progress: 100,
    meetLink: null,
    recordingLink: null
  }
];

// Helper: Generate HTML for a single card
function createCardHTML(course) {
  let statusHTML = '';
  let actionsHTML = '';

  if (course.status === 'live') {
    statusHTML = `<span class="mc-status live">Live Today</span>`;
    actionsHTML = `
      <button class="btn-primary cta-live" onclick="window.open('${course.meetLink}', '_blank')">Join Class</button>
      <button class="btn-secondary" onclick="window.blipOpenDetails('${course.subject}', '${course.teacher}', '${course.schedule}')">Details</button>
    `;
  } else if (course.status === 'recording') {
    statusHTML = `<span class="mc-status recording">Recording Available</span>`;
    actionsHTML = `
      <button class="btn-primary" onclick="window.open('${course.recordingLink}', '_blank')">Watch Recording</button>
      <button class="btn-secondary" onclick="window.blipOpenDetails('${course.subject}', '${course.teacher}', '${course.schedule}')">Details</button>
    `;
  } else if (course.status === 'upcoming') {
    statusHTML = `<span class="mc-status upcoming">Upcoming</span>`;
    actionsHTML = `
      <button class="btn-primary" onclick="window.blipOpenDetails('${course.subject}', '${course.teacher}', '${course.schedule}')">View Schedule</button>
      <button class="btn-secondary" onclick="window.blipOpenDetails('${course.subject}', '${course.teacher}', '${course.schedule}')">Details</button>
    `;
  } else if (course.status === 'completed') {
    statusHTML = `<span class="mc-status completed">Completed</span>`;
    actionsHTML = `
      <button class="btn-secondary" style="width:100%" onclick="window.blipOpenDetails('${course.subject}', '${course.teacher}', '${course.schedule}')">Course Details</button>
    `;
  }

  return `
    <div class="mc-card">
      <div class="mc-card-header">
        <div class="mc-subject-icon">
          <i data-lucide="${course.icon}"></i>
        </div>
        ${statusHTML}
      </div>
      <div class="mc-card-body">
        <h3>${course.subject}</h3>
        <p class="mc-teacher">${course.teacher}</p>
        <div class="mc-schedule">
          <i data-lucide="calendar" style="width:14px;height:14px;"></i>
          ${course.schedule}
        </div>
        <div class="mc-progress-section">
          <div class="mc-progress-header">
            <span>Course Progress</span>
            <span>${course.progress}%</span>
          </div>
          <div class="mc-progress-bar-bg">
            <div class="mc-progress-bar-fill" style="width: ${course.progress}%"></div>
          </div>
        </div>
      </div>
      <div class="mc-card-actions">
        ${actionsHTML}
      </div>
    </div>
  `;
}

// Helper: Empty state HTML
function createEmptyState() {
  return `
    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 24px; border: 2px dashed #EFE7D6;">
      <i data-lucide="search-x" style="width: 64px; height: 64px; color: #E8A07C; margin-bottom: 16px; opacity: 0.8;"></i>
      <h2 style="font-size: 24px; color: #4F4428; margin-bottom: 8px;">No Classes Found</h2>
      <p style="color: #827148; margin-bottom: 24px;">We couldn't find any classes matching your current filter.</p>
      <button class="btn-primary" style="padding: 12px 32px;" onclick="document.querySelector('.mc-chip[data-filter=\\'all\\']').click()">Clear Filters</button>
    </div>
  `;
}

// Helper: Skeleton HTML
function createSkeletonHTML() {
  return `
    <div class="mc-card skeleton" style="height: 320px; border: none; box-shadow: none;"></div>
  `;
}

export function initMyClasses() {
  const gridContainer = document.getElementById('mcGridContainer');
  const searchInput = document.getElementById('mcSearchInput');
  const filters = document.querySelectorAll('.mc-chip');
  
  let currentFilter = 'all';
  let searchQuery = '';

  // 1. Initial Render with Skeletons
  gridContainer.innerHTML = Array(6).fill(createSkeletonHTML()).join('');
  
  // 2. Load actual data after simulated network delay
  setTimeout(() => {
    renderGrid();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 600);

  // 3. Render Logic
  function renderGrid() {
    let filteredData = mockClasses.filter(course => {
      // Filter by chip status
      const matchStatus = currentFilter === 'all' || course.status === currentFilter;
      // Filter by search query
      const matchSearch = course.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.teacher.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });

    if (filteredData.length === 0) {
      gridContainer.innerHTML = createEmptyState();
    } else {
      gridContainer.innerHTML = filteredData.map(course => createCardHTML(course)).join('');
    }
    
    // Re-initialize icons inside new HTML
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // 4. Attach Event Listeners
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGrid();
  });

  filters.forEach(chip => {
    chip.addEventListener('click', (e) => {
      filters.forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.getAttribute('data-filter');
      renderGrid();
    });
  });

  // 5. Setup Modal Logic (Expose globally for inline onclick)
  window.blipOpenDetails = function(subject, teacher, schedule) {
    document.getElementById('modalSubject').textContent = subject;
    document.getElementById('modalTeacher').textContent = teacher;
    document.getElementById('modalSchedule').textContent = schedule;
    document.getElementById('mcDetailsModal').classList.add('active');
  };

  document.getElementById('mcCloseModal').addEventListener('click', () => {
    document.getElementById('mcDetailsModal').classList.remove('active');
  });

  document.getElementById('mcDetailsModal').addEventListener('click', (e) => {
    if (e.target.id === 'mcDetailsModal') {
      e.target.classList.remove('active');
    }
  });
}
