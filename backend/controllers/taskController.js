// controllers/taskController.js
const Task = require('../models/Task');

// Create a task (User only)
exports.createTask = async (req, res) => {
  try {
    const { title, deadline, priority } = req.body;

    const task = new Task({
      title,
      deadline,
      priority,
      user: req.session.user.id,
    });

    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

// Get tasks of logged-in user
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.session.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
};

// Update own task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.session.user.id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    Object.assign(task, req.body); // title, deadline, priority, status
    await task.save();

    res.status(200).json({ message: 'Task updated', task });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
};

// Delete own task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });

    if (!task) return res.status(404).json({ message: 'Task not found or unauthorized' });

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};
