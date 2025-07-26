<?php
// lessons.php
// TODO: Add authentication and role checks
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lesson Planning | SchoolMS</title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/animate.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container mt-4">
    <h2 class="mb-4">Lesson Planning</h2>
    <!-- Lesson Plan Form (placeholder) -->
    <div class="card mb-4 animate__animated animate__fadeIn">
      <div class="card-header">Create Lesson Plan</div>
      <div class="card-body">
        <!-- TODO: Implement lesson plan form -->
        <form>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Subject</label>
              <input type="text" class="form-control" placeholder="Subject">
            </div>
            <div class="col-md-4">
              <label class="form-label">Week</label>
              <input type="number" class="form-control" placeholder="Week Number">
            </div>
            <div class="col-md-4">
              <label class="form-label">Attach Material</label>
              <input type="file" class="form-control">
            </div>
            <!-- Add more fields as needed -->
          </div>
          <button class="btn btn-primary mt-3">Save Plan</button>
        </form>
      </div>
    </div>
    <!-- Lesson Plans Table (placeholder) -->
    <div class="card animate__animated animate__fadeInUp">
      <div class="card-header">Lesson Plans</div>
      <div class="card-body">
        <!-- TODO: Implement plans table, fetch from DB -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Week</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Placeholder rows -->
            <tr>
              <td>Mathematics</td>
              <td>1</td>
              <td>Pending</td>
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