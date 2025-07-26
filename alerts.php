<?php
// alerts.php
// TODO: Add authentication and role checks
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Alerts & Incidents | SchoolMS</title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/animate.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container mt-4">
    <h2 class="mb-4">Alerts & Incident Reporting</h2>
    <!-- Incident Reporting Form (placeholder) -->
    <div class="card mb-4 animate__animated animate__fadeIn">
      <div class="card-header">Log Incident</div>
      <div class="card-body">
        <!-- TODO: Implement incident reporting form -->
        <form>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Category</label>
              <select class="form-select">
                <option>Discipline</option>
                <option>Safety</option>
                <option>Maintenance</option>
                <!-- Add more categories as needed -->
              </select>
            </div>
            <div class="col-md-8">
              <label class="form-label">Description</label>
              <input type="text" class="form-control" placeholder="Describe the incident">
            </div>
            <div class="col-md-4">
              <label class="form-label">Attach File</label>
              <input type="file" class="form-control">
            </div>
            <!-- Add more fields as needed -->
          </div>
          <button class="btn btn-primary mt-3">Log Incident</button>
        </form>
      </div>
    </div>
    <!-- Alerts Table (placeholder) -->
    <div class="card animate__animated animate__fadeInUp">
      <div class="card-header">Alerts & Incidents</div>
      <div class="card-body">
        <!-- TODO: Implement alerts/incidents table, fetch from DB -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Placeholder rows -->
            <tr>
              <td>Maintenance</td>
              <td>Broken window in Lab 2</td>
              <td>Open</td>
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