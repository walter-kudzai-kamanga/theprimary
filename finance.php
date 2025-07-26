<?php
// finance.php
// TODO: Add authentication and role checks
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Finance & Fees | SchoolMS</title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/animate.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container mt-4">
    <h2 class="mb-4">Finance & Fees</h2>
    <!-- Fee Structure Form (placeholder) -->
    <div class="card mb-4 animate__animated animate__fadeIn">
      <div class="card-header">Fee Structure</div>
      <div class="card-body">
        <!-- TODO: Implement fee structure form -->
        <form>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Grade</label>
              <input type="text" class="form-control" placeholder="Grade">
            </div>
            <div class="col-md-4">
              <label class="form-label">Term</label>
              <input type="text" class="form-control" placeholder="Term">
            </div>
            <div class="col-md-4">
              <label class="form-label">Fee Amount</label>
              <input type="number" class="form-control" placeholder="Amount">
            </div>
            <!-- Add more fields as needed -->
          </div>
          <button class="btn btn-primary mt-3">Save Structure</button>
        </form>
      </div>
    </div>
    <!-- Finance Table (placeholder) -->
    <div class="card animate__animated animate__fadeInUp">
      <div class="card-header">Finance Summary</div>
      <div class="card-body">
        <!-- TODO: Implement finance table, fetch from DB -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Grade</th>
              <th>Term</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Placeholder rows -->
            <tr>
              <td>Grade 1</td>
              <td>Term 1</td>
              <td>$500</td>
              <td>Unpaid</td>
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