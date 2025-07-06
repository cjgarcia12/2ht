'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Music, Mail, Users, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalEvents: number;
  totalSongs: number;
  totalBookings: number;
  pendingBookings: number;
}

interface BookingData {
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalSongs: 0,
    totalBookings: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
      return;
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const [eventsRes, songsRes, bookingsRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/songs'),
        fetch('/api/bookings')
      ]);

      const eventsData = await eventsRes.json();
      const songsData = await songsRes.json();
      const bookingsData = await bookingsRes.json();

      const pendingBookings = bookingsData.success 
        ? bookingsData.data.filter((booking: BookingData) => booking.status === 'pending').length 
        : 0;

      setStats({
        totalEvents: eventsData.success ? eventsData.data.length : 0,
        totalSongs: songsData.success ? songsData.data.length : 0,
        totalBookings: bookingsData.success ? bookingsData.data.length : 0,
        pendingBookings
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-pink-600',
      link: '/admin/events'
    },
    {
      title: 'Total Songs',
      value: stats.totalSongs,
      icon: Music,
      color: 'bg-gray-700',
      link: '/admin/songs'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Mail,
      color: 'bg-pink-500',
      link: '/admin/bookings'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Users,
      color: 'bg-gray-600',
      link: '/admin/bookings'
    }
  ];


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
      <div className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-pink-400">2HTSounds Admin</h1>
              <p className="text-gray-200">Manage your band website</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-200 hover:text-pink-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <Link key={index} href={card.link} className="group">
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-pink-500">
                <div className="flex items-center">
                  <div className={`${card.color} rounded-lg p-3`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600">
                      {card.title}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Management Menu */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Management Menu</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin/events" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-5 h-5 text-pink-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Events</h3>
                  <p className="text-sm text-gray-700">View, edit, and delete events</p>
                </div>
              </Link>
              
              <Link href="/admin/songs" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Music className="w-5 h-5 text-gray-700 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Songs</h3>
                  <p className="text-sm text-gray-700">View, edit, and delete songs</p>
                </div>
              </Link>
              
              <Link href="/admin/bookings" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-5 h-5 text-pink-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Bookings</h3>
                  <p className="text-sm text-gray-700">View and respond to booking requests</p>
                </div>
              </Link>
              
              <Link href="/admin/settings" className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Site Settings</h3>
                  <p className="text-sm text-gray-700">Edit website content and text</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 