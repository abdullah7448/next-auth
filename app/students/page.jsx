'use client';

import { useEffect, useState } from 'react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', department: '', roll: '' });
  const [editForm, setEditForm] = useState({ id: '', name: '', department: '', roll: '' });

  useEffect(() => {
    fetchStudents();

    // Load Bootstrap JS dynamically on client
    import('bootstrap/dist/js/bootstrap.bundle.min.js').then((bootstrap) => {
      window.bootstrap = bootstrap;
    });
  }, []);

  async function fetchStudents() {
    const res = await fetch('/api/students');
    const data = await res.json();
    setStudents(data);
  }

  async function addStudent(e) {
    e.preventDefault();
    if (!form.name || !form.department || !form.roll) return alert('All fields are required');

    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, department: form.department, roll: Number(form.roll) }),
    });

    setForm({ name: '', department: '', roll: '' });
    fetchStudents();
  }

  async function updateStudent(e) {
    e.preventDefault();
    if (!editForm.name || !editForm.department || !editForm.roll) return alert('All fields are required');

    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        id: editForm.id,
        name: editForm.name,
        department: editForm.department,
        roll: Number(editForm.roll),
      }),
    });

    fetchStudents();

    // Close modal using Bootstrap API
    const modal = window.bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
  }

  async function deleteStudent(id) {
    if (!confirm('Are you sure?')) return;

    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });

    fetchStudents();
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Students Management</h1>

      {/* Add Form */}
      <form onSubmit={addStudent} className="row g-3 mb-4">
        <div className="col-md-4">
          <input className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </div>
        <div className="col-md-2">
          <input className="form-control" type="number" placeholder="Roll" value={form.roll} onChange={(e) => setForm({ ...form, roll: e.target.value })} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      {/* Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Roll</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.student_id}>
              <td>{s.name}</td>
              <td>{s.department}</td>
              <td>{s.roll}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  onClick={() =>
                    setEditForm({
                      id: s.student_id,
                      name: s.name || '',
                      department: s.department || '',
                      roll: s.roll || '',
                    })
                  }
                >
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteStudent(s.student_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form onSubmit={updateStudent} className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Student</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Department</label>
                <input className="form-control" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Roll</label>
                <input className="form-control" type="number" value={editForm.roll} onChange={(e) => setEditForm({ ...editForm, roll: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-success">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
