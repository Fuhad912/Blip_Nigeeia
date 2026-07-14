/**
 * Blip — "Recordings" Module
 * Renders recording cards, handles search/filter/sort (UI-only),
 * manages Watch & Details modals, and loading skeletons.
 *
 * Ready for future Supabase + YouTube integration.
 * Replace `mockRecordings` with real data from Supabase.
 * Replace placeholder YouTube URLs with actual unlisted video IDs.
 */

// =========================================================================
//  Demo Data
// =========================================================================

const mockRecordings = [
  {
    id: 'rec-001',
    subject: 'Mathematics',
    title: 'Quadratic Equations — Completing the Square',
    teacher: 'Mrs. Adewale',
    date: 'July 10, 2026',
    meetingDate: 'July 10, 2026 • 4:00 PM',
    duration: '42 min',
    durationSeconds: 2520,
    views: 234,
    progress: 62,
    description: 'This lesson covers the method of completing the square to solve quadratic equations. Students learn how to transform standard form quadratics into vertex form and identify key features of parabolas.',
    relatedLesson: 'Week 12 — Algebra II',
    youtubeId: 'dQw4w9WgXcQ',  // Placeholder
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=640&h=360&fit=crop',
    category: 'mathematics',
    completed: false,
  },
  {
    id: 'rec-002',
    subject: 'Biology',
    title: 'Cell Division — Mitosis vs Meiosis',
    teacher: 'Dr. Bello',
    date: 'July 9, 2026',
    meetingDate: 'July 9, 2026 • 2:00 PM',
    duration: '38 min',
    durationSeconds: 2280,
    views: 189,
    progress: 100,
    description: 'An in-depth exploration of cell division processes. We compare mitosis and meiosis, examine the stages of each, and discuss their significance in growth, repair, and reproduction.',
    relatedLesson: 'Week 12 — Cell Biology',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=640&h=360&fit=crop',
    category: 'science',
    completed: true,
  },
  {
    id: 'rec-003',
    subject: 'English Language',
    title: 'Essay Writing — Argumentative Structure',
    teacher: 'Mr. Okafor',
    date: 'July 8, 2026',
    meetingDate: 'July 8, 2026 • 10:00 AM',
    duration: '35 min',
    durationSeconds: 2100,
    views: 156,
    progress: 45,
    description: 'This lesson teaches students how to construct compelling argumentative essays with clear thesis statements, supporting evidence, and logical conclusions.',
    relatedLesson: 'Week 11 — Writing Skills',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=640&h=360&fit=crop',
    category: 'languages',
    completed: false,
  },
  {
    id: 'rec-004',
    subject: 'Chemistry',
    title: 'Periodic Table Trends — Electronegativity',
    teacher: 'Miss Tolu',
    date: 'July 7, 2026',
    meetingDate: 'July 7, 2026 • 11:00 AM',
    duration: '44 min',
    durationSeconds: 2640,
    views: 312,
    progress: 78,
    description: 'Explore periodic trends focusing on electronegativity. Learn how and why electronegativity changes across periods and down groups, and its effect on bonding.',
    relatedLesson: 'Week 11 — Periodic Chemistry',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=640&h=360&fit=crop',
    category: 'science',
    completed: false,
  },
  {
    id: 'rec-005',
    subject: 'Physics',
    title: 'Newton\'s Laws of Motion — Applications',
    teacher: 'Mr. Adeyemi',
    date: 'July 5, 2026',
    meetingDate: 'July 5, 2026 • 1:00 PM',
    duration: '50 min',
    durationSeconds: 3000,
    views: 278,
    progress: 100,
    description: 'Practical applications of Newton\'s three laws of motion. Includes real-world examples, problem-solving techniques, and interactive demonstrations.',
    relatedLesson: 'Week 10 — Mechanics',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=640&h=360&fit=crop',
    category: 'science',
    completed: true,
  },
  {
    id: 'rec-006',
    subject: 'Mathematics',
    title: 'Trigonometric Identities — Proving Equations',
    teacher: 'Mrs. Adewale',
    date: 'July 3, 2026',
    meetingDate: 'July 3, 2026 • 4:00 PM',
    duration: '46 min',
    durationSeconds: 2760,
    views: 198,
    progress: 30,
    description: 'Master the fundamental trigonometric identities and learn systematic approaches to proving trigonometric equations step by step.',
    relatedLesson: 'Week 10 — Trigonometry',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=640&h=360&fit=crop',
    category: 'mathematics',
    completed: false,
  },
  {
    id: 'rec-007',
    subject: 'French',
    title: 'Les Verbes Irréguliers — Passé Composé',
    teacher: 'Mme. Diallo',
    date: 'July 2, 2026',
    meetingDate: 'July 2, 2026 • 9:00 AM',
    duration: '33 min',
    durationSeconds: 1980,
    views: 87,
    progress: 100,
    description: 'Practice conjugating irregular French verbs in the passé composé tense. Includes listening exercises and conversation drills.',
    relatedLesson: 'Week 10 — French Grammar',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1549737328-8b9f3252b927?w=640&h=360&fit=crop',
    category: 'languages',
    completed: true,
  },
  {
    id: 'rec-008',
    subject: 'Biology',
    title: 'Photosynthesis — Light & Dark Reactions',
    teacher: 'Dr. Bello',
    date: 'June 30, 2026',
    meetingDate: 'June 30, 2026 • 2:00 PM',
    duration: '41 min',
    durationSeconds: 2460,
    views: 203,
    progress: 55,
    description: 'Detailed walkthrough of the light-dependent and light-independent reactions of photosynthesis, including the Calvin cycle and electron transport chain.',
    relatedLesson: 'Week 9 — Plant Biology',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=640&h=360&fit=crop',
    category: 'science',
    completed: false,
  },
  {
    id: 'rec-009',
    subject: 'Computer Studies',
    title: 'Introduction to HTML & CSS Basics',
    teacher: 'Mrs. Nwosu',
    date: 'June 28, 2026',
    meetingDate: 'June 28, 2026 • 3:00 PM',
    duration: '52 min',
    durationSeconds: 3120,
    views: 345,
    progress: 88,
    description: 'Hands-on introduction to building web pages with HTML and CSS. Students create their first simple webpage by the end of the lesson.',
    relatedLesson: 'Week 9 — Web Development',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640&h=360&fit=crop',
    category: 'science',
    completed: false,
  },
];

/** Recordings with progress > 0 and < 100 — "Continue Watching" candidates */
const continueWatchingData = mockRecordings.filter(r => r.progress > 0 && r.progress < 100).slice(0, 3);

/** Recommended — static demo subset */
const recommendedData = [mockRecordings[4], mockRecordings[7], mockRecordings[6]];

// =========================================================================
//  Rendering Helpers
// =========================================================================

/**
 * Creates the HTML for a single recording card.
 * @param {object} rec  Recording data object
 * @param {object} [opts] Optional flags
 * @param {boolean} [opts.lazyThumb=true] Lazy-load the thumbnail
 * @returns {string} HTML string
 */
function createRecordingCardHTML(rec, opts = {}) {
  const lazy = opts.lazyThumb !== false;

  const progressHTML = rec.progress > 0 && rec.progress < 100
    ? `<div class="rec-progress-section">
         <div class="rec-progress-label">
           <span>Continue Watching</span>
           <span>${rec.progress}%</span>
         </div>
         <div class="rec-progress-bar-bg">
           <div class="rec-progress-bar-fill" style="width:${rec.progress}%"></div>
         </div>
       </div>`
    : '';

  return `
    <article class="rec-card" role="listitem" data-id="${rec.id}">

      <!-- Thumbnail -->
      <div class="rec-thumbnail-wrap">
        <img
          class="rec-thumbnail"
          src="${lazy ? '' : rec.thumbnail}"
          ${lazy ? `data-src="${rec.thumbnail}"` : ''}
          alt="Thumbnail for ${rec.title}"
          ${lazy ? 'loading="lazy"' : ''}
        >
        <div class="rec-play-overlay" role="button" tabindex="0"
             aria-label="Watch ${rec.title}"
             data-action="watch" data-rec-id="${rec.id}">
          <span class="rec-play-btn"><i data-lucide="play"></i></span>
        </div>
        <span class="rec-subject-tag">${rec.subject}</span>
        <span class="rec-duration-badge">${rec.duration}</span>
      </div>

      <!-- Body -->
      <div class="rec-card-body">
        <p class="rec-card-subject">${rec.subject}</p>
        <h3 class="rec-card-title">${rec.title}</h3>
        <p class="rec-card-teacher">${rec.teacher}</p>
        <p class="rec-card-date">${rec.date}</p>
      </div>

      <!-- Metadata -->
      <div class="rec-meta-row">
        <span class="rec-meta-item"><i data-lucide="eye"></i> ${rec.views.toLocaleString()} views</span>
        <span class="rec-meta-dot"></span>
        <span class="rec-meta-item"><i data-lucide="clock"></i> ${rec.duration}</span>
      </div>

      <!-- Progress -->
      ${progressHTML}

      <!-- Actions -->
      <div class="rec-card-actions">
        <button class="rec-btn rec-btn-primary" data-action="watch" data-rec-id="${rec.id}" aria-label="Watch ${rec.title}">
          <i data-lucide="play"></i> Watch Now
        </button>
        <button class="rec-btn rec-btn-secondary" data-action="details" data-rec-id="${rec.id}" aria-label="Details for ${rec.title}">
          Details
        </button>
      </div>

    </article>
  `;
}

/**
 * Creates a skeleton card for loading state.
 */
function createSkeletonCardHTML() {
  return `
    <div class="rec-skeleton-card" aria-hidden="true">
      <div class="rec-skeleton-thumb"></div>
      <div class="rec-skeleton-body">
        <div class="rec-skeleton-line short"></div>
        <div class="rec-skeleton-line medium"></div>
        <div class="rec-skeleton-line long"></div>
        <div class="rec-skeleton-line short"></div>
        <div class="rec-skeleton-line full"></div>
        <div class="rec-skeleton-line btn-h"></div>
      </div>
    </div>
  `;
}

/**
 * Creates empty-state HTML.
 */
function createEmptyStateHTML() {
  return `
    <div class="rec-empty-state" style="grid-column: 1 / -1;">
      <div class="rec-empty-icon">
        <i data-lucide="video-off"></i>
      </div>
      <h2>No Recordings Available</h2>
      <p>Recorded lessons will appear here after your teachers upload them.</p>
      <button class="rec-empty-btn" id="recRefreshBtn" aria-label="Refresh recordings">
        <i data-lucide="refresh-cw"></i>
        Refresh
      </button>
    </div>
  `;
}

// =========================================================================
//  Lazy-load thumbnails with IntersectionObserver
// =========================================================================

function initLazyThumbnails(container) {
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all immediately
    container.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  container.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}

// =========================================================================
//  Module Initialisation
// =========================================================================

export function initRecordings() {
  // ---- DOM refs ----
  const gridContainer     = document.getElementById('recGridContainer');
  const continueScroll    = document.getElementById('recContinueScroll');
  const recommendedGrid   = document.getElementById('recRecommendedGrid');
  const searchInput       = document.getElementById('recSearchInput');
  const filters           = document.querySelectorAll('.rec-chip');
  const sortSelect        = document.getElementById('recSortSelect');
  const watchOverlay      = document.getElementById('recWatchOverlay');
  const detailsOverlay    = document.getElementById('recDetailsOverlay');

  let currentFilter = 'all';
  let searchQuery   = '';

  // -----------------------------------------------------------------------
  //  1. Initial skeleton loading state
  // -----------------------------------------------------------------------
  gridContainer.innerHTML   = Array(6).fill(createSkeletonCardHTML()).join('');
  continueScroll.innerHTML  = Array(3).fill(createSkeletonCardHTML()).join('');
  recommendedGrid.innerHTML = Array(3).fill(createSkeletonCardHTML()).join('');

  // Simulate network delay then render real data
  setTimeout(() => {
    renderMainGrid();
    renderContinueWatching();
    renderRecommended();
    refreshIcons();
    initLazyThumbnails(document.querySelector('.recordings-wrapper'));
  }, 700);

  // -----------------------------------------------------------------------
  //  2. Render functions
  // -----------------------------------------------------------------------
  function renderMainGrid() {
    let data = applyFilters(mockRecordings);

    if (data.length === 0) {
      gridContainer.innerHTML = createEmptyStateHTML();
      attachRefreshHandler();
    } else {
      gridContainer.innerHTML = data.map(r => createRecordingCardHTML(r)).join('');
    }

    refreshIcons();
    attachCardActions(gridContainer);
    initLazyThumbnails(gridContainer);
  }

  function renderContinueWatching() {
    if (continueWatchingData.length === 0) {
      document.querySelector('.rec-continue-section').style.display = 'none';
      return;
    }
    continueScroll.innerHTML = continueWatchingData
      .map(r => createRecordingCardHTML(r, { lazyThumb: false }))
      .join('');
    refreshIcons();
    attachCardActions(continueScroll);
  }

  function renderRecommended() {
    recommendedGrid.innerHTML = recommendedData
      .map(r => createRecordingCardHTML(r))
      .join('');
    refreshIcons();
    attachCardActions(recommendedGrid);
    initLazyThumbnails(recommendedGrid);
  }

  // -----------------------------------------------------------------------
  //  3. Filter + Search logic (UI-only)
  // -----------------------------------------------------------------------
  function applyFilters(data) {
    let filtered = [...data];

    // Category filter
    if (currentFilter !== 'all') {
      if (currentFilter === 'recent') {
        // Show most recent 4
        filtered = filtered.slice(0, 4);
      } else if (currentFilter === 'completed') {
        filtered = filtered.filter(r => r.completed);
      } else {
        filtered = filtered.filter(r => r.category === currentFilter);
      }
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.teacher.toLowerCase().includes(q)
      );
    }

    return filtered;
  }

  // -----------------------------------------------------------------------
  //  4. Event Listeners
  // -----------------------------------------------------------------------

  // Search
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderMainGrid();
  });

  // Filter chips
  filters.forEach(chip => {
    chip.addEventListener('click', () => {
      filters.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');
      currentFilter = chip.dataset.filter;
      renderMainGrid();
    });
  });

  // Sort (UI-only — reorders display)
  sortSelect.addEventListener('change', () => {
    renderMainGrid();
  });

  // -----------------------------------------------------------------------
  //  5. Card action delegation
  // -----------------------------------------------------------------------
  function attachCardActions(container) {
    container.addEventListener('click', handleCardAction);
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardAction(e);
      }
    });
  }

  function handleCardAction(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const recId = target.dataset.recId;
    const action = target.dataset.action;
    const rec = mockRecordings.find(r => r.id === recId);
    if (!rec) return;

    if (action === 'watch') openWatchModal(rec);
    if (action === 'details') openDetailsModal(rec);
  }

  // -----------------------------------------------------------------------
  //  6. Watch Modal
  // -----------------------------------------------------------------------
  function openWatchModal(rec) {
    document.getElementById('recWatchTitle').textContent       = rec.title;
    document.getElementById('recWatchTeacher').textContent     = rec.teacher;
    document.getElementById('recWatchSubject').textContent     = rec.subject;
    document.getElementById('recWatchDate').textContent        = rec.date;
    document.getElementById('recWatchDescription').textContent = rec.description;

    // Prepare iframe placeholder (ready for real YouTube embed)
    const placeholder = document.getElementById('recPlayerPlaceholder');
    placeholder.innerHTML = `
      <i data-lucide="play-circle"></i>
      <span>YouTube player will load here</span>
      <!-- Replace with: <iframe src="https://www.youtube.com/embed/${rec.youtubeId}?rel=0" allowfullscreen></iframe> -->
    `;

    watchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    refreshIcons();

    // Focus management
    document.getElementById('recWatchClose').focus();
  }

  function closeWatchModal() {
    watchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('recWatchClose').addEventListener('click', closeWatchModal);
  watchOverlay.addEventListener('click', (e) => {
    if (e.target === watchOverlay) closeWatchModal();
  });

  // -----------------------------------------------------------------------
  //  7. Details Modal
  // -----------------------------------------------------------------------
  function openDetailsModal(rec) {
    document.getElementById('recDetailSubject').textContent     = rec.subject;
    document.getElementById('recDetailTeacher').textContent     = rec.teacher;
    document.getElementById('recDetailDescription').textContent = rec.description;
    document.getElementById('recDetailDate').textContent        = rec.date;
    document.getElementById('recDetailDuration').textContent    = rec.duration;
    document.getElementById('recDetailLesson').textContent      = rec.relatedLesson;
    document.getElementById('recDetailMeetingDate').textContent = rec.meetingDate;

    detailsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus management
    document.getElementById('recDetailsClose').focus();
  }

  function closeDetailsModal() {
    detailsOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('recDetailsClose').addEventListener('click', closeDetailsModal);
  detailsOverlay.addEventListener('click', (e) => {
    if (e.target === detailsOverlay) closeDetailsModal();
  });

  // -----------------------------------------------------------------------
  //  8. Keyboard: Escape closes modals
  // -----------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (watchOverlay.classList.contains('active')) closeWatchModal();
      if (detailsOverlay.classList.contains('active')) closeDetailsModal();
    }
  });

  // -----------------------------------------------------------------------
  //  9. Refresh handler (empty state)
  // -----------------------------------------------------------------------
  function attachRefreshHandler() {
    const btn = document.getElementById('recRefreshBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        // Reset filters and re-render
        filters.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        const allChip = document.querySelector('.rec-chip[data-filter="all"]');
        if (allChip) {
          allChip.classList.add('active');
          allChip.setAttribute('aria-pressed', 'true');
        }
        currentFilter = 'all';
        searchQuery = '';
        searchInput.value = '';
        renderMainGrid();
      });
    }
  }

  // -----------------------------------------------------------------------
  //  Utility: Refresh Lucide icons in new DOM
  // -----------------------------------------------------------------------
  function refreshIcons() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
