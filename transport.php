<?php
// transport.php
// TODO: Add authentication and role checks
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Fleet/Transport | SchoolMS</title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/animate.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container mt-4">
    <h2 class="mb-4">Fleet/Transport</h2>
    <!-- Add/Edit Bus/Driver Form (placeholder) -->
    <div class="card mb-4 animate__animated animate__fadeIn">
      <div class="card-header">Register Bus/Driver</div>
      <div class="card-body">
        <!-- TODO: Implement bus/driver form -->
        <form>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Bus Number</label>
              <input type="text" class="form-control" placeholder="Bus Number">
            </div>
            <div class="col-md-4">
              <label class="form-label">Driver Name</label>
              <input type="text" class="form-control" placeholder="Driver Name">
            </div>
            <div class="col-md-4">
              <label class="form-label">Route</label>
              <input type="text" class="form-control" placeholder="Route">
            </div>
            <!-- Add more fields as needed -->
          </div>
          <button class="btn btn-primary mt-3">Register</button>
        </form>
      </div>
    </div>
    <!-- Fleet Table (placeholder) -->
    <div class="card animate__animated animate__fadeInUp">
      <div class="card-header">Fleet List</div>
      <div class="card-body">
        <!-- TODO: Implement fleet table, fetch from DB -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Bus</th>
              <th>Driver</th>
              <th>Route</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Placeholder rows -->
            <tr>
              <td>Bus 1</td>
              <td>Mike Brown</td>
              <td>Route A</td>
              <td>Active</td>
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