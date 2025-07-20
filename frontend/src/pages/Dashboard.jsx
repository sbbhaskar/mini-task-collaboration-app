//src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    deadline: '',
    priority: 'medium',
  });
  const [message, setMessage] = useState('');
  const [editTaskId, setEditTaskId] = useState(null); // Track if editing
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (err) {
      console.error('Fetch tasks error:', err.message);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.deadline) {
      setMessage('Title and deadline are required.');
      return;
    }

    try {
      const url = editTaskId
        ? `http://localhost:5000/api/tasks/${editTaskId}`
        : 'http://localhost:5000/api/tasks';

      const method = editTaskId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(editTaskId ? '✅ Task updated' : '✅ Task created');
        setForm({ title: '', deadline: '', priority: 'medium' });
        setEditTaskId(null);
        fetchTasks();
      } else {
        setMessage(data.message || 'Failed to save task');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      deadline: task.deadline.split('T')[0],
      priority: task.priority,
    });
    setEditTaskId(task._id);
  };

  const handleMarkDone = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'completed' }),
      });

      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Mark done error:', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Delete task error:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>

        {/* ✅ Task Form */}
        <form onSubmit={handleCreateOrUpdate} className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold">
            {editTaskId ? '✏️ Edit Task' : '📝 Create New Task'}
          </h2>
          {message && <p className="text-sm text-green-600">{message}</p>}
          <input
            type="text"
            name="title"
            placeholder="Task title"
            className="border p-2 w-full"
            value={form.title}
            onChange={handleChange}
          />
          <input
            type="date"
            name="deadline"
            className="border p-2 w-full"
            value={form.deadline}
            onChange={handleChange}
          />
          <select
            name="priority"
            className="border p-2 w-full"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editTaskId ? 'Update Task' : 'Add Task'}
          </button>
          {editTaskId && (
            <button
              type="button"
              className="ml-2 px-4 py-2 border rounded"
              onClick={() => {
                setEditTaskId(null);
                setForm({ title: '', deadline: '', priority: 'medium' });
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* ✅ Task List */}
        <h2 className="text-xl mb-2">Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task._id} className="bg-gray-50 p-4 rounded shadow">
                <div className="font-semibold text-lg">{task.title}</div>
                <div className="text-sm text-gray-600">Priority: {task.priority}</div>
                <div className="text-sm text-gray-600">Status: {task.status}</div>
                <div className="text-sm text-gray-600">
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </div>

                <div className="mt-2 space-x-2">
                  <button
                    className="px-3 py-1 bg-yellow-400 text-white rounded"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded"
                    onClick={() => handleMarkDone(task._id)}
                  >
                    Mark as Done
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
