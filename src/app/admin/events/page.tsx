'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Edit, Trash2, Plus, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  ticketUrl?: string;
  price?: string;
  imageUrl?: string;
  isPublic: boolean;
  bookingId?: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingVisibility, setUpdatingVisibility] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
      return;
    }

    fetchEvents();
  }, [router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?includePrivate=true');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      } else {
        setError('Failed to load events');
      }
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    setDeleting(eventId);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setEvents(events.filter(event => event._id !== eventId));
      } else {
        alert('Failed to delete event');
      }
    } catch {
      alert('Failed to delete event');
    } finally {
      setDeleting(null);
    }
  };

  const toggleEventVisibility = async (eventId: string, currentIsPublic: boolean) => {
    setUpdatingVisibility(eventId);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic: !currentIsPublic }),
      });

      const data = await response.json();
      
      if (data.success) {
        setEvents(events.map(event => 
          event._id === eventId 
            ? { ...event, isPublic: !currentIsPublic }
            : event
        ));
      } else {
        alert('Failed to update event visibility');
      }
    } catch {
      alert('Failed to update event visibility');
    } finally {
      setUpdatingVisibility(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
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
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
                <p className="text-gray-600">Create, edit, and delete show dates</p>
              </div>
            </div>
            <Link
              href="/admin/events/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Event
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-6">Create your first event to get started</p>
            <Link
              href="/admin/events/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Event
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-600 font-medium">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {event.description}
                      </p>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <p className="font-medium">{event.venue}</p>
                        <p>{event.address}</p>
                        <p>{event.city}, {event.state}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {event.price && (
                          <span className="text-green-600 font-semibold">
                            {event.price}
                          </span>
                        )}
                        {event.ticketUrl && (
                          <a
                            href={event.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                          >
                            Ticket Link <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      
                      {/* Visibility Status and Toggle */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.isPublic 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {event.isPublic ? '🌍 Public' : '🔒 Private'}
                          </span>
                          {event.bookingId && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              📅 From Booking
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => toggleEventVisibility(event._id, event.isPublic)}
                          disabled={updatingVisibility === event._id}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            event.isPublic
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-green-200 text-green-700 hover:bg-green-300'
                          } disabled:opacity-50`}
                        >
                          {updatingVisibility === event._id 
                            ? 'Updating...' 
                            : event.isPublic 
                              ? 'Make Private' 
                              : 'Make Public'
                          }
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/admin/events/edit/${event._id}`}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit event"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(event._id)}
                        disabled={deleting === event._id}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete event"
                      >
                        {deleting === event._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 