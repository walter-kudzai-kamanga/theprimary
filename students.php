<?php
// students.php
// TODO: Add authentication and role checks
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Management | SchoolMS</title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/animate.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container mt-4">
    <h2 class="mb-4">Student Management</h2>
    <!-- Add/Edit Student Form (placeholder) -->
    <div class="card mb-4 animate__animated animate__fadeIn">
      <div class="card-header">Add/Edit Student</div>
      <div class="card-body">
        <!-- TODO: Implement form fields and file upload -->
        <form>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" placeholder="Student Name">
            </div>
            <div class="col-md-4">
              <label class="form-label">Date of Birth</label>
              <input type="date" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">Class</label>
              <select class="form-select">
                <option>-- Select --</option>
                <!-- TODO: Populate from DB -->
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Registration Number</label>
              <input type="text" class="form-control" value="SCH-2024-XXXXXX" readonly>
            </div>
            <div class="col-md-4">
              <label class="form-label">Photo</label>
              <input type="file" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">Birth Certificate</label>
              <input type="file" class="form-control">
            </div>
            <!-- Add more fields as needed -->
          </div>
          <button class="btn btn-primary mt-3">Save Student</button>
        </form>
      </div>
    </div>
    <!-- Student List Table (placeholder) -->
    <div class="card animate__animated animate__fadeInUp">
      <div class="card-header">Student List</div>
      <div class="card-body">
        <!-- TODO: Implement search/filter, fetch from DB -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Placeholder rows -->
            <tr>
              <td>SCH-2024-000001</td>
              <td>Jane Doe</td>
              <td>Grade 1</td>
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