//src/pages/AdminPanel.jsx
import React, { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/users', { credentials: 'include' }),
        fetch('http://localhost:5000/api/admin/tasks', { credentials: 'include' })
      ]);

      const usersData = await usersRes.json();
      const tasksData = await tasksRes.json();

      if (usersRes.ok) setUsers(usersData);
      if (tasksRes.ok) setTasks(tasksData);
    } catch (err) {
      console.error('Admin Fetch Error:', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task permanently?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Task deleted');
        setTasks(tasks.filter(t => t._id !== id));
      } else {
        setMessage(data.message || 'Failed to delete');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">🔐 Admin Panel</h1>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">👤 Registered Users</h2>
        <ul className="list-disc pl-6 space-y-1">
          {users.map(user => (
            <li key={user._id}>{user.name} - {user.email} ({user.role})</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">🗂️ All Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-600">No tasks found.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map(task => (
              <li key={task._id} className="bg-gray-100 p-4 rounded shadow relative">
                <div className="font-bold text-lg">{task.title}</div>
                <div className="text-sm text-gray-700">By: {task.user.name} ({task.user.email})</div>
                <div className="text-sm">Priority: {task.priority} | Status: {task.status}</div>
                <div className="text-sm">Deadline: {new Date(task.deadline).toLocaleDateString()}</div>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
