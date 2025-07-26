<?php
// inventory.php
// TODO: Add authentication and role checks
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Inventory Management | SchoolMS</title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/animate.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <?php include 'navbar.php'; ?>
  <div class="container mt-4">
    <h2 class="mb-4">Inventory Management</h2>
    <!-- Add/Edit Inventory Item Form (placeholder) -->
    <div class="card mb-4 animate__animated animate__fadeIn">
      <div class="card-header">Add/Edit Item</div>
      <div class="card-body">
        <!-- TODO: Implement inventory item form -->
        <form>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Item Name</label>
              <input type="text" class="form-control" placeholder="Item Name">
            </div>
            <div class="col-md-4">
              <label class="form-label">Category</label>
              <input type="text" class="form-control" placeholder="Category">
            </div>
            <div class="col-md-4">
              <label class="form-label">Quantity</label>
              <input type="number" class="form-control" placeholder="Quantity">
            </div>
            <!-- Add more fields as needed -->
          </div>
          <button class="btn btn-primary mt-3">Save Item</button>
        </form>
      </div>
    </div>
    <!-- Inventory Table (placeholder) -->
    <div class="card animate__animated animate__fadeInUp">
      <div class="card-header">Inventory List</div>
      <div class="card-body">
        <!-- TODO: Implement inventory table, fetch from DB -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Placeholder rows -->
            <tr>
              <td>Desk</td>
              <td>Furniture</td>
              <td>20</td>
              <td>OK</td>
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