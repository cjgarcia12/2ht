'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

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
}

export default function ShowsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      } else {
        setError('Failed to load events');
      }
    } catch(err: unknown) {
      setError(`Failed to load events: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchEvents}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Shows
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join us for unforgettable live music experiences
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No upcoming shows</h3>
            <p className="text-gray-600">Check back soon for new dates!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {event.imageUrl && (
                  <div className="h-48 bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${event.imageUrl})` }} />
                )}
                
                <div className="p-6">
                  <div className="flex items-center text-blue-600 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(event.date)} at {formatTime(event.date)}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-start text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                    <div>
                      {event.venue || event.address || event.city || event.state ? (
                        <>
                          {event.venue && <p className="font-medium">{event.venue}</p>}
                          {event.address && <p className="text-sm">{event.address}</p>}
                          {(event.city || event.state) && (
                            <p className="text-sm">
                              {event.city}{event.city && event.state && ', '}{event.state}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Venue TBA</p>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {event.price && (
                      <span className="text-lg font-semibold text-green-600">
                        {event.price}
                      </span>
                    )}
                    
                    {event.ticketUrl && (
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        Get Tickets <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
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