// Student Portal JavaScript - Comprehensive Student Management System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize student portal
    initializeStudentPortal();
    
    // Load student data
    loadStudentData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize charts
    initializeCharts();
});

// Student data structure
let studentData = {
    id: 'STU001',
    name: 'Alice Johnson',
    class: 'Grade 8A',
    photo: 'https://via.placeholder.com/120x120/28a745/ffffff?text=AJ',
    gpa: 3.75,
    attendance: 95,
    pendingFees: 150,
    assignmentsDue: 5
};

// Academic results data
let academicResults = [
    { subject: 'Mathematics', term1: 85, term2: 88, term3: 92, average: 88.3, grade: 'A' },
    { subject: 'English', term1: 78, term2: 82, term3: 85, average: 81.7, grade: 'B' },
    { subject: 'Science', term1: 90, term2: 87, term3: 89, average: 88.7, grade: 'A' },
    { subject: 'History', term1: 82, term2: 85, term3: 88, average: 85.0, grade: 'A' },
    { subject: 'Geography', term1: 79, term2: 83, term3: 86, average: 82.7, grade: 'B' },
    { subject: 'Art', term1: 88, term2: 90, term3: 92, average: 90.0, grade: 'A' }
];

// Payment history data
let paymentHistory = [
    { date: '2024-01-15', description: 'Tuition Fees - Term 1', amount: 500, method: 'Mobile Money', status: 'Completed', receipt: 'REC001' },
    { date: '2024-02-20', description: 'Library Fees', amount: 50, method: 'Card', status: 'Completed', receipt: 'REC002' },
    { date: '2024-03-10', description: 'Sports Fees', amount: 100, method: 'Bank Transfer', status: 'Completed', receipt: 'REC003' },
    { date: '2024-04-05', description: 'Tuition Fees - Term 2', amount: 500, method: 'Mobile Money', status: 'Pending', receipt: '' }
];

// Timetable data
let timetableData = [
    { time: '8:00 - 9:00', monday: 'Mathematics', tuesday: 'English', wednesday: 'Science', thursday: 'History', friday: 'Geography' },
    { time: '9:00 - 10:00', monday: 'English', tuesday: 'Mathematics', wednesday: 'Art', thursday: 'Science', friday: 'Mathematics' },
    { time: '10:00 - 10:15', monday: 'Break', tuesday: 'Break', wednesday: 'Break', thursday: 'Break', friday: 'Break' },
    { time: '10:15 - 11:15', monday: 'Science', tuesday: 'History', wednesday: 'English', thursday: 'Mathematics', friday: 'English' },
    { time: '11:15 - 12:15', monday: 'Art', tuesday: 'Geography', wednesday: 'Mathematics', thursday: 'English', friday: 'Science' },
    { time: '12:15 - 1:15', monday: 'Lunch', tuesday: 'Lunch', wednesday: 'Lunch', thursday: 'Lunch', friday: 'Lunch' },
    { time: '1:15 - 2:15', monday: 'History', tuesday: 'Science', wednesday: 'Geography', thursday: 'Art', friday: 'History' },
    { time: '2:15 - 3:15', monday: 'Geography', tuesday: 'Art', wednesday: 'History', thursday: 'Geography', friday: 'Art' }
];

// Materials data
let materialsData = [
    { title: 'Mathematics Textbook - Chapter 5', type: 'textbook', subject: 'Mathematics', date: '2024-01-10', file: 'math_ch5.pdf' },
    { title: 'English Assignment - Essay Writing', type: 'assignment', subject: 'English', date: '2024-01-12', file: 'english_essay.pdf' },
    { title: 'Science Lab Notes - Chemistry', type: 'notes', subject: 'Science', date: '2024-01-15', file: 'science_chem_notes.pdf' },
    { title: 'History Video Lecture - World War II', type: 'video', subject: 'History', date: '2024-01-18', file: 'history_ww2.mp4' },
    { title: 'Geography Map Assignment', type: 'assignment', subject: 'Geography', date: '2024-01-20', file: 'geo_maps.pdf' },
    { title: 'Art Project Guidelines', type: 'notes', subject: 'Art', date: '2024-01-22', file: 'art_project.pdf' }
];

// Skill badges data
let skillBadges = [
    { name: 'Mathematics Excellence', category: 'Academic', level: 'Gold', icon: 'fas fa-calculator' },
    { name: 'Creative Writing', category: 'Language', level: 'Silver', icon: 'fas fa-pen-fancy' },
    { name: 'Science Explorer', category: 'Academic', level: 'Gold', icon: 'fas fa-flask' },
    { name: 'Leadership', category: 'Soft Skills', level: 'Bronze', icon: 'fas fa-users' },
    { name: 'Public Speaking', category: 'Communication', level: 'Silver', icon: 'fas fa-microphone' },
    { name: 'Problem Solving', category: 'Critical Thinking', level: 'Gold', icon: 'fas fa-puzzle-piece' }
];

// Extracurricular activities
let extracurricularActivities = [
    { activity: 'School Debate Team', role: 'Team Captain', year: '2024', achievements: 'Won Regional Championship' },
    { activity: 'Science Club', role: 'Member', year: '2024', achievements: 'Participated in Science Fair' },
    { activity: 'Art Club', role: 'Vice President', year: '2024', achievements: 'Organized Art Exhibition' },
    { activity: 'Sports Team', role: 'Basketball Player', year: '2024', achievements: 'Team MVP Award' }
];

// Recent activities
let recentActivities = [
    { activity: 'Submitted Mathematics Assignment', time: '2 hours ago', icon: 'fas fa-file-alt', color: 'success' },
    { activity: 'Payment received for Library Fees', time: '1 day ago', icon: 'fas fa-credit-card', color: 'primary' },
    { activity: 'Downloaded Science Notes', time: '2 days ago', icon: 'fas fa-download', color: 'info' },
    { activity: 'Completed English Quiz', time: '3 days ago', icon: 'fas fa-check-circle', color: 'success' },
    { activity: 'Feedback submitted for Mr. Johnson', time: '1 week ago', icon: 'fas fa-comment', color: 'warning' }
];

// Upcoming events
let upcomingEvents = [
    { event: 'Parent-Teacher Meeting', date: '2024-01-25', time: '2:00 PM', type: 'meeting' },
    { event: 'Science Fair', date: '2024-02-01', time: '9:00 AM', type: 'competition' },
    { event: 'Sports Day', date: '2024-02-15', time: '8:00 AM', type: 'sports' },
    { event: 'Art Exhibition', date: '2024-03-01', time: '3:00 PM', type: 'exhibition' }
];

// Surveys data
let surveys = [
    { title: 'Teacher Evaluation Survey', status: 'Pending', dueDate: '2024-01-30', type: 'evaluation' },
    { title: 'School Facilities Feedback', status: 'Completed', dueDate: '2024-01-20', type: 'feedback' },
    { title: 'Library Services Survey', status: 'Pending', dueDate: '2024-02-05', type: 'feedback' }
];

// Initialize student portal
function initializeStudentPortal() {
    // Check if user is logged in and is a student
    if (!localStorage.getItem('schoolms_logged_in') || localStorage.getItem('user_type') !== 'student') {
        window.location.href = 'index.html';
        return;
    }

    // Update header information
    updateHeaderInfo();
    
    // Load initial dashboard
    loadDashboard();
}

// Update header information
function updateHeaderInfo() {
    document.getElementById('studentName').textContent = studentData.name;
    document.getElementById('headerStudentName').textContent = studentData.name;
    document.getElementById('headerPhoto').src = studentData.photo;
    document.getElementById('profilePhoto').src = studentData.photo;
    document.getElementById('profileStudentName').textContent = studentData.name;
    document.getElementById('profileClass').textContent = studentData.class;
    document.getElementById('profileStudentId').textContent = studentData.id;
}

// Load student data
function loadStudentData() {
    // Update quick stats
    document.getElementById('currentGrade').textContent = getGradeFromGPA(studentData.gpa);
    document.getElementById('attendanceRate').textContent = studentData.attendance + '%';
    document.getElementById('pendingFees').textContent = '$' + studentData.pendingFees;
    document.getElementById('assignmentsDue').textContent = studentData.assignmentsDue;
    document.getElementById('currentGPA').textContent = studentData.gpa;
    
    // Load academic results
    loadAcademicResults();
    
    // Load payment history
    loadPaymentHistory();
    
    // Load timetable
    loadTimetable();
    
    // Load materials
    loadMaterials();
    
    // Load portfolio data
    loadPortfolioData();
    
    // Load feedback data
    loadFeedbackData();
}

// Get grade from GPA
function getGradeFromGPA(gpa) {
    if (gpa >= 3.7) return 'Grade A';
    if (gpa >= 3.3) return 'Grade B';
    if (gpa >= 3.0) return 'Grade C';
    if (gpa >= 2.7) return 'Grade D';
    return 'Grade F';
}

// Load academic results
function loadAcademicResults() {
    const tbody = document.getElementById('academicResults');
    if (!tbody) return;
    
    tbody.innerHTML = academicResults.map(result => `
        <tr>
            <td><strong>${result.subject}</strong></td>
            <td class="grade-${getGradeClass(result.term1)}">${result.term1}%</td>
            <td class="grade-${getGradeClass(result.term2)}">${result.term2}%</td>
            <td class="grade-${getGradeClass(result.term3)}">${result.term3}%</td>
            <td class="grade-${getGradeClass(result.average)}"><strong>${result.average.toFixed(1)}%</strong></td>
            <td><span class="badge bg-${getGradeColor(result.grade)}">${result.grade}</span></td>
        </tr>
    `).join('');
}

// Get grade class for styling
function getGradeClass(score) {
    if (score >= 90) return 'a';
    if (score >= 80) return 'b';
    if (score >= 70) return 'c';
    if (score >= 60) return 'd';
    return 'f';
}

// Get grade color
function getGradeColor(grade) {
    switch(grade) {
        case 'A': return 'success';
        case 'B': return 'info';
        case 'C': return 'warning';
        case 'D': return 'secondary';
        case 'F': return 'danger';
        default: return 'secondary';
    }
}

// Load payment history
function loadPaymentHistory() {
    const tbody = document.getElementById('paymentHistory');
    if (!tbody) return;
    
    tbody.innerHTML = paymentHistory.map(payment => `
        <tr>
            <td>${formatDate(payment.date)}</td>
            <td>${payment.description}</td>
            <td>$${payment.amount}</td>
            <td><i class="fas fa-${getPaymentIcon(payment.method)} me-2"></i>${payment.method}</td>
            <td><span class="badge bg-${payment.status === 'Completed' ? 'success' : 'warning'}">${payment.status}</span></td>
            <td>
                ${payment.receipt ? 
                    `<button class="btn btn-sm btn-outline-primary" onclick="downloadReceipt('${payment.receipt}')">
                        <i class="fas fa-download me-1"></i>Receipt
                    </button>` : 
                    '<span class="text-muted">Pending</span>'
                }
            </td>
        </tr>
    `).join('');
}

// Get payment icon
function getPaymentIcon(method) {
    switch(method) {
        case 'Mobile Money': return 'mobile-alt';
        case 'Card': return 'credit-card';
        case 'Bank Transfer': return 'university';
        default: return 'money-bill';
    }
}

// Load timetable
function loadTimetable() {
    const tbody = document.getElementById('timetableBody');
    if (!tbody) return;
    
    tbody.innerHTML = timetableData.map(slot => `
        <tr>
            <td><strong>${slot.time}</strong></td>
            <td class="timetable-slot ${isCurrentSlot(slot.time, 'monday') ? 'current' : ''}">${slot.monday}</td>
            <td class="timetable-slot ${isCurrentSlot(slot.time, 'tuesday') ? 'current' : ''}">${slot.tuesday}</td>
            <td class="timetable-slot ${isCurrentSlot(slot.time, 'wednesday') ? 'current' : ''}">${slot.wednesday}</td>
            <td class="timetable-slot ${isCurrentSlot(slot.time, 'thursday') ? 'current' : ''}">${slot.thursday}</td>
            <td class="timetable-slot ${isCurrentSlot(slot.time, 'friday') ? 'current' : ''}">${slot.friday}</td>
        </tr>
    `).join('');
}

// Check if slot is current
function isCurrentSlot(time, day) {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();
    
    // Simple check - you can make this more sophisticated
    const dayMap = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5 };
    return currentDay === dayMap[day] && currentHour >= 8 && currentHour <= 15;
}

// Load materials
function loadMaterials() {
    const container = document.getElementById('assignedMaterials');
    if (!container) return;
    
    container.innerHTML = materialsData.map(material => `
        <div class="portfolio-item">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <h6 class="mb-1">${material.title}</h6>
                    <p class="text-muted mb-1">
                        <i class="fas fa-${getMaterialIcon(material.type)} me-2"></i>
                        ${material.subject} • ${formatDate(material.date)}
                    </p>
                </div>
                <div class="col-md-4 text-end">
                    <button class="btn btn-sm btn-outline-primary" onclick="downloadMaterial('${material.file}')">
                        <i class="fas fa-download me-1"></i>Download
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Get material icon
function getMaterialIcon(type) {
    switch(type) {
        case 'textbook': return 'book';
        case 'assignment': return 'file-alt';
        case 'notes': return 'sticky-note';
        case 'video': return 'video';
        default: return 'file';
    }
}

// Load portfolio data
function loadPortfolioData() {
    // Load academic history
    loadAcademicHistory();
    
    // Load skill badges
    loadSkillBadges();
    
    // Load extracurricular activities
    loadExtracurricularActivities();
    
    // Load achievements
    loadAchievements();
    
    // Load documents
    loadDocuments();
}

// Load academic history
function loadAcademicHistory() {
    const container = document.getElementById('academicHistory');
    if (!container) return;
    
    const history = [
        { year: '2024', grade: 'Grade 8A', gpa: '3.75', achievements: 'Honor Roll, Science Fair Winner' },
        { year: '2023', grade: 'Grade 7B', gpa: '3.60', achievements: 'Academic Excellence Award' },
        { year: '2022', grade: 'Grade 6A', gpa: '3.45', achievements: 'Perfect Attendance' }
    ];
    
    container.innerHTML = history.map(entry => `
        <div class="portfolio-item">
            <div class="row">
                <div class="col-md-3">
                    <h6 class="text-primary">${entry.year}</h6>
                    <p class="mb-0">${entry.grade}</p>
                </div>
                <div class="col-md-3">
                    <h6>GPA: ${entry.gpa}</h6>
                </div>
                <div class="col-md-6">
                    <p class="mb-0"><strong>Achievements:</strong> ${entry.achievements}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Load skill badges
function loadSkillBadges() {
    const container = document.getElementById('skillBadges');
    if (!container) return;
    
    container.innerHTML = skillBadges.map(badge => `
        <div class="skill-badge d-inline-block p-2 m-1 rounded">
            <i class="${badge.icon} me-2"></i>
            ${badge.name}
            <span class="badge bg-${getBadgeLevelColor(badge.level)} ms-2">${badge.level}</span>
        </div>
    `).join('');
}

// Get badge level color
function getBadgeLevelColor(level) {
    switch(level) {
        case 'Gold': return 'warning';
        case 'Silver': return 'secondary';
        case 'Bronze': return 'danger';
        default: return 'primary';
    }
}

// Load extracurricular activities
function loadExtracurricularActivities() {
    const container = document.getElementById('extracurricularActivities');
    if (!container) return;
    
    container.innerHTML = extracurricularActivities.map(activity => `
        <div class="portfolio-item">
            <div class="row">
                <div class="col-md-4">
                    <h6 class="text-primary">${activity.activity}</h6>
                    <p class="mb-0"><strong>Role:</strong> ${activity.role}</p>
                </div>
                <div class="col-md-3">
                    <p class="mb-0"><strong>Year:</strong> ${activity.year}</p>
                </div>
                <div class="col-md-5">
                    <p class="mb-0"><strong>Achievements:</strong> ${activity.achievements}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Load achievements
function loadAchievements() {
    const container = document.getElementById('achievements');
    if (!container) return;
    
    const achievements = [
        { type: 'Gold', icon: 'fas fa-trophy', title: 'Academic Excellence' },
        { type: 'Silver', icon: 'fas fa-medal', title: 'Leadership' },
        { type: 'Bronze', icon: 'fas fa-star', title: 'Creativity' }
    ];
    
    container.innerHTML = achievements.map(achievement => `
        <div class="achievement-badge achievement-${achievement.type.toLowerCase()}">
            <i class="${achievement.icon}" title="${achievement.title}"></i>
        </div>
    `).join('');
}

// Load documents
function loadDocuments() {
    const container = document.getElementById('studentDocuments');
    if (!container) return;
    
    const documents = [
        { name: 'Student ID Card', type: 'ID', status: 'Valid', expiry: '2025-12-31' },
        { name: 'Birth Certificate', type: 'Certificate', status: 'Valid', expiry: 'N/A' },
        { name: 'Medical Certificate', type: 'Medical', status: 'Expiring', expiry: '2024-03-15' }
    ];
    
    container.innerHTML = documents.map(doc => `
        <div class="document-card ${doc.status === 'Expired' ? 'expired' : doc.status === 'Expiring' ? 'expiring' : ''}">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${doc.name}</h6>
                    <small class="text-muted">${doc.type} • Expires: ${doc.expiry}</small>
                </div>
                <div>
                    <span class="badge bg-${doc.status === 'Valid' ? 'success' : doc.status === 'Expiring' ? 'warning' : 'danger'}">${doc.status}</span>
                    <button class="btn btn-sm btn-outline-primary ms-2" onclick="downloadDocument('${doc.name.toLowerCase().replace(' ', '-')}')">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load feedback data
function loadFeedbackData() {
    // Load surveys
    loadSurveys();
    
    // Load recent activities
    loadRecentActivities();
    
    // Load upcoming events
    loadUpcomingEvents();
}

// Load surveys
function loadSurveys() {
    const container = document.getElementById('surveysList');
    if (!container) return;
    
    container.innerHTML = surveys.map(survey => `
        <div class="survey-card p-3 mb-3">
            <h6 class="mb-2">${survey.title}</h6>
            <p class="text-muted mb-2">Due: ${formatDate(survey.dueDate)}</p>
            <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-${survey.status === 'Completed' ? 'success' : 'warning'}">${survey.status}</span>
                ${survey.status === 'Pending' ? 
                    `<button class="btn btn-sm btn-primary" onclick="takeSurvey('${survey.title}')">Take Survey</button>` : 
                    `<button class="btn btn-sm btn-outline-secondary" onclick="viewSurveyResults('${survey.title}')">View Results</button>`
                }
            </div>
        </div>
    `).join('');
}

// Load recent activities
function loadRecentActivities() {
    const container = document.getElementById('recentActivities');
    if (!container) return;
    
    container.innerHTML = recentActivities.map(activity => `
        <div class="d-flex align-items-center mb-3">
            <div class="me-3">
                <i class="fas ${activity.icon} text-${activity.color} fa-lg"></i>
            </div>
            <div class="flex-grow-1">
                <p class="mb-1">${activity.activity}</p>
                <small class="text-muted">${activity.time}</small>
            </div>
        </div>
    `).join('');
}

// Load upcoming events
function loadUpcomingEvents() {
    const container = document.getElementById('upcomingEvents');
    if (!container) return;
    
    container.innerHTML = upcomingEvents.map(event => `
        <div class="d-flex align-items-center mb-3">
            <div class="me-3">
                <i class="fas fa-calendar text-primary"></i>
            </div>
            <div class="flex-grow-1">
                <h6 class="mb-1">${event.event}</h6>
                <p class="mb-1 text-muted">${formatDate(event.date)} at ${event.time}</p>
                <span class="badge bg-${getEventTypeColor(event.type)}">${event.type}</span>
            </div>
        </div>
    `).join('');
}

// Get event type color
function getEventTypeColor(type) {
    switch(type) {
        case 'meeting': return 'primary';
        case 'competition': return 'success';
        case 'sports': return 'warning';
        case 'exhibition': return 'info';
        default: return 'secondary';
    }
}

// Initialize charts
function initializeCharts() {
    // Academic progress chart
    const progressCtx = document.getElementById('progressChart');
    if (progressCtx) {
        new Chart(progressCtx, {
            type: 'line',
            data: {
                labels: ['Term 1', 'Term 2', 'Term 3'],
                datasets: [{
                    label: 'GPA Progress',
                    data: [3.6, 3.7, 3.75],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 3.0,
                        max: 4.0
                    }
                }
            }
        });
    }
    
    // Performance chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'radar',
            data: {
                labels: ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art'],
                datasets: [{
                    label: 'Current Performance',
                    data: [92, 85, 89, 88, 86, 92],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    pointBackgroundColor: '#007bff'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Payment form
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }
    
    // Feedback forms
    const teacherFeedbackForm = document.getElementById('teacherFeedbackForm');
    if (teacherFeedbackForm) {
        teacherFeedbackForm.addEventListener('submit', handleTeacherFeedback);
    }
    
    const facilityFeedbackForm = document.getElementById('facilityFeedbackForm');
    if (facilityFeedbackForm) {
        facilityFeedbackForm.addEventListener('submit', handleFacilityFeedback);
    }
    
    const lessonFeedbackForm = document.getElementById('lessonFeedbackForm');
    if (lessonFeedbackForm) {
        lessonFeedbackForm.addEventListener('submit', handleLessonFeedback);
    }
    
    // Suggestion form
    const suggestionForm = document.getElementById('suggestionForm');
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', handleSuggestion);
    }
    
    // Rating stars
    setupRatingStars();
}

// Setup rating stars
function setupRatingStars() {
    document.querySelectorAll('.rating').forEach(rating => {
        const stars = rating.querySelectorAll('.fas.fa-star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                // Remove active class from all stars
                stars.forEach(s => s.classList.remove('text-warning'));
                // Add active class to clicked star and all before it
                for (let i = 0; i <= index; i++) {
                    stars[i].classList.add('text-warning');
                }
            });
        });
    });
}

// Handle payment
function handlePayment(e) {
    e.preventDefault();
    
    const paymentType = document.getElementById('paymentType').value;
    const amount = document.getElementById('paymentAmount').value;
    const method = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    if (!paymentType || !amount || !method) {
        showToast('Please fill in all payment details', 'warning');
        return;
    }
    
    // Show payment modal
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    paymentModal.show();
    
    // Simulate payment processing
    setTimeout(() => {
        paymentModal.hide();
        showToast('Payment processed successfully!', 'success');
        
        // Add to payment history
        const newPayment = {
            date: new Date().toISOString().split('T')[0],
            description: `${paymentType} Payment`,
            amount: parseInt(amount),
            method: method === 'mobile-money' ? 'Mobile Money' : method === 'card' ? 'Card' : 'Bank Transfer',
            status: 'Completed',
            receipt: 'REC' + Date.now()
        };
        
        paymentHistory.unshift(newPayment);
        loadPaymentHistory();
        
        // Reset form
        e.target.reset();
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
    }, 3000);
}

// Handle teacher feedback
function handleTeacherFeedback(e) {
    e.preventDefault();
    
    const teacher = document.getElementById('teacherSelect').value;
    const rating = document.querySelector('#teacher-feedback .rating .text-warning').length;
    const comments = document.getElementById('teacherComments').value;
    
    if (!teacher || !rating || !comments) {
        showToast('Please fill in all feedback details', 'warning');
        return;
    }
    
    showToast('Teacher feedback submitted successfully!', 'success');
    e.target.reset();
    document.querySelectorAll('#teacher-feedback .rating .fas').forEach(s => s.classList.remove('text-warning'));
}

// Handle facility feedback
function handleFacilityFeedback(e) {
    e.preventDefault();
    
    const facility = document.getElementById('facilitySelect').value;
    const rating = document.querySelector('#facility-feedback .rating .text-warning').length;
    const comments = document.getElementById('facilityComments').value;
    
    if (!facility || !rating || !comments) {
        showToast('Please fill in all feedback details', 'warning');
        return;
    }
    
    showToast('Facility feedback submitted successfully!', 'success');
    e.target.reset();
    document.querySelectorAll('#facility-feedback .rating .fas').forEach(s => s.classList.remove('text-warning'));
}

// Handle lesson feedback
function handleLessonFeedback(e) {
    e.preventDefault();
    
    const subject = document.getElementById('subjectSelect').value;
    const rating = document.querySelector('#lesson-feedback .rating .text-warning').length;
    const comments = document.getElementById('lessonComments').value;
    
    if (!subject || !rating || !comments) {
        showToast('Please fill in all feedback details', 'warning');
        return;
    }
    
    showToast('Lesson feedback submitted successfully!', 'success');
    e.target.reset();
    document.querySelectorAll('#lesson-feedback .rating .fas').forEach(s => s.classList.remove('text-warning'));
}

// Handle suggestion
function handleSuggestion(e) {
    e.preventDefault();
    
    const suggestion = document.getElementById('suggestionText').value;
    
    if (!suggestion.trim()) {
        showToast('Please enter your suggestion', 'warning');
        return;
    }
    
    showToast('Suggestion submitted successfully!', 'success');
    e.target.reset();
}

// Select payment method
function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    document.querySelector(`input[value="${method}"]`).checked = true;
}

// Download functions
function downloadDocument(type) {
    showToast(`Downloading ${type}...`, 'info');
    // Simulate download
    setTimeout(() => {
        showToast(`${type} downloaded successfully!`, 'success');
    }, 2000);
}

function downloadMaterial(file) {
    showToast(`Downloading ${file}...`, 'info');
    // Simulate download
    setTimeout(() => {
        showToast(`${file} downloaded successfully!`, 'success');
    }, 2000);
}

function downloadReceipt(receiptId) {
    showToast(`Downloading receipt ${receiptId}...`, 'info');
    // Simulate download
    setTimeout(() => {
        showToast(`Receipt ${receiptId} downloaded successfully!`, 'success');
    }, 2000);
}

// Survey functions
function takeSurvey(title) {
    showToast(`Opening survey: ${title}`, 'info');
    // Simulate survey opening
    setTimeout(() => {
        showToast(`Survey completed: ${title}`, 'success');
    }, 3000);
}

function viewSurveyResults(title) {
    showToast(`Viewing results for: ${title}`, 'info');
}

// Scholarship and bursary functions
function applyScholarship() {
    showToast('Opening scholarship application form...', 'info');
}

function applyBursary() {
    showToast('Opening bursary application form...', 'info');
}

function viewScholarships() {
    showToast('Loading available scholarships...', 'info');
}

// Notification functions
function showNotifications() {
    const notifications = [
        { title: 'New Assignment Posted', message: 'Mathematics assignment due in 3 days', time: '2 hours ago' },
        { title: 'Payment Received', message: 'Library fees payment confirmed', time: '1 day ago' },
        { title: 'Parent Meeting Reminder', message: 'Parent-teacher meeting tomorrow at 2 PM', time: '2 days ago' }
    ];
    
    const container = document.getElementById('notificationsList');
    if (container) {
        container.innerHTML = notifications.map(notification => `
            <div class="d-flex align-items-start mb-3">
                <div class="me-3">
                    <i class="fas fa-bell text-primary"></i>
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-1">${notification.title}</h6>
                    <p class="mb-1">${notification.message}</p>
                    <small class="text-muted">${notification.time}</small>
                </div>
            </div>
        `).join('');
    }
    
    const modal = new bootstrap.Modal(document.getElementById('notificationsModal'));
    modal.show();
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to page
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.appendChild(toast);
    document.body.appendChild(container);
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove after hidden
    toast.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(container);
    });
}

function showSection(section) {
    // Switch to specific tab
    const tab = document.querySelector(`#${section}-tab`);
    if (tab) {
        const bsTab = new bootstrap.Tab(tab);
        bsTab.show();
    }
}

function logout() {
    localStorage.removeItem('schoolms_logged_in');
    localStorage.removeItem('user_type');
    localStorage.removeItem('student_id');
    window.location.href = 'index.html';
}

// Load dashboard
function loadDashboard() {
    // Dashboard is loaded by default when the page loads
    // Additional dashboard-specific functionality can be added here
}

// Export functions for global access
window.downloadDocument = downloadDocument;
window.downloadMaterial = downloadMaterial;
window.downloadReceipt = downloadReceipt;
window.takeSurvey = takeSurvey;
window.viewSurveyResults = viewSurveyResults;
window.applyScholarship = applyScholarship;
window.applyBursary = applyBursary;
window.viewScholarships = viewScholarships;
window.showNotifications = showNotifications;
window.showSection = showSection;
window.logout = logout;
window.selectPaymentMethod = selectPaymentMethod; 