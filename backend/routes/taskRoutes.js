// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const { isLoggedIn } = require('../middleware/authMiddleware');

router.use(isLoggedIn);

router.post('/', createTask);               // POST /api/tasks
router.get('/', getMyTasks);               // GET /api/tasks
router.put('/:id', updateTask);            // PUT /api/tasks/:id
router.delete('/:id', deleteTask);         // DELETE /api/tasks/:id

module.exports = router;
