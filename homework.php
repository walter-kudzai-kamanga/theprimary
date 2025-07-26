<?php
// homework.php
// TODO: Add authentication and role checks
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Homework Assignment | SchoolMS</title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/animate.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container mt-4">
    <h2 class="mb-4">Homework Assignment</h2>
    <!-- Homework Assignment Form (placeholder) -->
    <div class="card mb-4 animate__animated animate__fadeIn">
      <div class="card-header">Assign Homework</div>
      <div class="card-body">
        <!-- TODO: Implement homework assignment form -->
        <form>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Subject</label>
              <input type="text" class="form-control" placeholder="Subject">
            </div>
            <div class="col-md-4">
              <label class="form-label">Due Date</label>
              <input type="date" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">Attach File</label>
              <input type="file" class="form-control">
            </div>
            <!-- Add more fields as needed -->
          </div>
          <button class="btn btn-primary mt-3">Assign Homework</button>
        </form>
      </div>
    </div>
    <!-- Homework Table (placeholder) -->
    <div class="card animate__animated animate__fadeInUp">
      <div class="card-header">Homework List</div>
      <div class="card-body">
        <!-- TODO: Implement homework table, fetch from DB -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Placeholder rows -->
            <tr>
              <td>Science</td>
              <td>2024-06-10</td>
              <td>Assigned</td>
              <td><button class="btn btn-sm btn-info">View</button></td>
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