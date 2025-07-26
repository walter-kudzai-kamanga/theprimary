<?php
// attendance.php
// TODO: Add authentication and role checks
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Attendance | SchoolMS</title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/animate.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container mt-4">
    <h2 class="mb-4">Attendance & Register Marking</h2>
    <!-- Attendance Marking Form (placeholder) -->
    <div class="card mb-4 animate__animated animate__fadeIn">
      <div class="card-header">Mark Attendance</div>
      <div class="card-body">
        <!-- TODO: Implement attendance marking form -->
        <form>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Class</label>
              <select class="form-select">
                <option>-- Select --</option>
                <!-- TODO: Populate from DB -->
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Date</label>
              <input type="date" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">Session</label>
              <select class="form-select">
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary mt-3">Load Students</button>
        </form>
      </div>
    </div>
    <!-- Attendance Table (placeholder) -->
    <div class="card animate__animated animate__fadeInUp">
      <div class="card-header">Attendance List</div>
      <div class="card-body">
        <!-- TODO: Implement attendance table, fetch from DB -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Student</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Placeholder rows -->
            <tr>
              <td>Jane Doe</td>
              <td>Present</td>
              <td><button class="btn btn-sm btn-secondary">Toggle</button></td>
            </tr>
            <!-- TODO: Populate from DB -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <script src="assets/js/bootstrap.bundle.min.js"></script>
</body>
</html> 