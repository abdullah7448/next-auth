'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', department: '', roll: '' });

  useEffect(() => {
    fetchStudent();
  }, []);

  async function fetchStudent() {
    const res = await fetch(`/api/students/${id}`);
    const data = await res.json();
    setForm({
      name: data.name || '',
      department: data.department || '',
      roll: data.roll || '',
    });
  }

  async function updateStudent(e) {
    e.preventDefault();
    await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, roll: Number(form.roll) }),
    });
    router.push('/students');
  }

  async function deleteStudent() {
    await fetch(`/api/students/${id}`, { method: 'DELETE' });
    router.push('/students');
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Edit Student</h1>

      <form onSubmit={updateStudent} className="mb-3">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <input
            className="form-control"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Roll</label>
          <input
            className="form-control"
            type="number"
            value={form.roll}
            onChange={(e) => setForm({ ...form, roll: e.target.value })}
          />
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-success">Update</button>
          <button type="button" onClick={deleteStudent} className="btn btn-danger">
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
