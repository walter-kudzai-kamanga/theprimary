// script.js - SchoolMS Modern Dashboard Interactivity

document.addEventListener('DOMContentLoaded', function() {
  // --- Personalization ---
  const user = {
    name: 'Walter Kamanga',
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

  // === STAFF & HR MODULE DUMMY DATA ===
  if (document.getElementById('staffTable')) {
    // Dummy data arrays
    let staffList = [
      { name: 'Alice Johnson', role: 'Teacher', subject: 'Math', schedule: 'Mon-Fri 8am-4pm' },
      { name: 'Brian Lee', role: 'Admin', subject: '', schedule: 'Mon-Fri 9am-5pm' },
      { name: 'Cynthia Smith', role: 'Teacher', subject: 'English', schedule: 'Mon-Fri 8am-4pm' }
    ];
    let payrollList = [
      { staff: 'Alice Johnson', grade: 'A', allowances: 200, tax: 150, pension: 100, net: 1750 },
      { staff: 'Brian Lee', grade: 'B', allowances: 100, tax: 120, pension: 80, net: 1420 },
      { staff: 'Cynthia Smith', grade: 'A', allowances: 180, tax: 140, pension: 90, net: 1700 }
    ];
    let attendanceList = [
      { date: '2024-06-01', checkin: '08:01', checkout: '16:00', location: 'On-site', status: 'Present' },
      { date: '2024-06-02', checkin: '08:05', checkout: '16:02', location: 'On-site', status: 'Present' },
      { date: '2024-06-03', checkin: '', checkout: '', location: '', status: 'Absent' }
    ];
    let leaveList = [
      { type: 'Sick Leave', from: '2024-06-10', to: '2024-06-12', status: 'Approved' },
      { type: 'Annual Leave', from: '2024-07-01', to: '2024-07-10', status: 'Pending' }
    ];

    // Track edit state for staff
    let staffEditIndex = null;

    // Render Staff Table
    function renderStaffTable() {
      const tbody = document.querySelector('#staffTable tbody');
      tbody.innerHTML = staffList.map((s, i) => `
        <tr>
          <td>${s.name}</td>
          <td>${s.role}</td>
          <td>${s.subject}</td>
          <td>${s.schedule}</td>
          <td><button class="btn btn-sm btn-warning edit-staff" data-index="${i}">Edit</button> <button class="btn btn-sm btn-danger delete-staff" data-index="${i}">Delete</button></td>
        </tr>
      `).join('');
    }

    // Render Payroll Table
    function renderPayrollTable() {
      if (document.querySelector('#payroll tbody')) {
        const tbody = document.querySelector('#payroll tbody');
        tbody.innerHTML = payrollList.map(p => `
          <tr>
            <td>${p.staff}</td>
            <td>${p.grade}</td>
            <td>${p.allowances}</td>
            <td>${p.tax}</td>
            <td>${p.pension}</td>
            <td>${p.net}</td>
            <td><button class="btn btn-sm btn-info">Payslip</button></td>
          </tr>
        `).join('');
      }
    }

    // Render Attendance Table
    function renderAttendanceTable() {
      if (document.querySelector('#attendance tbody')) {
        const tbody = document.querySelector('#attendance tbody');
        tbody.innerHTML = attendanceList.map(a => `
          <tr>
            <td>${a.date}</td>
            <td>${a.checkin}</td>
            <td>${a.checkout}</td>
            <td>${a.location}</td>
            <td>${a.status}</td>
          </tr>
        `).join('');
      }
    }

    // Render Leave Table
    function renderLeaveTable() {
      if (document.querySelector('#leave tbody')) {
        const tbody = document.querySelector('#leave tbody');
        tbody.innerHTML = leaveList.map((l, i) => `
          <tr>
            <td>${l.type}</td>
            <td>${l.from}</td>
            <td>${l.to}</td>
            <td>${l.status}</td>
            <td><button class="btn btn-sm btn-danger delete-leave" data-index="${i}">Delete</button></td>
          </tr>
        `).join('');
      }
    }

    // Initial render
    renderStaffTable();
    renderPayrollTable();
    renderAttendanceTable();
    renderLeaveTable();

    // Re-render tables on tab show
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
      link.addEventListener('shown.bs.tab', function(e) {
        renderStaffTable();
        renderPayrollTable();
        renderAttendanceTable();
        renderLeaveTable();
      });
    });

    // Add/Edit Staff
    const staffForm = document.getElementById('staffForm');
    // Add reset button if not present
    if (!document.getElementById('resetStaffForm')) {
      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'btn btn-secondary ms-2';
      resetBtn.id = 'resetStaffForm';
      resetBtn.textContent = 'Reset';
      staffForm.appendChild(resetBtn);
      resetBtn.addEventListener('click', function() {
        staffForm.reset();
        staffEditIndex = null;
      });
    }
    staffForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('staffName').value;
      const role = document.getElementById('staffRole').value;
      const subject = document.getElementById('staffSubject').value;
      const schedule = document.getElementById('staffSchedule').value;
      if (staffEditIndex !== null) {
        staffList[staffEditIndex] = { name, role, subject, schedule };
        staffEditIndex = null;
      } else {
        staffList.push({ name, role, subject, schedule });
      }
      renderStaffTable();
      this.reset();
    });
    document.querySelector('#staffTable tbody').addEventListener('click', function(e) {
      const idx = e.target.dataset.index;
      if (e.target.classList.contains('delete-staff')) {
        staffList.splice(idx, 1);
        renderStaffTable();
      } else if (e.target.classList.contains('edit-staff')) {
        // Populate form for editing
        const s = staffList[idx];
        document.getElementById('staffName').value = s.name;
        document.getElementById('staffRole').value = s.role;
        document.getElementById('staffSubject').value = s.subject;
        document.getElementById('staffSchedule').value = s.schedule;
        staffEditIndex = parseInt(idx, 10);
      }
    });

    // Add Leave
    if (document.getElementById('leaveForm')) {
      document.getElementById('leaveForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const type = this.querySelector('select').value;
        const dates = this.querySelectorAll('input[type="date"]');
        const from = dates[0].value;
        const to = dates[1].value;
        leaveList.push({ type, from, to, status: 'Pending' });
        renderLeaveTable();
        this.reset();
      });
      document.querySelector('#leave tbody').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-leave')) {
          const idx = e.target.dataset.index;
          leaveList.splice(idx, 1);
          renderLeaveTable();
        }
      });
    }
  }

  // --- Attendance Page JS Mockup ---

  document.addEventListener('DOMContentLoaded', function() {
    // Notification/Alert Area
    const notificationArea = document.getElementById('notificationArea');
    function showNotification(msg, type = 'info') {
      notificationArea.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${msg}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
    }

    // Filter controls (dummy handlers)
    document.getElementById('filterClass').addEventListener('change', () => showNotification('Class filter applied'));
    document.getElementById('filterDate').addEventListener('change', () => showNotification('Date filter applied'));
    document.getElementById('filterSession').addEventListener('change', () => showNotification('Session filter applied'));
    document.getElementById('filterGender').addEventListener('change', () => showNotification('Gender filter applied'));
    document.getElementById('searchStudent').addEventListener('input', () => showNotification('Search applied'));

    // Bulk actions (dummy handlers)
    document.getElementById('markAllPresent').addEventListener('click', () => showNotification('All marked present', 'success'));
    document.getElementById('markAllAbsent').addEventListener('click', () => showNotification('All marked absent', 'danger'));
    document.getElementById('markAllLate').addEventListener('click', () => showNotification('All marked late', 'warning'));
    document.getElementById('bulkActions').addEventListener('click', () => showNotification('Bulk actions menu (to be implemented)'));

    // Export buttons (dummy handlers)
    document.getElementById('btnExportPDF').addEventListener('click', () => showNotification('Export to PDF (to be implemented)'));
    document.getElementById('btnExportCSV').addEventListener('click', () => showNotification('Export to CSV (to be implemented)'));

    // Analytics, Calendar, Audit Log (dummy handlers)
    document.getElementById('openAnalytics').addEventListener('click', () => showNotification('Analytics dashboard (to be implemented)'));
    document.getElementById('openCalendar').addEventListener('click', () => showNotification('Calendar view (to be implemented)'));
    document.getElementById('openAuditLog').addEventListener('click', () => showNotification('Audit log (to be implemented)'));

    // Leave/Excuse Modal (dummy handler)
    const leaveForm = document.getElementById('leaveForm');
    if (leaveForm) {
      leaveForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Leave/Excuse submitted (to be implemented)', 'info');
        const leaveModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('leaveModal'));
        leaveModal.hide();
        leaveForm.reset();
      });
    }

    // --- Placeholders for dynamic features ---
    // TODO: Load attendance data via AJAX/fetch
    // TODO: Render analytics dashboard (Chart.js)
    // TODO: Render calendar/timeline (FullCalendar or similar)
    // TODO: Render audit/history log
    // TODO: Role-based UI logic
    // TODO: Offline mode support
  });

  // --- Lesson Planning Module JS Scaffold ---
  // This file handles all dynamic features for lessons.html

  // ========== AI Plan Drafting & Smart Suggestions ==========
  document.getElementById('aiDraftBtn')?.addEventListener('click', function() {
    // TODO: Integrate AI plan drafting (call backend/AI API)
    document.getElementById('aiSuggestionResult').textContent = 'AI draft feature coming soon!';
  });

  // ========== Curriculum Mapping & Auto-Suggest ==========
  document.getElementById('lessonSubject')?.addEventListener('input', function(e) {
    // TODO: Auto-suggest standards/objectives based on subject/topic
    document.getElementById('suggestedObjectives').textContent = 'Suggested: [Sample Objective]';
  });

  // ========== Template Library ==========
  document.getElementById('saveTemplateBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    // TODO: Save current form as template (localStorage or backend)
    alert('Template saved (stub)!');
  });
  document.getElementById('lessonTemplate')?.addEventListener('change', function(e) {
    // TODO: Load selected template into form
    alert('Template loaded (stub)!');
  });

  // ========== Calendar View (Drag & Drop, Sync) ==========
  document.getElementById('syncCalendarBtn')?.addEventListener('click', function() {
    // TODO: Sync with academic calendar (fetch events/holidays)
    alert('Calendar sync feature coming soon!');
  });
  // TODO: Implement drag & drop for #calendarView (use a calendar library or custom logic)

  // ========== Lesson Plan CRUD ==========
  document.getElementById('lessonForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // TODO: Save lesson plan (to backend or localStorage)
    alert('Lesson plan saved (stub)!');
    // TODO: Refresh lessons table
  });

  // ========== Collaborative Planning & Comments ==========
  document.getElementById('collabCommentForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // TODO: Add comment to collaborative thread (backend or localStorage)
    const input = document.getElementById('collabCommentInput');
    if (input.value.trim()) {
      const commentDiv = document.createElement('div');
      commentDiv.textContent = input.value;
      document.getElementById('collabComments').appendChild(commentDiv);
      input.value = '';
    }
  });

  // ========== Interactive Content & Resource Embeds ==========
  document.getElementById('embedResourceBtn')?.addEventListener('click', function() {
    const modal = new bootstrap.Modal(document.getElementById('embedResourceModal'));
    modal.show();
  });
  document.getElementById('addEmbedBtn')?.addEventListener('click', function() {
    const url = document.getElementById('embedResourceUrl').value;
    if (url) {
      // TODO: Validate and embed resource (iframe or link)
      const embedDiv = document.createElement('div');
      embedDiv.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
      document.getElementById('embeddedResources').appendChild(embedDiv);
      document.getElementById('embedResourceUrl').value = '';
      bootstrap.Modal.getInstance(document.getElementById('embedResourceModal')).hide();
    }
  });

  // ========== Resource Tagging & Search ==========
  document.getElementById('searchMaterialsBtn')?.addEventListener('click', function() {
    const modal = new bootstrap.Modal(document.getElementById('searchMaterialsModal'));
    modal.show();
  });
  document.getElementById('searchMaterialsInput')?.addEventListener('input', function(e) {
    // TODO: Implement fast in-system search for materials
    document.getElementById('searchMaterialsResults').textContent = 'Search results coming soon!';
  });

  // ========== Progress & Analytics ==========
  // TODO: Render coverage and time-on-topic charts (use Chart.js or similar)
  document.getElementById('coverageChart').textContent = 'Coverage chart coming soon!';
  document.getElementById('timeOnTopicChart').textContent = 'Time-on-topic chart coming soon!';
  // TODO: Show alerts for under-covered areas

  document.getElementById('coverageAlerts').textContent = '';

  // ========== Evidence of Delivery ==========
  document.getElementById('evidenceForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // TODO: Upload evidence files (photos, work, etc.)
    alert('Evidence uploaded (stub)!');
  });

  // ========== Approval, Feedback, Version History ==========
  document.getElementById('feedbackForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    // TODO: Submit feedback (to backend or localStorage)
    const feedback = document.getElementById('feedbackInput').value;
    if (feedback.trim()) {
      const feedbackDiv = document.createElement('div');
      feedbackDiv.textContent = feedback;
      document.getElementById('feedbackList').appendChild(feedbackDiv);
      document.getElementById('feedbackInput').value = '';
    }
  });
  document.getElementById('viewVersionHistoryBtn')?.addEventListener('click', function() {
    // TODO: Show version history modal or section
    alert('Version history feature coming soon!');
  });
  document.getElementById('revertVersionBtn')?.addEventListener('click', function() {
    // TODO: Revert to previous version
    alert('Revert feature coming soon!');
  });

  // ========== Dashboard & Reports ==========
  document.getElementById('exportReportBtn')?.addEventListener('click', function() {
    // TODO: Export dashboard/report to PDF or Excel
    alert('Export feature coming soon!');
  });
})
  // ========== Smart Suggestions (AI Resource Suggestions) ==========
  // TODO: Implement AI-assisted resource suggestions based on topic

  // ========== Gap Detection (AI) ==========
  // TODO: Highlight topics skipped or insufficiently covered

  // ========== Utility Functions ==========
  // Add any utility/helper functions here

  // --- End Lesson Planning Module JS Scaffold --- 

// --- Homework Module Full Implementation ---
// DEMO: User roles (change as needed)
const DEMO_USER = { id: 1, name: 'Jordan Smith', role: 'Teacher', class: 'Class A', subjects: ['Math', 'English'] };

// Data Models
let homeworkAssignments = JSON.parse(localStorage.getItem('homeworkAssignments') || '[]');
let homeworkSubmissions = JSON.parse(localStorage.getItem('homeworkSubmissions') || '[]');
let homeworkAuditLog = JSON.parse(localStorage.getItem('homeworkAuditLog') || '[]');
let users = JSON.parse(localStorage.getItem('users') || '[]'); // For role-based access

// Utility: Save all
function saveHomeworkData() {
  localStorage.setItem('homeworkAssignments', JSON.stringify(homeworkAssignments));
  localStorage.setItem('homeworkSubmissions', JSON.stringify(homeworkSubmissions));
  localStorage.setItem('homeworkAuditLog', JSON.stringify(homeworkAuditLog));
}

// --- Assignment CRUD ---
function renderHomeworkTable() {
  const tbody = document.querySelector('#homeworkTable tbody');
  const filterSubject = document.getElementById('filterSubject').value;
  const filterClass = document.getElementById('filterClass').value;
  const filterStatus = document.getElementById('filterStatus').value;
  let filtered = homeworkAssignments.filter(hw => {
    let match = true;
    if (filterSubject && hw.subject !== filterSubject) match = false;
    if (filterClass && hw.class !== filterClass) match = false;
    return match;
  });
  // Status filter
  if (filterStatus !== 'all') {
    filtered = filtered.filter(hw => {
      const subs = homeworkSubmissions.filter(s => s.assignmentId === hw.id);
      if (filterStatus === 'submitted') return subs.length > 0;
      if (filterStatus === 'not_submitted') return subs.length === 0;
      if (filterStatus === 'late') return subs.some(s => new Date(s.submittedAt) > new Date(hw.due));
      return true;
    });
  }
  document.getElementById('assignmentCount').textContent = filtered.length;
  tbody.innerHTML = filtered.map(hw => `
    <tr>
      <td>${hw.subject}</td>
      <td>${hw.class}</td>
      <td>${hw.title}</td>
      <td>${new Date(hw.due).toLocaleString()}</td>
      <td><span class="badge bg-${hw.difficulty === 'Easy' ? 'success' : hw.difficulty === 'Medium' ? 'warning' : 'danger'}">${hw.difficulty}</span></td>
      <td>${getAssignmentStatus(hw)}</td>
      <td>${hw.urgent ? '<span class="badge bg-danger">Urgent</span>' : ''}</td>
      <td>
        <button class="btn btn-sm btn-info me-1" onclick="openAssignmentDetail('${hw.id}')">View</button>
        ${DEMO_USER.role === 'Teacher' ? `<button class="btn btn-sm btn-warning me-1" onclick="openHomeworkModal('${hw.id}')">Edit</button><button class="btn btn-sm btn-danger" onclick="deleteAssignment('${hw.id}')">Delete</button>` : ''}
      </td>
    </tr>
  `).join('') || '<tr><td colspan="8" class="text-center">No assignments found.</td></tr>';
}
function getAssignmentStatus(hw) {
  const subs = homeworkSubmissions.filter(s => s.assignmentId === hw.id);
  if (!subs.length) return '<span class="badge bg-secondary">Not Submitted</span>';
  if (subs.some(s => new Date(s.submittedAt) > new Date(hw.due))) return '<span class="badge bg-danger">Late</span>';
  return '<span class="badge bg-success">Submitted</span>';
}
function openHomeworkModal(editId = null) {
  const modal = new bootstrap.Modal(document.getElementById('homeworkModal'));
  const form = document.getElementById('homeworkForm');
  form.reset();
  document.getElementById('aiSuggestion').textContent = '';
  if (editId) {
    const hw = homeworkAssignments.find(h => h.id === editId);
    document.getElementById('hwSubject').value = hw.subject;
    document.getElementById('hwClass').value = hw.class;
    document.getElementById('hwDifficulty').value = hw.difficulty;
    document.getElementById('hwTitle').value = hw.title;
    document.getElementById('hwDue').value = hw.due.slice(0,16);
    document.getElementById('hwInstructions').value = hw.instructions;
    document.getElementById('hwRecurring').value = hw.recurring;
    document.getElementById('hwUrgent').checked = hw.urgent;
    form.dataset.editId = editId;
  } else {
    form.dataset.editId = '';
  }
  modal.show();
}
function handleHomeworkFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const editId = form.dataset.editId;
  const hw = {
    id: editId || 'hw_' + Date.now(),
    subject: document.getElementById('hwSubject').value,
    class: document.getElementById('hwClass').value,
    difficulty: document.getElementById('hwDifficulty').value,
    title: document.getElementById('hwTitle').value,
    due: document.getElementById('hwDue').value,
    instructions: document.getElementById('hwInstructions').value,
    files: [], // TODO: handle file uploads
    recurring: document.getElementById('hwRecurring').value,
    urgent: document.getElementById('hwUrgent').checked,
    createdBy: DEMO_USER.name,
    createdAt: new Date().toISOString(),
    aiTopic: document.getElementById('aiSuggestion').textContent || '',
    audit: [{ action: editId ? 'Updated' : 'Created', user: DEMO_USER.name, date: new Date().toLocaleString() }]
  };
  if (editId) {
    const idx = homeworkAssignments.findIndex(h => h.id === editId);
    homeworkAssignments[idx] = hw;
  } else {
    homeworkAssignments.push(hw);
  }
  saveHomeworkData();
  renderHomeworkTable();
  bootstrap.Modal.getInstance(document.getElementById('homeworkModal')).hide();
}
function deleteAssignment(id) {
  if (confirm('Delete this assignment?')) {
    homeworkAssignments = homeworkAssignments.filter(h => h.id !== id);
    homeworkSubmissions = homeworkSubmissions.filter(s => s.assignmentId !== id);
    saveHomeworkData();
    renderHomeworkTable();
  }
}

// --- Submission & Multiple Attempts ---
window.openAssignmentDetail = function(assignmentId) {
  const hw = homeworkAssignments.find(h => h.id === assignmentId);
  const detail = document.getElementById('assignmentDetail');
  detail.style.display = 'block';
  let html = `<h4>${hw.title} <span class="badge bg-${hw.difficulty === 'Easy' ? 'success' : hw.difficulty === 'Medium' ? 'warning' : 'danger'}">${hw.difficulty}</span> ${hw.urgent ? '<span class="badge bg-danger">Urgent</span>' : ''}</h4>`;
  html += `<div><b>Subject:</b> ${hw.subject} | <b>Class:</b> ${hw.class} | <b>Due:</b> ${new Date(hw.due).toLocaleString()}</div>`;
  html += `<div class="mt-2"><b>Instructions:</b> ${hw.instructions}</div>`;
  html += `<div class="mt-2"><b>AI Topic:</b> ${hw.aiTopic || 'N/A'}</div>`;
  html += `<div class="mt-2"><b>Files:</b> ${hw.files && hw.files.length ? hw.files.map(f => `<a href="#">${f.name}</a>`).join(', ') : 'None'}</div>`;
  // Submission panel
  if (DEMO_USER.role === 'Student') {
    const mySubs = homeworkSubmissions.filter(s => s.assignmentId === assignmentId && s.studentId === DEMO_USER.id);
    html += `<div class="mt-3"><b>Your Submissions:</b> (${mySubs.length} / 3 attempts allowed)`;
    mySubs.forEach((s, i) => {
      html += `<div class="border p-2 my-1"><b>Attempt ${i+1}:</b> ${s.text ? `<div>${s.text}</div>` : ''} <div><b>Status:</b> ${s.status}</div> <div><b>Submitted:</b> ${new Date(s.submittedAt).toLocaleString()}</div></div>`;
    });
    if (mySubs.length < 3 && new Date(hw.due) > new Date()) {
      html += `<form id="submissionForm" class="mt-2"><textarea class="form-control mb-2" id="submissionText" placeholder="Write your answer..."></textarea><button class="btn btn-success" type="submit">Submit</button></form>`;
    }
    html += '</div>';
  }
  // Teacher grading panel
  if (DEMO_USER.role === 'Teacher') {
    const subs = homeworkSubmissions.filter(s => s.assignmentId === assignmentId);
    html += `<div class="mt-4"><b>Submissions:</b> <ul class="list-group">`;
    subs.forEach(s => {
      html += `<li class="list-group-item d-flex justify-content-between align-items-center">${s.studentName} - <span>${s.status}</span> <button class="btn btn-sm btn-primary" onclick="openGradingPanel('${s.id}')">Grade</button></li>`;
    });
    html += '</ul></div>';
  }
  // Chat
  html += `<div class="mt-4"><button class="btn btn-outline-info" onclick="openChatModal('${assignmentId}')"><i class="fa fa-comments"></i> Open Chat</button></div>`;
  detail.innerHTML = html;
  // Submission form handler
  const subForm = document.getElementById('submissionForm');
  if (subForm) {
    subForm.onsubmit = function(e) {
      e.preventDefault();
      const text = document.getElementById('submissionText').value;
      // Plagiarism check demo
      if (homeworkSubmissions.some(s => s.assignmentId === assignmentId && s.text === text)) {
        alert('Plagiarism detected!');
        return;
      }
      homeworkSubmissions.push({
        id: 'sub_' + Date.now(),
        assignmentId,
        studentId: DEMO_USER.id,
        studentName: DEMO_USER.name,
        text,
        status: new Date() > new Date(hw.due) ? 'Late' : 'Submitted',
        submittedAt: new Date().toISOString(),
        files: [] // TODO: handle file uploads
      });
      saveHomeworkData();
      openAssignmentDetail(assignmentId);
    };
  }
};
window.deleteAssignment = deleteAssignment;

// --- Grading & Feedback ---
window.openGradingPanel = function(submissionId) {
  const panel = document.getElementById('gradingPanel');
  panel.style.display = 'block';
  const sub = homeworkSubmissions.find(s => s.id === submissionId);
  panel.innerHTML = `<h5>Grading: ${sub.studentName}</h5>
    <div><b>Submission:</b> ${sub.text}</div>
    <form id="gradeForm" class="mt-2">
      <label>Marks:</label> <input type="number" class="form-control mb-2" id="gradeMarks" value="${sub.marks || ''}" max="100" min="0">
      <label>Feedback:</label> <textarea class="form-control mb-2" id="gradeFeedback">${sub.feedback || ''}</textarea>
      <button class="btn btn-success" type="submit">Save</button>
      <button class="btn btn-secondary ms-2" type="button" onclick="document.getElementById('gradingPanel').style.display='none'">Close</button>
      <button class="btn btn-outline-info ms-2" type="button" onclick="openPdfAnnotateModal()">PDF Annotate</button>
    </form>`;
  document.getElementById('gradeForm').onsubmit = function(e) {
    e.preventDefault();
    sub.marks = document.getElementById('gradeMarks').value;
    sub.feedback = document.getElementById('gradeFeedback').value;
    saveHomeworkData();
    panel.style.display = 'none';
    alert('Grade saved!');
  };
};

// --- Analytics Dashboard ---
function openAnalyticsModal() {
  const modal = new bootstrap.Modal(document.getElementById('analyticsModal'));
  const content = document.getElementById('analyticsContent');
  // Demo: submission rates by assignment
  let html = '<h6>Submission Rates</h6><ul class="list-group mb-3">';
  homeworkAssignments.forEach(hw => {
    const total = users.filter(u => u.role === 'Student' && u.class === hw.class).length || 10;
    const submitted = homeworkSubmissions.filter(s => s.assignmentId === hw.id).length;
    html += `<li class="list-group-item">${hw.title} (${hw.class}) - ${submitted}/${total} submitted</li>`;
  });
  html += '</ul>';
  // Parent engagement demo
  html += '<h6>Parent Engagement (Demo)</h6><div>Parent views: <span class="badge bg-info">N/A</span></div>';
  content.innerHTML = html;
  modal.show();
}

// --- In-App Chat ---
window.openChatModal = function(assignmentId) {
  const modal = new bootstrap.Modal(document.getElementById('chatModal'));
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';
  // Demo: no persistent chat
  modal.show();
  document.getElementById('sendChatBtn').onclick = function() {
    const input = document.getElementById('chatInput');
    if (input.value.trim()) {
      chatMessages.innerHTML += `<div><b>${DEMO_USER.name}:</b> ${input.value}</div>`;
      input.value = '';
    }
  };
};

// --- Advanced Features Stubs ---
window.openPdfAnnotateModal = function() {
  const modal = new bootstrap.Modal(document.getElementById('pdfAnnotateModal'));
  document.getElementById('pdfAnnotateArea').innerHTML = '[PDF Annotation Area - TODO]';
  modal.show();
};
window.openGroupAssignModal = function() {
  const modal = new bootstrap.Modal(document.getElementById('groupAssignModal'));
  document.getElementById('groupAssignArea').innerHTML = '[Group Assignment Area - TODO]';
  modal.show();
};
window.openPeerReviewModal = function() {
  const modal = new bootstrap.Modal(document.getElementById('peerReviewModal'));
  document.getElementById('peerReviewArea').innerHTML = '[Peer Review Area - TODO]';
  modal.show();
};
window.openAuditLogModal = function() {
  const modal = new bootstrap.Modal(document.getElementById('auditLogModal'));
  document.getElementById('auditLogArea').innerHTML = '[Audit Log Area - TODO]';
  modal.show();
};

// --- Bulk Import (Demo) ---
document.getElementById('bulkImportBtn')?.addEventListener('click', () => {
  new bootstrap.Modal(document.getElementById('bulkImportModal')).show();
});
document.getElementById('importHomeworkBtn')?.addEventListener('click', () => {
  // Demo: add a fake assignment
  homeworkAssignments.push({
    id: 'hw_' + Date.now(),
    subject: 'Science',
    class: 'Class B',
    difficulty: 'Medium',
    title: 'Imported Assignment',
    due: new Date(Date.now() + 86400000).toISOString().slice(0,16),
    instructions: 'Imported via bulk upload.',
    files: [],
    recurring: 'none',
    urgent: false,
    createdBy: DEMO_USER.name,
    createdAt: new Date().toISOString(),
    aiTopic: '',
    audit: [{ action: 'Imported', user: DEMO_USER.name, date: new Date().toLocaleString() }]
  });
  saveHomeworkData();
  renderHomeworkTable();
  bootstrap.Modal.getInstance(document.getElementById('bulkImportModal')).hide();
});

// --- AI Suggestion (Demo) ---
document.getElementById('aiSuggestBtn')?.addEventListener('click', () => {
  const topics = ['Fractions Practice', 'Essay: My Favorite Book', 'Lab: Plant Growth', 'Oral: Introduce Yourself', 'Math Drill: Multiplication'];
  document.getElementById('aiSuggestion').textContent = topics[Math.floor(Math.random() * topics.length)];
});

// --- Filters ---
document.getElementById('filterSubject')?.addEventListener('change', renderHomeworkTable);
document.getElementById('filterClass')?.addEventListener('change', renderHomeworkTable);
document.getElementById('filterStatus')?.addEventListener('change', renderHomeworkTable);

// --- Assignment Modal Save ---
document.getElementById('homeworkForm')?.addEventListener('submit', handleHomeworkFormSubmit);

document.addEventListener('DOMContentLoaded', function() {
  // Populate subject/class filters (demo)
  const subjects = ['Math', 'English', 'Science', 'History'];
  const classes = ['Class A', 'Class B', 'Class C'];
  subjects.forEach(s => {
    document.getElementById('filterSubject').innerHTML += `<option value="${s}">${s}</option>`;
    document.getElementById('hwSubject').innerHTML += `<option value="${s}">${s}</option>`;
  });
  classes.forEach(c => {
    document.getElementById('filterClass').innerHTML += `<option value="${c}">${c}</option>`;
    document.getElementById('hwClass').innerHTML += `<option value="${c}">${c}</option>`;
  });
  renderHomeworkTable();
});
// --- End Homework Module Full Implementation ---

// --- Version History & Revert Implementation ---

// Demo: Store dashboard versions in localStorage under 'dashboardVersions'
function saveDashboardVersion(data) {
  let versions = JSON.parse(localStorage.getItem('dashboardVersions') || '[]');
  const timestamp = new Date().toLocaleString();
  versions.unshift({ timestamp, data: { ...data } });
  // Keep only last 10 versions
  versions = versions.slice(0, 10);
  localStorage.setItem('dashboardVersions', JSON.stringify(versions));
}

// Example: Save a version every time dashboardData changes (for demo)
if (typeof dashboardData !== 'undefined') {
  saveDashboardVersion(dashboardData);
}

// --- Version History Modal Logic ---
const versionHistoryModal = document.getElementById('versionHistoryModal');
const versionHistoryList = document.getElementById('versionHistoryList');
let selectedVersionIndex = null;

function renderVersionHistory() {
  const versions = JSON.parse(localStorage.getItem('dashboardVersions') || '[]');
  if (!versions.length) {
    versionHistoryList.innerHTML = '<div class="text-muted">No version history found.</div>';
    return;
  }
  versionHistoryList.innerHTML = versions.map((v, i) => `
    <div class="list-group-item d-flex align-items-center">
      <input type="radio" name="versionSelect" value="${i}" class="form-check-input me-2" ${i === 0 ? 'checked' : ''}>
      <span><b>${v.timestamp}</b> - Students: ${v.data.total_students ?? '-'} | Staff: ${v.data.total_staff ?? '-'}</span>
    </div>
  `).join('');
  selectedVersionIndex = 0;
}

// Open version history modal
if (document.getElementById('viewVersionHistoryBtn')) {
  document.getElementById('viewVersionHistoryBtn').addEventListener('click', function() {
    renderVersionHistory();
    const modal = new bootstrap.Modal(versionHistoryModal);
    modal.show();
  });
}

// Track selected version
if (versionHistoryList) {
  versionHistoryList.addEventListener('change', function(e) {
    if (e.target.name === 'versionSelect') {
      selectedVersionIndex = parseInt(e.target.value, 10);
    }
  });
}

// --- Revert Version Logic ---
if (document.getElementById('revertVersionBtn')) {
  document.getElementById('revertVersionBtn').addEventListener('click', function() {
    const versions = JSON.parse(localStorage.getItem('dashboardVersions') || '[]');
    if (selectedVersionIndex === null || !versions[selectedVersionIndex]) {
      alert('Please select a version to revert to.');
      return;
    }
    if (confirm('Are you sure you want to revert to this version? This will overwrite current dashboard data.')) {
      // For demo: update dashboardData and re-render
      Object.assign(dashboardData, versions[selectedVersionIndex].data);
      updateDashboardCards();
      // Save as new version
      saveDashboardVersion(dashboardData);
      alert('Dashboard reverted to selected version!');
      // Close modal
      bootstrap.Modal.getInstance(versionHistoryModal).hide();
    }
  });
}

// --- Export Dashboard/Report Logic ---
if (document.getElementById('exportReportBtn')) {
  document.getElementById('exportReportBtn').addEventListener('click', function() {
    // For demo: export dashboardData as CSV
    const data = dashboardData;
    const csvRows = [
      ['Field', 'Value'],
      ['Total Students', data.total_students],
      ['Total Staff', data.total_staff],
      ['Total Classes', data.total_classes],
      ['Active Lessons', data.active_lessons],
      ['Last Updated', data.last_updated]
    ];
    const csv = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  });
}

// --- End Version History, Revert, Export Implementation --- 

// Finance Module JS

document.addEventListener('DOMContentLoaded', function () {
  // Dashboard sample data
  document.getElementById('totalCollected').textContent = '$25,000';
  document.getElementById('totalOutstanding').textContent = '$5,000';
  document.getElementById('totalOverdue').textContent = '$2,000';
  document.getElementById('upcomingPayments').textContent = '$1,500';

  // Fee Trends Chart (Chart.js)
  if (window.Chart && document.getElementById('feeTrendsChart')) {
    new Chart(document.getElementById('feeTrendsChart').getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Collected',
          data: [4000, 5000, 3500, 6000, 3500, 5000],
          borderColor: '#6f42c1',
          backgroundColor: 'rgba(111,66,193,0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // Students in Arrears sample row (already in HTML as example)
  // Add more rows dynamically if needed in the future
}); 

// === INVENTORY MANAGEMENT MODULE ENHANCEMENTS ===
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('inventoryTable')) return; // Only run on inventory.html

  // --- Demo Data ---
  let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
  let auditTrail = JSON.parse(localStorage.getItem('inventoryAuditTrail') || '[]');
  let categories = ['Books', 'Desks', 'Laptops', 'Lab Equipment', 'Projectors'];
  let locations = ['Main Library', 'Science Lab', 'Room 101', 'Room 202', 'Admin Office'];
  let staff = ['Teacher A', 'Teacher B', 'Admin', 'Lab Tech', 'IT Support'];

  // --- Utility Functions ---
  function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('inventoryAuditTrail', JSON.stringify(auditTrail));
  }
  function showToast(msg, type = 'success') {
    alert(msg); // Replace with Bootstrap toast if desired
  }

  // --- Populate Dropdowns ---
  function populateDropdown(id, arr) {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = arr.map(v => `<option>${v}</option>`).join('');
  }
  populateDropdown('inventoryCategory', categories);
  populateDropdown('inventoryLocation', locations);
  populateDropdown('inventoryAssignedTo', staff);
  populateDropdown('transferAsset', inventory.map(i => i.name));
  populateDropdown('transferFrom', locations);
  populateDropdown('transferTo', locations);

  // --- Dashboard Cards ---
  function updateDashboard() {
    document.getElementById('invTotalAssets').textContent = inventory.length;
    document.getElementById('invInUse').textContent = inventory.filter(i => i.status === 'In Use').length;
    document.getElementById('invUnderRepair').textContent = inventory.filter(i => i.status === 'Under Repair').length;
    document.getElementById('invLowStock').textContent = inventory.filter(i => i.quantity < 5).length;
  }

  // --- Charts ---
  function renderCharts() {
    if (window.Chart) {
      // Category Distribution
      const catCounts = {};
      inventory.forEach(i => { catCounts[i.category] = (catCounts[i.category] || 0) + 1; });
      new Chart(document.getElementById('invCategoryChart').getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: Object.keys(catCounts),
          datasets: [{ data: Object.values(catCounts), backgroundColor: ['#6f42c1', '#fd7e14', '#198754', '#dc3545', '#0d6efd'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      });
      // Depreciation
      const depLabels = inventory.map(i => i.name);
      const depData = inventory.map(i => i.depreciation || 0);
      new Chart(document.getElementById('invDepreciationChart').getContext('2d'), {
        type: 'bar',
        data: {
          labels: depLabels,
          datasets: [{ label: 'Depreciation (%)', data: depData, backgroundColor: '#b39ddb' }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
    }
  }

  // --- Render Inventory Table ---
  function renderInventoryTable() {
    const tbody = document.getElementById('inventoryTable').querySelector('tbody');
    tbody.innerHTML = inventory.map((item, idx) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.tags || ''}</td>
        <td>${item.quantity}</td>
        <td>${item.location || ''}</td>
        <td>${item.assignedTo || ''}</td>
        <td><span class="badge bg-${item.status === 'In Use' ? 'success' : item.status === 'Under Repair' ? 'warning' : item.status === 'Retired' ? 'secondary' : item.status === 'Lost' ? 'danger' : 'info'}">${item.status}</span></td>
        <td>${item.purchaseDate || ''}</td>
        <td>${item.supplier || ''}</td>
        <td>${item.warranty || ''}</td>
        <td>${item.depreciation || ''}</td>
        <td>${item.barcode || ''}</td>
        <td>
          <button class="btn btn-sm btn-info me-1" onclick="editInventoryItem(${idx})">Edit</button>
          <button class="btn btn-sm btn-danger me-1" onclick="deleteInventoryItem(${idx})">Delete</button>
          <button class="btn btn-sm btn-secondary" onclick="showAuditTrail(${idx})">Audit</button>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="13" class="text-center">No assets found.</td></tr>';
  }
  window.editInventoryItem = function(idx) {
    const item = inventory[idx];
    document.getElementById('inventoryName').value = item.name;
    document.getElementById('inventoryCategory').value = item.category;
    document.getElementById('inventoryTags').value = item.tags || '';
    document.getElementById('inventoryQuantity').value = item.quantity;
    document.getElementById('inventoryLocation').value = item.location || '';
    document.getElementById('inventoryAssignedTo').value = item.assignedTo || '';
    document.getElementById('inventoryStatus').value = item.status;
    document.getElementById('inventoryPurchaseDate').value = item.purchaseDate || '';
    document.getElementById('inventorySupplier').value = item.supplier || '';
    document.getElementById('inventoryWarranty').value = item.warranty || '';
    document.getElementById('inventoryDepreciation').value = item.depreciation || '';
    document.getElementById('inventoryBarcode').value = item.barcode || '';
    // Attachments not handled in demo
    document.getElementById('inventoryForm').dataset.editIdx = idx;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  window.deleteInventoryItem = function(idx) {
    if (confirm('Delete this asset?')) {
      auditTrail.push({ action: 'Deleted', item: inventory[idx].name, user: 'Admin', date: new Date().toLocaleString() });
      inventory.splice(idx, 1);
      saveInventory();
      updateDashboard();
      renderInventoryTable();
      renderCharts();
      showToast('Asset deleted!', 'danger');
    }
  };
  window.showAuditTrail = function(idx) {
    const modal = new bootstrap.Modal(document.getElementById('auditTrailModal'));
    const item = inventory[idx];
    const logs = auditTrail.filter(a => a.item === item.name);
    document.getElementById('auditTrailBody').innerHTML = logs.length ? logs.map(l => `<div>${l.date}: <b>${l.action}</b> by ${l.user}</div>`).join('') : '<div class="text-muted">No changes yet.</div>';
    modal.show();
  };

  // --- Form Submission ---
  document.getElementById('inventoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = this.dataset.editIdx;
    const item = {
      name: document.getElementById('inventoryName').value,
      category: document.getElementById('inventoryCategory').value,
      tags: document.getElementById('inventoryTags').value,
      quantity: parseInt(document.getElementById('inventoryQuantity').value, 10),
      location: document.getElementById('inventoryLocation').value,
      assignedTo: document.getElementById('inventoryAssignedTo').value,
      status: document.getElementById('inventoryStatus').value,
      purchaseDate: document.getElementById('inventoryPurchaseDate').value,
      supplier: document.getElementById('inventorySupplier').value,
      warranty: document.getElementById('inventoryWarranty').value,
      depreciation: document.getElementById('inventoryDepreciation').value,
      barcode: document.getElementById('inventoryBarcode').value,
      // Attachments not handled in demo
    };
    if (idx) {
      auditTrail.push({ action: 'Updated', item: item.name, user: 'Admin', date: new Date().toLocaleString() });
      inventory[idx] = item;
      delete this.dataset.editIdx;
      showToast('Asset updated!', 'success');
    } else {
      auditTrail.push({ action: 'Created', item: item.name, user: 'Admin', date: new Date().toLocaleString() });
      inventory.push(item);
      showToast('Asset added!', 'success');
    }
    saveInventory();
    updateDashboard();
    renderInventoryTable();
    renderCharts();
    this.reset();
  });

  // --- Bulk Import/Export ---
  document.getElementById('bulkImportBtn').addEventListener('click', function() {
    new bootstrap.Modal(document.getElementById('bulkImportExportModal')).show();
  });
  document.getElementById('bulkExportBtn').addEventListener('click', function() {
    new bootstrap.Modal(document.getElementById('bulkImportExportModal')).show();
  });
  document.getElementById('exportInventoryBtn').addEventListener('click', function() {
    const csv = [
      ['Name','Category','Tags','Quantity','Location','Assigned To','Status','Purchase Date','Supplier','Warranty','Depreciation','Barcode'],
      ...inventory.map(i => [i.name,i.category,i.tags,i.quantity,i.location,i.assignedTo,i.status,i.purchaseDate,i.supplier,i.warranty,i.depreciation,i.barcode])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
  });
  document.getElementById('importInventoryBtn').addEventListener('click', function() {
    const file = document.getElementById('bulkImportFile').files[0];
    if (!file) return showToast('No file selected', 'danger');
    const reader = new FileReader();
    reader.onload = function(e) {
      const lines = e.target.result.split('\n').slice(1); // skip header
      lines.forEach(line => {
        const [name,category,tags,quantity,location,assignedTo,status,purchaseDate,supplier,warranty,depreciation,barcode] = line.split(',');
        if (name) inventory.push({ name, category, tags, quantity: parseInt(quantity,10), location, assignedTo, status, purchaseDate, supplier, warranty, depreciation, barcode });
      });
      saveInventory();
      updateDashboard();
      renderInventoryTable();
      renderCharts();
      showToast('Import complete!', 'success');
    };
    reader.readAsText(file);
  });

  // --- Stock Transfer ---
  document.getElementById('transferStockBtn').addEventListener('click', function() {
    populateDropdown('transferAsset', inventory.map(i => i.name));
    new bootstrap.Modal(document.getElementById('stockTransferModal')).show();
  });
  document.getElementById('stockTransferForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const assetName = document.getElementById('transferAsset').value;
    const from = document.getElementById('transferFrom').value;
    const to = document.getElementById('transferTo').value;
    const qty = parseInt(document.getElementById('transferQuantity').value, 10);
    const reason = document.getElementById('transferReason').value;
    const asset = inventory.find(i => i.name === assetName && i.location === from);
    if (!asset || asset.quantity < qty) return showToast('Not enough stock at source', 'danger');
    asset.quantity -= qty;
    let destAsset = inventory.find(i => i.name === assetName && i.location === to);
    if (destAsset) destAsset.quantity += qty;
    else inventory.push({ ...asset, location: to, quantity: qty });
    auditTrail.push({ action: `Transferred ${qty} from ${from} to ${to} (${reason})`, item: assetName, user: 'Admin', date: new Date().toLocaleString() });
    saveInventory();
    updateDashboard();
    renderInventoryTable();
    renderCharts();
    showToast('Stock transferred!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('stockTransferModal')).hide();
  });

  // --- Audit Trail ---
  document.getElementById('viewAuditTrailBtn').addEventListener('click', function() {
    const modal = new bootstrap.Modal(document.getElementById('auditTrailModal'));
    const logs = auditTrail;
    document.getElementById('auditTrailBody').innerHTML = logs.length ? logs.map(l => `<div>${l.date}: <b>${l.action}</b> on <b>${l.item}</b> by ${l.user}</div>`).join('') : '<div class="text-muted">No changes yet.</div>';
    modal.show();
  });

  // --- QR/Barcode Scanner (Placeholder) ---
  document.getElementById('scanBarcodeBtn').addEventListener('click', function() {
    new bootstrap.Modal(document.getElementById('barcodeScannerModal')).show();
  });
  document.getElementById('generateBarcodeBtn').addEventListener('click', function() {
    document.getElementById('inventoryBarcode').value = 'QR-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  });

  // --- Initial Render ---
  updateDashboard();
  renderInventoryTable();
  renderCharts();
}); 

// === ALERTS & INCIDENT REPORTING MODULE ENHANCEMENTS ===
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('alertsTable')) return; // Only run on alerts.html

  // --- Demo Data ---
  let alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
  let assignList = JSON.parse(localStorage.getItem('alertsAssignList') || '[]');
  let escalationList = JSON.parse(localStorage.getItem('alertsEscalationList') || '[]');
  let notificationSettings = JSON.parse(localStorage.getItem('alertsNotificationSettings') || '[]');
  let staff = ['Principal', 'Security', 'Maintenance', 'Guardians'];

  // --- Utility Functions ---
  function saveAlerts() {
    localStorage.setItem('alerts', JSON.stringify(alerts));
    localStorage.setItem('alertsAssignList', JSON.stringify(assignList));
    localStorage.setItem('alertsEscalationList', JSON.stringify(escalationList));
    localStorage.setItem('alertsNotificationSettings', JSON.stringify(notificationSettings));
  }
  function showToast(msg, type = 'success') {
    alert(msg); // Replace with Bootstrap toast if desired
  }

  // --- Dashboard Cards ---
  function updateAlertsDashboard() {
    document.getElementById('alertsTotal').textContent = alerts.length;
    document.getElementById('alertsOpen').textContent = alerts.filter(a => a.status === 'Open').length;
    document.getElementById('alertsResolved').textContent = alerts.filter(a => a.status === 'Resolved').length;
    document.getElementById('alertsAnonymous').textContent = alerts.filter(a => a.anonymous).length;
  }

  // --- Charts ---
  function renderAlertsCharts() {
    if (window.Chart) {
      // Category Distribution
      const catCounts = {};
      alerts.forEach(a => { catCounts[a.category] = (catCounts[a.category] || 0) + 1; });
      new Chart(document.getElementById('alertsCategoryChart').getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: Object.keys(catCounts),
          datasets: [{ data: Object.values(catCounts), backgroundColor: ['#6f42c1', '#fd7e14', '#198754', '#dc3545', '#0d6efd'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      });
      // Trends Over Time
      const dates = {};
      alerts.forEach(a => {
        const d = a.date ? a.date.split('T')[0] : 'Unknown';
        dates[d] = (dates[d] || 0) + 1;
      });
      new Chart(document.getElementById('alertsTrendChart').getContext('2d'), {
        type: 'line',
        data: {
          labels: Object.keys(dates),
          datasets: [{ label: 'Incidents', data: Object.values(dates), borderColor: '#6f42c1', backgroundColor: 'rgba(111,66,193,0.1)', fill: true }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
    }
  }

  // --- Render Alerts Table ---
  function renderAlertsTable() {
    const tbody = document.getElementById('alertsTable').querySelector('tbody');
    tbody.innerHTML = alerts.map((a, idx) => `
      <tr>
        <td>${a.category}</td>
        <td>${a.description}</td>
        <td><span class="badge bg-${a.priority === 'High' ? 'danger' : a.priority === 'Medium' ? 'warning' : 'secondary'}">${a.priority}</span></td>
        <td><span class="badge bg-${a.status === 'Open' ? 'warning' : a.status === 'Resolved' ? 'success' : a.status === 'Escalated' ? 'danger' : 'secondary'}">${a.status}</span></td>
        <td>${a.anonymous ? '<span class="badge bg-info">Yes</span>' : 'No'}</td>
        <td>${a.assignedTo || ''}</td>
        <td>${a.date ? new Date(a.date).toLocaleString() : ''}</td>
        <td>
          <button class="btn btn-sm btn-info me-1" onclick="viewIncidentDetails(${idx})">View</button>
          <button class="btn btn-sm btn-warning me-1" onclick="openAssignModal(${idx})">Assign</button>
          <button class="btn btn-sm btn-danger me-1" onclick="openEscalationModal(${idx})">Escalate</button>
          <button class="btn btn-sm btn-success" onclick="resolveIncident(${idx})">Resolve</button>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="8" class="text-center">No incidents found.</td></tr>';
  }
  window.viewIncidentDetails = function(idx) {
    const a = alerts[idx];
    const modal = new bootstrap.Modal(document.getElementById('incidentDetailsModal'));
    document.getElementById('incidentDetailsBody').innerHTML = `
      <div><b>Category:</b> ${a.category}</div>
      <div><b>Description:</b> ${a.description}</div>
      <div><b>Priority:</b> ${a.priority}</div>
      <div><b>Status:</b> ${a.status}</div>
      <div><b>Anonymous:</b> ${a.anonymous ? 'Yes' : 'No'}</div>
      <div><b>Assigned To:</b> ${a.assignedTo || ''}</div>
      <div><b>Date:</b> ${a.date ? new Date(a.date).toLocaleString() : ''}</div>
      <div><b>Attachments:</b> ${a.attachments ? a.attachments.map(f => `<a href="#" download>${f}</a>`).join(', ') : 'None'}</div>
    `;
    modal.show();
  };
  window.openAssignModal = function(idx) {
    const modal = new bootstrap.Modal(document.getElementById('assignModal'));
    document.getElementById('assignForm').dataset.idx = idx;
    modal.show();
  };
  window.openEscalationModal = function(idx) {
    const modal = new bootstrap.Modal(document.getElementById('escalationModal'));
    document.getElementById('escalationBody').innerHTML = `<div>Escalate incident: <b>${alerts[idx].description}</b>?</div><button class='btn btn-danger mt-2' onclick='confirmEscalate(${idx})'>Confirm Escalate</button>`;
    modal.show();
  };
  window.confirmEscalate = function(idx) {
    alerts[idx].status = 'Escalated';
    escalationList.push({ ...alerts[idx], escalatedAt: new Date().toISOString() });
    saveAlerts();
    updateAlertsDashboard();
    renderAlertsTable();
    showToast('Incident escalated!', 'danger');
    bootstrap.Modal.getInstance(document.getElementById('escalationModal')).hide();
  };
  window.resolveIncident = function(idx) {
    alerts[idx].status = 'Resolved';
    saveAlerts();
    updateAlertsDashboard();
    renderAlertsTable();
    showToast('Incident resolved!', 'success');
  };

  // --- Incident Form Submission ---
  document.getElementById('alertsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const attachments = Array.from(document.getElementById('alertFile').files).map(f => f.name);
    const alert = {
      category: document.getElementById('alertCategory').value,
      description: document.getElementById('alertDescription').value,
      priority: document.getElementById('alertPriority').value,
      status: 'Open',
      anonymous: document.getElementById('alertAnonymous').checked,
      assignedTo: '',
      date: new Date().toISOString(),
      attachments,
    };
    alerts.push(alert);
    saveAlerts();
    updateAlertsDashboard();
    renderAlertsTable();
    renderAlertsCharts();
    this.reset();
    showToast('Incident logged!', 'success');
  });

  // --- Assign/Follow-Up Modal ---
  document.getElementById('assignForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = this.dataset.idx;
    alerts[idx].assignedTo = document.getElementById('assignTo').value;
    alerts[idx].due = document.getElementById('assignDue').value;
    alerts[idx].steps = document.getElementById('assignSteps').value;
    assignList.push({ ...alerts[idx], assignedAt: new Date().toISOString() });
    saveAlerts();
    updateAlertsDashboard();
    renderAlertsTable();
    showToast('Incident assigned!', 'info');
    bootstrap.Modal.getInstance(document.getElementById('assignModal')).hide();
  });

  // --- Notification Settings Modal ---
  document.getElementById('notificationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    notificationSettings = Array.from(document.getElementById('notifyWho').selectedOptions).map(o => o.value);
    saveAlerts();
    showToast('Notification settings saved!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('notificationModal')).hide();
  });

  // --- Analytics Dashboard Modal ---
  document.getElementById('analyticsModal').addEventListener('show.bs.modal', function() {
    if (window.Chart) {
      const catCounts = {};
      alerts.forEach(a => { catCounts[a.category] = (catCounts[a.category] || 0) + 1; });
      new Chart(document.getElementById('alertsAnalyticsChart').getContext('2d'), {
        type: 'bar',
        data: {
          labels: Object.keys(catCounts),
          datasets: [{ label: 'Incidents', data: Object.values(catCounts), backgroundColor: '#6f42c1' }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
    }
  });

  // --- Voice-to-Text (Demo/Placeholder) ---
  document.getElementById('voiceToTextBtn').addEventListener('click', function() {
    document.getElementById('alertDescription').value += ' [Voice input simulated]';
  });

  // --- Policy/Quick Guide Link ---
  document.getElementById('policyLink').addEventListener('click', function(e) {
    e.preventDefault();
    showToast('Policy/Quick Guide: Follow school protocol for this incident type.', 'info');
  });

  // --- Initial Render ---
  updateAlertsDashboard();
  renderAlertsTable();
  renderAlertsCharts();
});

// === FLEET/TRANSPORT MODULE ENHANCEMENTS ===
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('transportTable')) return; // Only run on transport.html

  // --- Demo Data ---
  let fleet = JSON.parse(localStorage.getItem('fleet') || '[]');
  let fuelLogs = JSON.parse(localStorage.getItem('fleetFuelLogs') || '[]');
  let incidentLogs = JSON.parse(localStorage.getItem('fleetIncidentLogs') || '[]');
  let attendanceLogs = JSON.parse(localStorage.getItem('fleetAttendanceLogs') || '[]');
  let rfidLogs = JSON.parse(localStorage.getItem('fleetRFIDLogs') || '[]');
  let drivers = ['John Doe', 'Jane Smith', 'Alex Brown', 'Maria Lee'];

  // --- Utility Functions ---
  function saveFleet() {
    localStorage.setItem('fleet', JSON.stringify(fleet));
    localStorage.setItem('fleetFuelLogs', JSON.stringify(fuelLogs));
    localStorage.setItem('fleetIncidentLogs', JSON.stringify(incidentLogs));
    localStorage.setItem('fleetAttendanceLogs', JSON.stringify(attendanceLogs));
    localStorage.setItem('fleetRFIDLogs', JSON.stringify(rfidLogs));
  }
  function showToast(msg, type = 'success') {
    alert(msg); // Replace with Bootstrap toast if desired
  }

  // --- Dashboard Cards ---
  function updateFleetDashboard() {
    document.getElementById('fleetTotal').textContent = fleet.length;
    document.getElementById('fleetActive').textContent = fleet.filter(b => b.status === 'Active').length;
    document.getElementById('fleetDrivers').textContent = new Set(fleet.map(b => b.driver)).size;
    document.getElementById('fleetExpiry').textContent = fleet.filter(b => isExpiringSoon(b.licenseExpiry) || isExpiringSoon(b.insuranceExpiry)).length;
  }
  function isExpiringSoon(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return (d - now) < 1000*60*60*24*30 && d > now;
  }

  // --- Charts ---
  function renderFleetCharts() {
    if (window.Chart) {
      // Utilization
      const utilLabels = fleet.map(b => b.busNumber);
      const utilData = fleet.map(b => b.utilization || Math.floor(Math.random()*100));
      new Chart(document.getElementById('fleetUtilizationChart').getContext('2d'), {
        type: 'bar',
        data: {
          labels: utilLabels,
          datasets: [{ label: 'Utilization (%)', data: utilData, backgroundColor: '#6f42c1' }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
      // Fuel
      const fuelLabels = fleet.map(b => b.busNumber);
      const fuelData = fleet.map(b => b.fuelEfficiency || Math.floor(Math.random()*10+5));
      new Chart(document.getElementById('fleetFuelChart').getContext('2d'), {
        type: 'line',
        data: {
          labels: fuelLabels,
          datasets: [{ label: 'Fuel Efficiency (km/l)', data: fuelData, borderColor: '#fd7e14', backgroundColor: 'rgba(253,126,20,0.1)', fill: true }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
    }
  }

  // --- Render Fleet Table ---
  function renderFleetTable() {
    const tbody = document.getElementById('transportTable').querySelector('tbody');
    tbody.innerHTML = fleet.map((b, idx) => `
      <tr>
        <td>${b.busNumber}</td>
        <td>${b.driver}</td>
        <td>${b.route}</td>
        <td><span class="badge bg-${b.status === 'Active' ? 'success' : b.status === 'Maintenance' ? 'warning' : 'secondary'}">${b.status}</span></td>
        <td>${b.licenseExpiry || ''}</td>
        <td>${b.insuranceExpiry || ''}</td>
        <td>${b.fuelEfficiency || ''}</td>
        <td>
          <button class="btn btn-sm btn-info me-1" onclick="editFleetItem(${idx})">Edit</button>
          <button class="btn btn-sm btn-danger me-1" onclick="deleteFleetItem(${idx})">Delete</button>
          <button class="btn btn-sm btn-secondary me-1" onclick="openMapModal(${idx})">Map</button>
          <button class="btn btn-sm btn-warning me-1" onclick="openAttendanceModal(${idx})">Attendance</button>
          <button class="btn btn-sm btn-success me-1" onclick="openRFIDModal(${idx})">RFID</button>
          <button class="btn btn-sm btn-primary me-1" onclick="openFuelLogModal(${idx})">Fuel</button>
          <button class="btn btn-sm btn-outline-danger" onclick="openSOSModal(${idx})">SOS</button>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="8" class="text-center">No fleet records found.</td></tr>';
  }
  window.editFleetItem = function(idx) {
    const b = fleet[idx];
    document.getElementById('busNumber').value = b.busNumber;
    document.getElementById('driverName').value = b.driver;
    document.getElementById('route').value = b.route;
    document.getElementById('busCapacity').value = b.capacity || '';
    document.getElementById('licenseExpiry').value = b.licenseExpiry || '';
    document.getElementById('insuranceExpiry').value = b.insuranceExpiry || '';
    document.getElementById('emergencyContact').value = b.emergencyContact || '';
    document.getElementById('gpsDeviceId').value = b.gpsDeviceId || '';
    document.getElementById('vehicleStatus').value = b.status;
    // Attachments not handled in demo
    document.getElementById('transportForm').dataset.editIdx = idx;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  window.deleteFleetItem = function(idx) {
    if (confirm('Delete this bus?')) {
      fleet.splice(idx, 1);
      saveFleet();
      updateFleetDashboard();
      renderFleetTable();
      renderFleetCharts();
      showToast('Bus deleted!', 'danger');
    }
  };
  window.openMapModal = function(idx) {
    const modal = new bootstrap.Modal(document.getElementById('mapModal'));
    document.getElementById('mapModalBody').innerHTML = '[Map for ' + fleet[idx].busNumber + ' - Demo]';
    modal.show();
  };
  window.openAttendanceModal = function(idx) {
    const modal = new bootstrap.Modal(document.getElementById('attendanceModal'));
    document.getElementById('attendanceModalBody').innerHTML = '[Attendance log for ' + fleet[idx].driver + ' - Demo]';
    modal.show();
  };
  window.openRFIDModal = function(idx) {
    const modal = new bootstrap.Modal(document.getElementById('rfidModal'));
    document.getElementById('rfidModalBody').innerHTML = '[RFID log for ' + fleet[idx].busNumber + ' - Demo]';
    modal.show();
  };
  window.openFuelLogModal = function(idx) {
    const modal = new bootstrap.Modal(document.getElementById('fuelLogModal'));
    document.getElementById('fuelLogModalBody').innerHTML = '[Fuel log for ' + fleet[idx].busNumber + ' - Demo]';
    modal.show();
  };
  window.openSOSModal = function(idx) {
    const modal = new bootstrap.Modal(document.getElementById('sosModal'));
    document.getElementById('sosModalBody').innerHTML = '[SOS for ' + fleet[idx].busNumber + ' - Demo]';
    modal.show();
  };

  // --- Form Submission ---
  document.getElementById('transportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = this.dataset.editIdx;
    const bus = {
      busNumber: document.getElementById('busNumber').value,
      driver: document.getElementById('driverName').value,
      route: document.getElementById('route').value,
      capacity: document.getElementById('busCapacity').value,
      licenseExpiry: document.getElementById('licenseExpiry').value,
      insuranceExpiry: document.getElementById('insuranceExpiry').value,
      emergencyContact: document.getElementById('emergencyContact').value,
      gpsDeviceId: document.getElementById('gpsDeviceId').value,
      status: document.getElementById('vehicleStatus').value,
      // Attachments not handled in demo
      fuelEfficiency: Math.floor(Math.random()*10+5), // Demo
      utilization: Math.floor(Math.random()*100), // Demo
    };
    if (idx) {
      fleet[idx] = bus;
      delete this.dataset.editIdx;
      showToast('Bus updated!', 'success');
    } else {
      fleet.push(bus);
      showToast('Bus registered!', 'success');
    }
    saveFleet();
    updateFleetDashboard();
    renderFleetTable();
    renderFleetCharts();
    this.reset();
  });

  // --- Route Optimization (Demo) ---
  document.getElementById('optimizeRouteBtn').addEventListener('click', function() {
    showToast('Route optimization suggested: [Demo route]', 'info');
  });

  // --- Add Fuel Log (Demo) ---
  document.getElementById('addFuelLogBtn').addEventListener('click', function() {
    new bootstrap.Modal(document.getElementById('fuelLogModal')).show();
  });

  // --- Add Incident Log (Demo) ---
  document.getElementById('addIncidentBtn').addEventListener('click', function() {
    new bootstrap.Modal(document.getElementById('incidentLogModal')).show();
  });

  // --- SOS (Demo) ---
  document.getElementById('sosBtn').addEventListener('click', function() {
    new bootstrap.Modal(document.getElementById('sosModal')).show();
  });

  // --- Expiry Reminder (Demo) ---
  document.getElementById('licenseExpiry').addEventListener('change', function() {
    if (isExpiringSoon(this.value)) showToast('License expiring soon!', 'warning');
  });
  document.getElementById('insuranceExpiry').addEventListener('change', function() {
    if (isExpiringSoon(this.value)) showToast('Insurance expiring soon!', 'warning');
  });

  // --- Utilization Report (Demo) ---
  document.getElementById('fleetMap').addEventListener('click', function() {
    new bootstrap.Modal(document.getElementById('utilizationModal')).show();
  });

  // --- Initial Render ---
  updateFleetDashboard();
  renderFleetTable();
  renderFleetCharts();
});