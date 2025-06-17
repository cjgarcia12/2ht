'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Calendar, MapPin, User, Phone, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  eventDate: string;
  eventType: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  expectedAttendance?: number;
  budget?: string;
  message: string;
  status: 'pending' | 'confirmed' | 'declined' | 'completed';
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined' | 'completed'>('all');
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
      return;
    }

    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data);
      } else {
        setError('Failed to load bookings');
      }
    } catch {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingStatus(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: newStatus as Booking['status'] }
            : booking
        ));
      } else {
        alert('Failed to update booking status');
      }
    } catch {
      alert('Failed to update booking status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeDisplay = (type: string) => {
    switch (type) {
      case 'wedding': return 'Wedding';
      case 'corporate': return 'Corporate Event';
      case 'festival': return 'Festival';
      case 'private-party': return 'Private Party';
      case 'bar-gig': return 'Bar/Club Gig';
      default: return 'Other';
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
            <Link
              href="/admin"
              className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
              <p className="text-gray-600">View and respond to booking requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'declined', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
            >
              {status} ({status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length})
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h3>
            <p className="text-gray-600">Booking requests will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-500" />
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.name}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Submitted {formatDate(booking.createdAt)}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Contact Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a href={`mailto:${booking.email}`} className="text-blue-600 hover:text-blue-700">
                            {booking.email}
                          </a>
                        </div>
                        {booking.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <a href={`tel:${booking.phone}`} className="text-blue-600 hover:text-blue-700">
                              {booking.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Event Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{formatDate(booking.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Type:</span>
                          <span>{getEventTypeDisplay(booking.eventType)}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium">{booking.venue}</p>
                            <p>{booking.address}</p>
                            <p>{booking.city}, {booking.state}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Additional Details</h4>
                      <div className="space-y-2">
                        {booking.expectedAttendance && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span>Expected attendance: {booking.expectedAttendance}</span>
                          </div>
                        )}
                        {booking.budget && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span>Budget: {booking.budget}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Message</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {booking.message}
                      </p>
                    </div>
                  </div>

                  {/* Status Actions */}
                  {booking.status === 'pending' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                          disabled={updatingStatus === booking._id}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {updatingStatus === booking._id ? 'Updating...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'declined')}
                          disabled={updatingStatus === booking._id}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {updatingStatus === booking._id ? 'Updating...' : 'Decline'}
                        </button>
                      </div>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            ✓ Event created automatically (private by default)
                          </span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          You can make this event public in the Events management section
                        </p>
                      </div>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'completed')}
                        disabled={updatingStatus === booking._id}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {updatingStatus === booking._id ? 'Updating...' : 'Mark as Completed'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 