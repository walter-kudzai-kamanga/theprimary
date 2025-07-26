// script.js - SchoolMS Modern Dashboard Interactivity

document.addEventListener('DOMContentLoaded', function() {
  // --- Personalization ---
  const user = {
    name: 'Jordan Smith',
    role: 'Administrator',
  };
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userRole').textContent = `(${user.role})`;

  // --- Demo Data ---
  let dashboardData = {
    total_students: 482,
    total_staff: 37,
    total_classes: 24,
    active_lessons: 18,
    last_updated: new Date(),
  };
  let alerts = [
    { id: 1, type: 'incident', message: 'Fire drill scheduled for 2pm.', time: '10 min ago', status: 'active' },
    { id: 2, type: 'maintenance', message: 'Projector in Room 204 needs repair.', time: '30 min ago', status: 'active' },
    { id: 3, type: 'security', message: 'Visitor at main gate.', time: '1 hr ago', status: 'acknowledged' },
  ];
  let activities = [
    { icon: 'fa-user-plus', color: 'primary', text: 'New student registered: Alice Lee', time: '2 min ago' },
    { icon: 'fa-bullhorn', color: 'success', text: 'Notice sent to all staff', time: '15 min ago' },
    { icon: 'fa-calendar-plus', color: 'info', text: 'Lesson scheduled: Math 101', time: '1 hr ago' },
    { icon: 'fa-user-tie', color: 'secondary', text: 'Staff member added: Mr. Brown', time: '2 hrs ago' },
  ];
  let attendanceStats = { present: 450, absent: 20, late: 12 };
  let financeStats = { feesDue: 12000, payrollPending: 5000, paid: 30000 };

  // --- Dashboard Cards ---
  function updateDashboardCards() {
    document.getElementById('totalStudents').textContent = dashboardData.total_students;
    document.getElementById('totalStaff').textContent = dashboardData.total_staff;
    document.getElementById('totalClasses').textContent = dashboardData.total_classes;
    document.getElementById('activeLessons').textContent = dashboardData.active_lessons;
    document.getElementById('lastUpdatedTime').textContent = dashboardData.last_updated.toLocaleTimeString();
  }
  updateDashboardCards();

  // --- Alerts Section ---
  function alertTypeBadge(type) {
    switch(type) {
      case 'incident': return '<span class="badge bg-warning text-dark me-2"><i class="fa-solid fa-triangle-exclamation"></i> Incident</span>';
      case 'maintenance': return '<span class="badge bg-info text-dark me-2"><i class="fa-solid fa-screwdriver-wrench"></i> Maintenance</span>';
      case 'security': return '<span class="badge bg-danger me-2"><i class="fa-solid fa-shield-halved"></i> Security</span>';
      default: return '<span class="badge bg-secondary me-2">General</span>';
    }
  }
  function renderAlerts() {
    const area = document.getElementById('alertsArea');
    if (!alerts.length) {
      area.innerHTML = '<div class="alert alert-success">No active alerts.</div>';
      return;
    }
    area.innerHTML = alerts.map(alert => `
      <div class="alert alert-${alert.type === 'incident' ? 'warning' : alert.type === 'maintenance' ? 'info' : alert.type === 'security' ? 'danger' : 'secondary'} d-flex justify-content-between align-items-center mb-2 animate__animated animate__fadeIn">
        <div>
          ${alertTypeBadge(alert.type)}
          <span>${alert.message}</span>
          <span class="text-muted small ms-2">${alert.time}</span>
        </div>
        <div>
          ${alert.status === 'active' ? `<button class="btn btn-sm btn-outline-success me-1" onclick="acknowledgeAlert(${alert.id})"><i class="fa-solid fa-check"></i></button>` : ''}
          <button class="btn btn-sm btn-outline-secondary" onclick="dismissAlert(${alert.id})"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
    `).join('');
  }
  // Expose for inline onclick
  window.acknowledgeAlert = function(id) {
    const alert = alerts.find(a => a.id === id);
    if (alert) alert.status = 'acknowledged';
    renderAlerts();
    addActivity({ icon: 'fa-check', color: 'success', text: `Alert acknowledged: ${alert.message}`, time: 'just now' });
  };
  window.dismissAlert = function(id) {
    alerts = alerts.filter(a => a.id !== id);
    renderAlerts();
    addActivity({ icon: 'fa-xmark', color: 'danger', text: 'Alert dismissed', time: 'just now' });
  };
  renderAlerts();

  // --- Create Alert Modal ---
  const createAlertBtn = document.getElementById('createAlertBtn');
  const createAlertModal = new bootstrap.Modal(document.getElementById('createAlertModal'));
  createAlertBtn.addEventListener('click', () => {
    document.getElementById('createAlertForm').reset();
    createAlertModal.show();
  });
  document.getElementById('createAlertForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const type = document.getElementById('alertType').value;
    const message = document.getElementById('alertMessage').value;
    const newAlert = {
      id: Date.now(),
      type,
      message,
      time: 'just now',
      status: 'active',
    };
    alerts.unshift(newAlert);
    renderAlerts();
    createAlertModal.hide();
    addActivity({ icon: 'fa-plus', color: 'danger', text: `New alert created: ${message}`, time: 'just now' });
  });

  // --- Quick Actions ---
  function addActivity(activity) {
    activities.unshift({ ...activity });
    renderActivityFeed();
  }
  document.getElementById('addStudentBtn').addEventListener('click', function() {
    addActivity({ icon: 'fa-user-plus', color: 'primary', text: 'Quick action: Add Student clicked', time: 'just now' });
    alert('Add Student action triggered!');
  });
  document.getElementById('addStaffBtn').addEventListener('click', function() {
    addActivity({ icon: 'fa-user-tie', color: 'secondary', text: 'Quick action: Add Staff clicked', time: 'just now' });
    alert('Add Staff action triggered!');
  });
  document.getElementById('sendNoticeBtn').addEventListener('click', function() {
    addActivity({ icon: 'fa-bullhorn', color: 'success', text: 'Quick action: Send Notice clicked', time: 'just now' });
    alert('Send Notice action triggered!');
  });
  document.getElementById('scheduleLessonBtn').addEventListener('click', function() {
    addActivity({ icon: 'fa-calendar-plus', color: 'info', text: 'Quick action: Schedule Lesson clicked', time: 'just now' });
    alert('Schedule Lesson action triggered!');
  });
  document.getElementById('recordIncidentBtn').addEventListener('click', function() {
    addActivity({ icon: 'fa-triangle-exclamation', color: 'warning', text: 'Quick action: Record Incident clicked', time: 'just now' });
    alert('Record Incident action triggered!');
  });

  // --- Activity Feed ---
  function renderActivityFeed() {
    const feed = document.getElementById('activityFeed');
    feed.innerHTML = activities.slice(0, 8).map(act => `
      <li class="list-group-item d-flex align-items-center">
        <i class="fa-solid ${act.icon} text-${act.color} me-2"></i>
        <span>${act.text}</span>
        <span class="ms-auto text-muted small">${act.time}</span>
      </li>
    `).join('');
  }
  renderActivityFeed();

  // --- Attendance Chart ---
  if (window.Chart && document.getElementById('attendanceChart')) {
    new Chart(document.getElementById('attendanceChart').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent', 'Late'],
        datasets: [{
          data: [attendanceStats.present, attendanceStats.absent, attendanceStats.late],
          backgroundColor: ['#198754', '#dc3545', '#ffc107'],
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
    document.getElementById('presentCount').textContent = attendanceStats.present;
    document.getElementById('absentCount').textContent = attendanceStats.absent;
    document.getElementById('lateCount').textContent = attendanceStats.late;
  }

  // --- Finance Chart ---
  if (window.Chart && document.getElementById('financeChart')) {
    new Chart(document.getElementById('financeChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Fees Due', 'Payroll Pending', 'Paid'],
        datasets: [{
          label: 'Amount ($)',
          data: [financeStats.feesDue, financeStats.payrollPending, financeStats.paid],
          backgroundColor: ['#0d6efd', '#fd7e14', '#198754'],
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
    document.getElementById('financialSummary').innerHTML = `
      <div class="row text-center">
        <div class="col"><span class="fw-bold">Fees Due:</span> $${financeStats.feesDue.toLocaleString()}</div>
        <div class="col"><span class="fw-bold">Payroll Pending:</span> $${financeStats.payrollPending.toLocaleString()}</div>
        <div class="col"><span class="fw-bold">Paid:</span> $${financeStats.paid.toLocaleString()}</div>
      </div>
    `;
  }

  // --- Dark Mode ---
  const darkModeToggle = document.getElementById('darkModeToggle');
  function setDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', '1');
      darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', '0');
      darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }
  // Initial state
  setDarkMode(localStorage.getItem('darkMode') === '1');
  darkModeToggle.addEventListener('click', function() {
    setDarkMode(!document.body.classList.contains('dark-mode'));
  });

  // --- Responsive: update last updated timestamp every minute ---
  setInterval(() => {
    dashboardData.last_updated = new Date();
    document.getElementById('lastUpdatedTime').textContent = dashboardData.last_updated.toLocaleTimeString();
  }, 60000);
});

// Optional: Add dark mode CSS in style.css for .dark-mode body, cards, etc. 