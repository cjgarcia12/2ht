'use client';

import { useState, useEffect } from 'react';
import { Music, ExternalLink, Clock, User, Calendar, Users } from 'lucide-react';

interface Musician {
  name: string;
  instrument: string;
}

interface Song {
  _id: string;
  title: string;
  description?: string;
  releaseDate?: string;
  musicians?: Musician[];
  audioUrl?: string;
  artist?: string;
  album?: string;
  genre?: string;
  duration?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  soundcloudUrl?: string;
  lyrics?: string;
  imageUrl?: string;
  isOriginal: boolean;
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'originals' | 'covers'>('all');

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      const data = await response.json();
      
      if (data.success) {
        setSongs(data.data);
      } else {
        setError('Failed to load songs');
      }
    } catch {
      setError('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  const filteredSongs = songs.filter(song => {
    if (filter === 'originals') return song.isOriginal;
    if (filter === 'covers') return !song.isOriginal;
    return true;
  });

  const getStreamingLinks = (song: Song) => {
    const links = [];
    if (song.spotifyUrl) links.push({ name: 'Spotify', url: song.spotifyUrl, color: 'bg-green-600' });
    if (song.youtubeUrl) links.push({ name: 'YouTube', url: song.youtubeUrl, color: 'bg-red-600' });
    if (song.soundcloudUrl) links.push({ name: 'SoundCloud', url: song.soundcloudUrl, color: 'bg-orange-600' });
    return links;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading songs...</p>
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
            onClick={fetchSongs}
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
            Our Music
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Explore our collection of original songs and carefully selected covers
          </p>

          {/* Filter Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
            >
              All Songs ({songs.length})
            </button>
            <button
              onClick={() => setFilter('originals')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'originals'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
            >
              Originals ({songs.filter(s => s.isOriginal).length})
            </button>
            <button
              onClick={() => setFilter('covers')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'covers'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
            >
              Covers ({songs.filter(s => !s.isOriginal).length})
            </button>
          </div>
        </div>

        {filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === 'all' ? 'No songs yet' : `No ${filter} yet`}
            </h3>
            <p className="text-gray-600">Check back soon for new music!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song) => {
              const streamingLinks = getStreamingLinks(song);
              
              return (
                <div key={song._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {song.imageUrl ? (
                    <div 
                      className="h-48 bg-gray-200 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${song.imageUrl})` }}
                    />
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                      <Music className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        song.isOriginal 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {song.isOriginal ? 'Original' : 'Cover'}
                      </span>
                      {song.genre && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {song.genre}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {song.title}
                    </h3>
                    
                    {song.artist && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <User className="w-4 h-4 mr-1" />
                        <span className="text-sm">{song.artist}</span>
                      </div>
                    )}

                    {song.releaseDate && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          Released: {new Date(song.releaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {song.album && (
                      <p className="text-sm text-gray-600 mb-2">
                        Album: {song.album}
                      </p>
                    )}
                    
                    {song.duration && (
                      <div className="flex items-center text-gray-600 mb-3">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{song.duration}</span>
                      </div>
                    )}

                    {/* Musicians */}
                    {song.musicians && song.musicians.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center text-gray-700 mb-1">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Musicians:</span>
                        </div>
                        <div className="space-y-1">
                          {song.musicians.map((musician, index) => (
                            <p key={index} className="text-xs text-gray-600 ml-5">
                              {musician.name} - {musician.instrument}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Audio Player */}
                    {song.audioUrl && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Music className="w-4 h-4 mr-1" />
                          Listen Now:
                        </p>
                        <audio controls className="w-full">
                          <source src={song.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    
                    {song.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {song.description}
                      </p>
                    )}
                    
                    {/* Streaming Links */}
                    {streamingLinks.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Also available on:</p>
                        <div className="flex flex-wrap gap-2">
                          {streamingLinks.map((link) => (
                            <a
                              key={link.name}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${link.color} text-white px-3 py-1 rounded text-sm hover:opacity-90 transition-opacity flex items-center gap-1`}
                            >
                              {link.name} <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 