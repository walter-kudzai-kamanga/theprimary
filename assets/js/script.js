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

  // --- Student Management ---
  // Student Management JS
  const studentForm = document.getElementById('studentForm');
  const regNoInput = document.getElementById('studentRegNo');
  const studentsTable = document.getElementById('studentsTable').querySelector('tbody');
  const searchInput = document.getElementById('searchInput');
  const pagination = document.getElementById('pagination');
  const toastMsg = document.getElementById('toastMsg');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const studentDetailModal = new bootstrap.Modal(document.getElementById('studentDetailModal'));
  const studentDetailContent = document.getElementById('studentDetailContent');
  const selectAll = document.getElementById('selectAll');
  const exportBtn = document.getElementById('exportBtn');
  const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');

  let students = JSON.parse(localStorage.getItem('students') || '[]');
  let editIndex = null;
  let currentPage = 1;
  const pageSize = 5;

  function generateRegNo() {
    const year = new Date().getFullYear();
    let lastNum = parseInt(localStorage.getItem('lastRegNum') || '0', 10) + 1;
    localStorage.setItem('lastRegNum', lastNum);
    return `SCH-${year}-${String(lastNum).padStart(6, '0')}`;
  }

  function showToast(message, type = 'primary') {
    toastMsg.className = `toast align-items-center text-bg-${type} border-0`;
    toastMsg.querySelector('.toast-body').textContent = message;
    const toast = new bootstrap.Toast(toastMsg);
    toast.show();
  }

  function resetForm() {
    studentForm.reset();
    regNoInput.value = generateRegNo();
    editIndex = null;
  }

  function getStatusBadge(student) {
    let status = student.status || 'Active';
    let badge = 'success';
    if (student.feesDue) badge = 'warning';
    if (student.inactive) badge = 'secondary';
    return `<span class="badge bg-${badge} badge-status">${status}${student.feesDue ? ' (Fees Due)' : ''}</span>`;
  }

  function renderTable() {
    let filtered = students.filter(s => {
      const q = searchInput.value.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.regNo.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q)
      );
    });
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filtered.slice(start, end);
    studentsTable.innerHTML = pageData.map((s, i) => `
      <tr>
        <td><input type="checkbox" class="row-select" data-index="${students.indexOf(s)}"></td>
        <td><img src="${s.photo || 'https://via.placeholder.com/40'}" class="profile-photo" alt="Photo"></td>
        <td>${s.regNo}</td>
        <td>${s.name}</td>
        <td>${s.className}</td>
        <td>${getStatusBadge(s)}</td>
        <td>
          <button class="btn btn-sm btn-info me-1 view-btn" data-index="${students.indexOf(s)}">View</button>
          <button class="btn btn-sm btn-warning me-1 edit-btn" data-index="${students.indexOf(s)}">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn" data-index="${students.indexOf(s)}">Delete</button>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="7" class="text-center">No students found.</td></tr>';
    // Pagination
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `<li class="page-item${i === currentPage ? ' active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
    }
  }

  function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('studentName').value.trim();
    const dob = document.getElementById('studentDOB').value;
    const className = document.getElementById('studentClass').value;
    const regNo = regNoInput.value;
    const photoFile = document.getElementById('studentPhoto').files[0];
    const birthCertFile = document.getElementById('studentBirthCert').files[0];
    const reportCardFile = document.getElementById('studentReportCard').files[0];

    const readerPromises = [];
    if (photoFile) {
      readerPromises.push(fileToDataUrl(photoFile));
    } else {
      readerPromises.push(Promise.resolve(''));
    }
    if (birthCertFile) {
      readerPromises.push(fileToDataUrl(birthCertFile));
    } else {
      readerPromises.push(Promise.resolve(''));
    }
    if (reportCardFile) {
      readerPromises.push(fileToDataUrl(reportCardFile));
    } else {
      readerPromises.push(Promise.resolve(''));
    }

    Promise.all(readerPromises).then(([photo, birthCert, reportCard]) => {
      const student = {
        name,
        dob,
        className,
        regNo,
        photo,
        birthCert,
        reportCard,
        status: 'Active',
        feesDue: Math.random() < 0.3, // Randomly assign fees due for demo
        inactive: false,
        attendance: Math.floor(Math.random() * 100), // Random attendance %
        tests: [
          { subject: 'Math', score: Math.floor(Math.random() * 100) },
          { subject: 'English', score: Math.floor(Math.random() * 100) }
        ]
      };
      if (editIndex !== null) {
        students[editIndex] = { ...students[editIndex], ...student };
        showToast('Student updated!', 'success');
      } else {
        students.push(student);
        showToast('Student added!', 'success');
      }
      saveStudents();
      renderTable();
      resetForm();
    });
  }

  function fileToDataUrl(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  function handleTableClick(e) {
    const idx = e.target.dataset.index;
    if (e.target.classList.contains('edit-btn')) {
      const s = students[idx];
      document.getElementById('studentName').value = s.name;
      document.getElementById('studentDOB').value = s.dob;
      document.getElementById('studentClass').value = s.className;
      regNoInput.value = s.regNo;
      editIndex = parseInt(idx, 10);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (e.target.classList.contains('delete-btn')) {
      if (confirm('Delete this student?')) {
        students.splice(idx, 1);
        saveStudents();
        renderTable();
        showToast('Student deleted!', 'danger');
      }
    } else if (e.target.classList.contains('view-btn')) {
      showStudentDetail(idx);
    }
  }

  function showStudentDetail(idx) {
    const s = students[idx];
    studentDetailContent.innerHTML = `
      <div class="row">
        <div class="col-md-4 text-center">
          <img src="${s.photo || 'https://via.placeholder.com/100'}" class="profile-photo mb-2" style="width:100px;height:100px;">
          <h5>${s.name}</h5>
          <div>${s.regNo}</div>
          <div>${getStatusBadge(s)}</div>
        </div>
        <div class="col-md-8">
          <ul class="list-group mb-2">
            <li class="list-group-item"><strong>Class:</strong> ${s.className}</li>
            <li class="list-group-item"><strong>Date of Birth:</strong> ${s.dob}</li>
            <li class="list-group-item"><strong>Attendance:</strong> ${s.attendance || 0}%</li>
            <li class="list-group-item"><strong>Fees:</strong> ${s.feesDue ? '<span class=\'text-danger\'>Due</span>' : '<span class=\'text-success\'>Paid</span>'}</li>
          </ul>
          <h6>Test Records</h6>
          <ul class="list-group mb-2">
            ${s.tests.map(t => `<li class="list-group-item">${t.subject}: ${t.score}</li>`).join('')}
          </ul>
          <h6>Documents</h6>
          <ul class="list-group">
            <li class="list-group-item">Birth Certificate: ${s.birthCert ? `<a href="${s.birthCert}" download>Download</a>` : 'N/A'}</li>
            <li class="list-group-item">Report Card: ${s.reportCard ? `<a href="${s.reportCard}" download>Download</a>` : 'N/A'}</li>
          </ul>
        </div>
      </div>
    `;
    studentDetailModal.show();
  }

  function handleSearch() {
    currentPage = 1;
    renderTable();
  }

  function handlePagination(e) {
    if (e.target.tagName === 'A') {
      currentPage = parseInt(e.target.textContent, 10);
      renderTable();
    }
  }

  function handleSelectAll(e) {
    document.querySelectorAll('.row-select').forEach(cb => {
      cb.checked = e.target.checked;
    });
  }

  function handleBulkDelete() {
    const selected = Array.from(document.querySelectorAll('.row-select:checked')).map(cb => parseInt(cb.dataset.index, 10));
    if (selected.length && confirm('Delete selected students?')) {
      students = students.filter((_, i) => !selected.includes(i));
      saveStudents();
      renderTable();
      showToast('Selected students deleted!', 'danger');
    }
  }

  function handleExport() {
    const csv = [
      ['Reg No', 'Name', 'Class', 'Status', 'Attendance', 'Fees Due'],
      ...students.map(s => [s.regNo, s.name, s.className, s.status, s.attendance, s.feesDue ? 'Yes' : 'No'])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDarkModeToggle() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  }

  function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
  }

  // Event Listeners
  studentForm.addEventListener('submit', handleFormSubmit);
  studentsTable.parentElement.addEventListener('click', handleTableClick);
  searchInput.addEventListener('input', handleSearch);
  pagination.addEventListener('click', handlePagination);
  selectAll.addEventListener('change', handleSelectAll);
  bulkDeleteBtn.addEventListener('click', handleBulkDelete);
  exportBtn.addEventListener('click', handleExport);
  darkModeToggle.addEventListener('click', handleDarkModeToggle);

  document.addEventListener('DOMContentLoaded', () => {
    resetForm();
    renderTable();
    loadDarkMode();
  });

  // --- Student Registration/Profile Advanced Features ---

  document.addEventListener('DOMContentLoaded', function() {
    // --- Student Data Management ---
    let students = JSON.parse(localStorage.getItem('students') || '[]');
    let editIndex = null;

    // QR Code Generation
    const regNoInput = document.getElementById('studentRegNo');
    const qrCodeDiv = document.getElementById('qrCode');
    let qr;
    function updateQRCode() {
      if (!qr) qr = new QRious({ element: document.createElement('canvas'), size: 80 });
      qr.value = regNoInput.value;
      qrCodeDiv.innerHTML = '';
      qrCodeDiv.appendChild(qr.element);
    }

    // Webcam Photo Capture
    const webcamBtn = document.getElementById('webcamBtn');
    const webcam = document.getElementById('webcam');
    const webcamPreview = document.getElementById('webcamPreview');
    let stream;
    webcamBtn.addEventListener('click', function() {
      if (webcam.style.display === 'none') {
        navigator.mediaDevices.getUserMedia({ video: true }).then(s => {
          stream = s;
          webcam.srcObject = stream;
          webcam.style.display = 'block';
          webcamPreview.style.display = 'none';
        });
      } else {
        // Capture
        const canvas = document.createElement('canvas');
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        canvas.getContext('2d').drawImage(webcam, 0, 0);
        webcamPreview.src = canvas.toDataURL('image/png');
        webcamPreview.style.display = 'block';
        webcam.style.display = 'none';
        stream.getTracks().forEach(track => track.stop());
      }
    });

    // Drag-and-drop Portfolio Upload
    const portfolioDrop = document.getElementById('portfolioDrop');
    const portfolioFiles = document.getElementById('portfolioFiles');
    const portfolioList = document.getElementById('portfolioList');
    portfolioDrop.addEventListener('click', () => portfolioFiles.click());
    portfolioDrop.addEventListener('dragover', e => { e.preventDefault(); portfolioDrop.classList.add('dragover'); });
    portfolioDrop.addEventListener('dragleave', e => { e.preventDefault(); portfolioDrop.classList.remove('dragover'); });
    portfolioDrop.addEventListener('drop', e => {
      e.preventDefault();
      portfolioDrop.classList.remove('dragover');
      portfolioFiles.files = e.dataTransfer.files;
      renderPortfolioList();
    });
    portfolioFiles.addEventListener('change', renderPortfolioList);
    function renderPortfolioList() {
      portfolioList.innerHTML = Array.from(portfolioFiles.files).map(f => `<div><i class="fa fa-file"></i> ${f.name}</div>`).join('');
    }

    // Birthday & Document Expiry Alerts
    function checkAlerts(student) {
      const birthdayAlert = document.getElementById('birthdayAlert');
      const docExpiryAlert = document.getElementById('docExpiryAlert');
      const missingDocAlert = document.getElementById('missingDocAlert');
      birthdayAlert.innerHTML = '';
      docExpiryAlert.innerHTML = '';
      missingDocAlert.innerHTML = '';
      if (!student) return;
      // Birthday
      const dob = new Date(student.dob);
      const today = new Date();
      if (dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth()) {
        birthdayAlert.innerHTML = `<div class="alert alert-info">🎂 Today is ${student.name}'s birthday!</div>`;
      }
      // Document Expiry
      const soon = d => d && (new Date(d) - today < 1000*60*60*24*30) && (new Date(d) > today);
      if (soon(student.birthCertExpiry)) {
        docExpiryAlert.innerHTML += `<div class="alert alert-warning">Birth Certificate expiring soon!</div>`;
      }
      if (soon(student.passportExpiry)) {
        docExpiryAlert.innerHTML += `<div class="alert alert-warning">Passport expiring soon!</div>`;
      }
      // Missing Docs
      if (!student.birthCert) missingDocAlert.innerHTML += `<div class="alert alert-danger">Birth Certificate missing!</div>`;
      if (!student.passport) missingDocAlert.innerHTML += `<div class="alert alert-danger">Passport missing!</div>`;
    }

    // Performance Heatmap (Demo)
    function renderHeatmap(scores) {
      const heatmap = document.getElementById('performanceHeatmap');
      if (!scores) { heatmap.innerHTML = '<div class="text-muted">No data</div>'; return; }
      heatmap.innerHTML = Object.entries(scores).map(([subj, val]) => {
        let color = val > 80 ? '#43a047' : val > 60 ? '#fbc02d' : '#e53935';
        return `<span class="heatmap-cell" style="background:${color}">${val}</span> <span>${subj}</span>`;
      }).join('<br>');
    }

    // Timeline & Audit Log
    function renderTimeline(timeline) {
      const timelineDiv = document.getElementById('studentTimeline');
      if (!timeline || !timeline.length) { timelineDiv.innerHTML = '<div class="text-muted">No events yet.</div>'; return; }
      timelineDiv.innerHTML = timeline.map(ev => `<div class="timeline-event"><div><b>${ev.event}</b></div><div class="date">${ev.date}</div></div>`).join('');
    }
    function renderAuditLog(audit) {
      const auditDiv = document.getElementById('auditLog');
      if (!audit || !audit.length) { auditDiv.innerHTML = '<div class="text-muted">No changes yet.</div>'; return; }
      auditDiv.innerHTML = audit.map(log => `<div>${log.date}: <b>${log.action}</b> by ${log.user}</div>`).join('');
    }

    // Survey Demo
    document.getElementById('surveyLink').addEventListener('click', function() {
      document.getElementById('surveyResults').innerHTML = '<div class="alert alert-success">Thank you for your feedback! (Demo)</div>';
    });

    // Integrations (Demo)
    document.getElementById('smsBtn').addEventListener('click', () => alert('SMS sent! (Demo)'));
    document.getElementById('whatsappBtn').addEventListener('click', () => alert('WhatsApp message sent! (Demo)'));
    document.getElementById('driveBtn').addEventListener('click', () => alert('Google Drive sync complete! (Demo)'));
    document.getElementById('biometricBtn').addEventListener('click', () => alert('Biometric scan complete! (Demo)'));

    // Student List Rendering
    const studentsTable = document.getElementById('studentsTable').querySelector('tbody');
    function renderStudentList() {
      studentsTable.innerHTML = students.map((s, i) => `
        <tr>
          <td>${s.regNo}</td>
          <td>${s.name}</td>
          <td>${s.className}</td>
          <td>${s.guardian.name} (${s.guardian.relation})</td>
          <td>
            <button class="btn btn-sm btn-info view-btn" data-index="${i}">View</button>
            <button class="btn btn-sm btn-warning edit-btn" data-index="${i}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-index="${i}">Delete</button>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="5" class="text-center">No students found.</td></tr>';
    }

    // Student Detail Modal
    const studentDetailModal = new bootstrap.Modal(document.getElementById('studentDetailModal'));
    const studentDetailContent = document.getElementById('studentDetailContent');
    function showStudentDetail(idx) {
      const s = students[idx];
      studentDetailContent.innerHTML = `
        <div class="row">
          <div class="col-md-4 text-center">
            <div class="qr-code"></div>
            <h5>${s.name}</h5>
            <div>${s.regNo}</div>
            <div><b>Class:</b> ${s.className}</div>
            <div><b>Gender:</b> ${s.gender}</div>
          </div>
          <div class="col-md-8">
            <ul class="list-group mb-2">
              <li class="list-group-item"><strong>Guardian:</strong> ${s.guardian.name} (${s.guardian.relation}), ${s.guardian.contact}, ${s.guardian.occupation}</li>
              <li class="list-group-item"><strong>Health:</strong> Allergies: ${s.health.allergies}, Immunizations: ${s.health.immunizations}, Conditions: ${s.health.conditions}</li>
              <li class="list-group-item"><strong>Subjects:</strong> ${s.subjects.join(', ')}</li>
              <li class="list-group-item"><strong>ILP:</strong> ${s.ilp}</li>
              <li class="list-group-item"><strong>Birth Cert Expiry:</strong> ${s.birthCertExpiry || 'N/A'}</li>
              <li class="list-group-item"><strong>Passport Expiry:</strong> ${s.passportExpiry || 'N/A'}</li>
            </ul>
            <h6>Timeline</h6>
            <div class="timeline">${s.timeline.map(ev => `<div class="timeline-event"><div><b>${ev.event}</b></div><div class="date">${ev.date}</div></div>`).join('')}</div>
            <h6 class="mt-3">Audit Log</h6>
            <div class="audit-log">${s.audit.map(log => `<div>${log.date}: <b>${log.action}</b> by ${log.user}</div>`).join('')}</div>
          </div>
        </div>
      `;
      // Render QR code in modal
      const qrDiv = studentDetailContent.querySelector('.qr-code');
      const qrModal = new QRious({ element: document.createElement('canvas'), size: 80, value: s.regNo });
      qrDiv.appendChild(qrModal.element);
      studentDetailModal.show();
    }

    // Table actions
    studentsTable.parentElement.addEventListener('click', function(e) {
      const idx = e.target.dataset.index;
      if (e.target.classList.contains('view-btn')) {
        showStudentDetail(idx);
      } else if (e.target.classList.contains('edit-btn')) {
        loadStudent(idx);
        editIndex = idx;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.target.classList.contains('delete-btn')) {
        if (confirm('Delete this student?')) {
          students.splice(idx, 1);
          localStorage.setItem('students', JSON.stringify(students));
          renderStudentList();
        }
      }
    });

    // Save Student (Add/Edit)
    document.getElementById('studentForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const student = {
        name: document.getElementById('studentName').value,
        dob: document.getElementById('studentDOB').value,
        gender: document.getElementById('studentGender').value,
        className: document.getElementById('studentClass').value,
        regNo: regNoInput.value,
        guardian: {
          name: document.getElementById('guardianName').value,
          relation: document.getElementById('guardianRelation').value,
          contact: document.getElementById('guardianContact').value,
          occupation: document.getElementById('guardianOccupation').value
        },
        health: {
          allergies: document.getElementById('allergies').value,
          immunizations: document.getElementById('immunizations').value,
          conditions: document.getElementById('conditions').value
        },
        ilp: document.getElementById('ilp').value,
        subjects: Array.from(document.getElementById('subjectEnrollment').selectedOptions).map(o => o.value),
        birthCertExpiry: document.getElementById('birthCertExpiry').value,
        passportExpiry: document.getElementById('passportExpiry').value,
        timeline: [{ event: editIndex === null ? 'Registered' : 'Updated', date: new Date().toLocaleString() }],
        audit: [{ action: editIndex === null ? 'Created' : 'Updated', user: 'Admin', date: new Date().toLocaleString() }],
        scores: { Math: 85, English: 72, Science: 90, History: 60, Art: 95 }, // Demo
        birthCert: document.getElementById('birthCert').files[0] ? document.getElementById('birthCert').files[0].name : '',
        passport: document.getElementById('passport').files[0] ? document.getElementById('passport').files[0].name : ''
      };
      if (editIndex !== null) {
        students[editIndex] = { ...students[editIndex], ...student };
        editIndex = null;
      } else {
        students.push(student);
      }
      localStorage.setItem('students', JSON.stringify(students));
      renderStudentList();
      resetForm();
      alert('Student saved!');
    });

    // Reset form and reg number
    function resetForm() {
      document.getElementById('studentForm').reset();
      regNoInput.value = generateRegNo();
      updateQRCode();
      editIndex = null;
    }

    // Load student for editing
    function loadStudent(idx) {
      const student = students[idx];
      document.getElementById('studentName').value = student.name;
      document.getElementById('studentDOB').value = student.dob;
      document.getElementById('studentGender').value = student.gender;
      document.getElementById('studentClass').value = student.className;
      regNoInput.value = student.regNo;
      document.getElementById('guardianName').value = student.guardian.name;
      document.getElementById('guardianRelation').value = student.guardian.relation;
      document.getElementById('guardianContact').value = student.guardian.contact;
      document.getElementById('guardianOccupation').value = student.guardian.occupation;
      document.getElementById('allergies').value = student.health.allergies;
      document.getElementById('immunizations').value = student.health.immunizations;
      document.getElementById('conditions').value = student.health.conditions;
      document.getElementById('ilp').value = student.ilp;
      for (let opt of document.getElementById('subjectEnrollment').options) {
        opt.selected = student.subjects.includes(opt.value);
      }
      document.getElementById('birthCertExpiry').value = student.birthCertExpiry;
      document.getElementById('passportExpiry').value = student.passportExpiry;
      updateQRCode();
      renderPortfolioList();
    }

    // Generate reg number on load
    function generateRegNo() {
      const year = new Date().getFullYear();
      let lastNum = parseInt(localStorage.getItem('lastRegNum') || '0', 10) + 1;
      localStorage.setItem('lastRegNum', lastNum);
      return `SCH-${year}-${String(lastNum).padStart(6, '0')}`;
    }
    if (!regNoInput.value) regNoInput.value = generateRegNo();
    updateQRCode();
    renderStudentList();
  });
});

// Optional: Add dark mode CSS in style.css for .dark-mode body, cards, etc. 