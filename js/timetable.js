/**
 * Blip "Timetable" Module
 * Handles rendering of the 2D tabular schedule (Desktop) and Accordion (Mobile).
 */

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const CURRENT_DAY = "Tuesday";

// Tabular Mock Data Matrix
const scheduleMatrix = [
  {
    time: "08:00 AM",
    type: "period",
    Monday: { subject: "Mathematics", teacher: "Mrs. Adewale", icon: "book-open", status: "completed", isLive: false },
    Tuesday: { subject: "Chemistry", teacher: "Miss Tolu", icon: "flask-conical", status: "completed", isLive: false },
    Wednesday: { type: "free" },
    Thursday: { subject: "Civic Edu.", teacher: "Mr. Sani", icon: "users", status: "upcoming", isLive: false },
    Friday: { subject: "Physics", teacher: "Mr. Adeyemi", icon: "atom", status: "upcoming", isLive: false },
    Saturday: { type: "free" }
  },
  {
    time: "09:00 AM",
    type: "period",
    Monday: { subject: "English", teacher: "Mr. Okafor", icon: "languages", status: "completed", isLive: false },
    Tuesday: { type: "free" },
    Wednesday: { subject: "Economics", teacher: "Mr. Obi", icon: "trending-up", status: "upcoming", isLive: false },
    Thursday: { type: "free" },
    Friday: { subject: "English", teacher: "Mr. Okafor", icon: "languages", status: "upcoming", isLive: false },
    Saturday: { type: "free" }
  },
  {
    time: "10:00 AM",
    type: "break",
    label: "Recess / Short Break"
  },
  {
    time: "10:30 AM",
    type: "period",
    Monday: { type: "free" },
    Tuesday: { subject: "Biology", teacher: "Dr. Bello", icon: "leaf", status: "live", isLive: true },
    Wednesday: { subject: "Government", teacher: "Mrs. Kalu", icon: "landmark", status: "upcoming", isLive: false },
    Thursday: { subject: "Mathematics", teacher: "Mrs. Adewale", icon: "book-open", status: "upcoming", isLive: false },
    Friday: { type: "free" },
    Saturday: { type: "free" }
  },
  {
    time: "11:30 AM",
    type: "period",
    Monday: { subject: "Physics", teacher: "Mr. Adeyemi", icon: "atom", status: "completed", isLive: false },
    Tuesday: { subject: "Computer", teacher: "Mrs. Nwosu", icon: "monitor", status: "upcoming", isLive: false },
    Wednesday: { type: "free" },
    Thursday: { type: "free" },
    Friday: { type: "free" },
    Saturday: { type: "free" }
  }
];

function generateTableCell(lesson, time) {
  if (!lesson || lesson.type === "free") return `<td class="tt-cell empty"><div class="tt-cell-free">Free</div></td>`;
  
  const liveClass = lesson.isLive ? 'is-live' : '';
  return `
    <td class="tt-cell ${liveClass}" onclick="window.blipOpenTtDetails('${lesson.subject}', '${lesson.teacher}', '${time} (45 min)')">
      <div class="tt-cell-content">
        <div class="tt-cell-icon"><i data-lucide="${lesson.icon}"></i></div>
        <div class="tt-cell-text">
          <span class="tt-cell-subj">${lesson.subject}</span>
        </div>
      </div>
    </td>
  `;
}

function renderDesktopTable() {
  let html = `
    <div class="tt-desktop-view">
      <table class="tt-table">
        <thead>
          <tr>
            <th class="tt-time-col">Time</th>
            ${daysOfWeek.map(day => `<th class="${day === CURRENT_DAY ? 'is-today' : ''}">${day}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  scheduleMatrix.forEach(row => {
    if (row.type === 'break') {
      html += `
        <tr class="tt-break-row">
          <td class="tt-time-col">${row.time}</td>
          <td colspan="6" class="tt-break-cell">${row.label}</td>
        </tr>
      `;
    } else {
      html += `<tr>`;
      html += `<td class="tt-time-col">${row.time}</td>`;
      daysOfWeek.forEach(day => {
        html += generateTableCell(row[day], row.time);
      });
      html += `</tr>`;
    }
  });

  html += `
        </tbody>
      </table>
    </div>
  `;
  return html;
}

function generateAccordionCard(lesson, time) {
  if (!lesson || lesson.type === "free") return '';
  const liveClass = lesson.isLive ? 'is-live' : '';
  let statusBadge = '';
  if (lesson.status === 'live') statusBadge = `<span class="tt-card-status live">LIVE</span>`;
  else if (lesson.status === 'upcoming') statusBadge = `<span class="tt-card-status upcoming">Up</span>`;
  
  return `
    <div class="tt-acc-card ${liveClass}" onclick="window.blipOpenTtDetails('${lesson.subject}', '${lesson.teacher}', '${time} (45 min)')">
      <div class="tt-acc-icon"><i data-lucide="${lesson.icon}"></i></div>
      <div class="tt-acc-info">
        <h4>${lesson.subject}</h4>
        <p>${time} • ${lesson.teacher}</p>
      </div>
      ${statusBadge}
    </div>
  `;
}

function renderMobileAccordion() {
  let html = `<div class="tt-mobile-view">`;
  
  daysOfWeek.forEach(day => {
    const isToday = day === CURRENT_DAY;
    const activeClass = isToday ? 'active' : '';
    
    let dayCardsHtml = '';
    scheduleMatrix.forEach(row => {
      if (row.type === 'period' && row[day] && row[day].type !== 'free') {
        dayCardsHtml += generateAccordionCard(row[day], row.time);
      }
    });

    if (dayCardsHtml === '') {
      dayCardsHtml = `<div class="tt-acc-free">No classes scheduled</div>`;
    }

    html += `
      <div class="tt-accordion-item ${activeClass}">
        <div class="tt-accordion-header" onclick="this.parentElement.classList.toggle('active')">
          <span>${day} ${isToday ? '<small class="tt-acc-badge">Today</small>' : ''}</span>
          <i data-lucide="chevron-down" class="tt-acc-chevron"></i>
        </div>
        <div class="tt-accordion-body">
          ${dayCardsHtml}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

function renderTimetable() {
  const container = document.getElementById('ttGridContainer');
  container.innerHTML = renderDesktopTable() + renderMobileAccordion();
}

function renderUpcomingPanel() {
  const container = document.getElementById('ttUpcomingContainer');
  const upcoming = [
    { subject: "Computer Science", teacher: "Mrs. Nwosu", day: "Tuesday", time: "11:30 AM", icon: "monitor" },
    { subject: "Economics", teacher: "Mr. Obi", day: "Wednesday", time: "09:00 AM", icon: "trending-up" },
    { subject: "Government", teacher: "Mrs. Kalu", day: "Wednesday", time: "10:00 AM", icon: "landmark" },
    { subject: "Civic Edu.", teacher: "Mr. Sani", day: "Thursday", time: "08:00 AM", icon: "users" }
  ];

  let html = upcoming.map(item => `
    <div class="tt-upcoming-row" onclick="window.blipOpenTtDetails('${item.subject}', '${item.teacher}', '${item.time}')">
      <div class="tt-up-left">
        <div class="tt-up-icon">
          <i data-lucide="${item.icon}"></i>
        </div>
        <div class="tt-up-details">
          <h4>${item.subject}</h4>
          <p>${item.teacher}</p>
        </div>
      </div>
      <div class="tt-up-right">
        <div class="tt-up-time">
          <span>${item.time}</span>
          <small>${item.day}</small>
        </div>
        <i data-lucide="chevron-right" class="tt-up-arrow"></i>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

function updateSummaryCard() {
  const totalElem = document.getElementById('ttTotalToday');
  const nextElem = document.getElementById('ttNextClass');
  const startsElem = document.getElementById('ttStartsIn');
  if(totalElem) totalElem.textContent = "3";
  if(nextElem) nextElem.textContent = "Biology";
  if(startsElem) startsElem.textContent = "LIVE NOW";
}

export function initTimetable() {
  setTimeout(() => {
    renderTimetable();
    renderUpcomingPanel();
    updateSummaryCard();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 400);

  const segments = document.querySelectorAll('.segment-btn');
  segments.forEach(btn => {
    btn.addEventListener('click', (e) => {
      segments.forEach(s => s.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  window.blipOpenTtDetails = function(subject, teacher, time) {
    const s = document.getElementById('ttModalSubject');
    const t = document.getElementById('ttModalTeacher');
    const tm = document.getElementById('ttModalTime');
    const m = document.getElementById('ttDetailsModal');
    if(s) s.textContent = subject;
    if(t) t.textContent = teacher;
    if(tm) tm.textContent = time;
    if(m) m.classList.add('active');
  };

  document.getElementById('ttCloseModal')?.addEventListener('click', () => {
    document.getElementById('ttDetailsModal')?.classList.remove('active');
  });

  document.getElementById('ttDetailsModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'ttDetailsModal') {
      e.target.classList.remove('active');
    }
  });
}
