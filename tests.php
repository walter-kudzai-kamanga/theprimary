<?php
// tests.php
// TODO: Add authentication and role checks
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test Creation | SchoolMS</title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/animate.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container mt-4">
    <h2 class="mb-4">Test Creation & Printing</h2>
    <!-- Test Creation Form (placeholder) -->
    <div class="card mb-4 animate__animated animate__fadeIn">
      <div class="card-header">Create Test</div>
      <div class="card-body">
        <!-- TODO: Implement test creation form -->
        <form>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Subject</label>
              <input type="text" class="form-control" placeholder="Subject">
            </div>
            <div class="col-md-4">
              <label class="form-label">Type</label>
              <select class="form-select">
                <option>MCQ</option>
                <option>Short Answer</option>
                <option>Long Answer</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Attach File</label>
              <input type="file" class="form-control">
            </div>
            <!-- Add more fields as needed -->
          </div>
          <button class="btn btn-primary mt-3">Save Test</button>
        </form>
      </div>
    </div>
    <!-- Tests Table (placeholder) -->
    <div class="card animate__animated animate__fadeInUp">
      <div class="card-header">Tests</div>
      <div class="card-body">
        <!-- TODO: Implement tests table, fetch from DB -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Placeholder rows -->
            <tr>
              <td>English</td>
              <td>MCQ</td>
              <td>Draft</td>
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