'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Save, Trash2, Edit, ArrowLeft } from 'lucide-react';

interface Musician {
  _id?: string;
  name: string;
  instrument: string;
}

export default function AdminMusiciansPage() {
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Musician>({ name: '', instrument: '' });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
      return;
    }
    fetchMusicians();
  }, [router]);

  const fetchMusicians = async () => {
    try {
      const res = await fetch('/api/musicians');
      const data = await res.json();
      if (data.success) setMusicians(data.data);
      else setError('Failed to load musicians');
    } catch {
      setError('Failed to load musicians');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', instrument: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const res = await fetch(`/api/musicians/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setMusicians(prev => prev.map(m => (m._id === editingId ? data.data : m)));
          resetForm();
        } else {
          setError(data.error || 'Failed to update musician');
        }
      } else {
        const res = await fetch('/api/musicians', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setMusicians(prev => [...prev, data.data].sort((a, b) => a.name.localeCompare(b.name)));
          resetForm();
        } else {
          setError(data.error || 'Failed to add musician');
        }
      }
    } catch {
      setError('Request failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this musician?')) return;
    try {
      const res = await fetch(`/api/musicians/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setMusicians(prev => prev.filter(m => m._id !== id));
      else alert('Failed to delete musician');
    } catch {
      alert('Failed to delete musician');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/admin" className="mr-4 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center">
              <Users className="w-6 h-6 text-gray-700 mr-2" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Musicians</h1>
                <p className="text-gray-600">Manage your roster of musicians</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Jane Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instrument</label>
              <input
                type="text"
                value={form.instrument}
                onChange={(e) => setForm({ ...form, instrument: e.target.value })}
                placeholder="e.g., Guitar"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          {error && (
            <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>
          )}
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {musicians.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No musicians yet. Add your first musician above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {musicians.map((m) => (
                  <div key={m._id} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <p className="font-medium text-gray-900">{m.name}</p>
                      <p className="text-gray-600 text-sm">{m.instrument}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50"
                        onClick={() => {
                          setEditingId(m._id!);
                          setForm({ name: m.name, instrument: m.instrument });
                        }}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50"
                        onClick={() => handleDelete(m._id!)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


