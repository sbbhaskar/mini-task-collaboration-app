// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getAllTasks,
  deleteAnyTask
} = require('../controllers/adminController');

const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');

// Require login + admin check
router.use(isLoggedIn);
router.use(isAdmin);

// Admin routes
router.get('/users', getAllUsers);
router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', deleteAnyTask);

module.exports = router;
