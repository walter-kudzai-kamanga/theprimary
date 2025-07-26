<?php
// staff.php
// TODO: Add authentication and role checks
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Staff & HR | SchoolMS</title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/animate.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container mt-4">
    <h2 class="mb-4">Staff & HR</h2>
    <!-- Add/Edit Staff Form (placeholder) -->
    <div class="card mb-4 animate__animated animate__fadeIn">
      <div class="card-header">Add/Edit Staff</div>
      <div class="card-body">
        <!-- TODO: Implement form fields and file upload -->
        <form>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" placeholder="Staff Name">
            </div>
            <div class="col-md-4">
              <label class="form-label">Role</label>
              <select class="form-select">
                <option>-- Select --</option>
                <option>Teacher</option>
                <option>Admin</option>
                <!-- Add more roles as needed -->
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Subject</label>
              <input type="text" class="form-control" placeholder="Subject">
            </div>
            <!-- Add more fields as needed -->
          </div>
          <button class="btn btn-primary mt-3">Save Staff</button>
        </form>
      </div>
    </div>
    <!-- Staff List Table (placeholder) -->
    <div class="card animate__animated animate__fadeInUp">
      <div class="card-header">Staff List</div>
      <div class="card-body">
        <!-- TODO: Implement search/filter, fetch from DB -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Placeholder rows -->
            <tr>
              <td>John Smith</td>
              <td>Teacher</td>
              <td>Mathematics</td>
              <td>
                <button class="btn btn-sm btn-info">View</button>
                <button class="btn btn-sm btn-warning">Edit</button>
              </td>
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