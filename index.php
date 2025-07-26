<?php
session_start();
// TODO: Add authentication check
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard | SchoolMS</title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/animate.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
  <script src="assets/js/chart.min.js"></script>
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container-fluid mt-4">
    <div class="row g-4">
      <!-- Dashboard Cards (placeholders, animated) -->
      <div class="col-md-3">
        <div class="card dashboard-card animate__animated animate__fadeInUp">
          <div class="card-body text-center">
            <h5>Total Students</h5>
            <h2 id="totalStudents">0</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card dashboard-card animate__animated animate__fadeInUp">
          <div class="card-body text-center">
            <h5>Total Staff</h5>
            <h2 id="totalStaff">0</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card dashboard-card animate__animated animate__fadeInUp">
          <div class="card-body text-center">
            <h5>Active Classes</h5>
            <h2 id="totalClasses">0</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card dashboard-card animate__animated animate__fadeInUp">
          <div class="card-body text-center">
            <h5>Active Lessons</h5>
            <h2 id="activeLessons">0</h2>
          </div>
        </div>
      </div>
    </div>
    <!-- Alerts -->
    <div class="row mt-4">
      <div class="col">
        <div id="alertsArea"></div>
      </div>
    </div>
    <!-- Financial Summary & Attendance Snapshot -->
    <div class="row mt-4">
      <div class="col-md-6">
        <div class="card animate__animated animate__fadeInLeft">
          <div class="card-header">Financial Summary</div>
          <div class="card-body">
            <div id="financialSummary"></div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card animate__animated animate__fadeInRight">
          <div class="card-header">Attendance Snapshot</div>
          <div class="card-body">
            <canvas id="attendanceChart"></canvas>
          </div>
        </div>
      </div>
    </div>
    <!-- Module Navigation -->
    <div class="row mt-4">
      <div class="col">
        <div class="module-nav d-flex flex-wrap gap-3">
          <a href="students.php" class="btn btn-outline-primary module-btn">Student Management</a>
          <a href="staff.php" class="btn btn-outline-secondary module-btn">Staff & HR</a>
          <a href="attendance.php" class="btn btn-outline-success module-btn">Attendance</a>
          <a href="lessons.php" class="btn btn-outline-info module-btn">Lesson Planning</a>
          <a href="tests.php" class="btn btn-outline-warning module-btn">Test Creation</a>
          <a href="homework.php" class="btn btn-outline-danger module-btn">Homework</a>
          <a href="finance.php" class="btn btn-outline-dark module-btn">Finance & Fees</a>
          <a href="inventory.php" class="btn btn-outline-primary module-btn">Inventory</a>
          <a href="transport.php" class="btn btn-outline-secondary module-btn">Fleet/Transport</a>
          <a href="alerts.php" class="btn btn-outline-success module-btn">Alerts & Incidents</a>
        </div>
      </div>
    </div>
  </div>
  <script src="assets/js/bootstrap.bundle.min.js"></script>
  <script src="assets/js/script.js"></script>
</body>
</html> 