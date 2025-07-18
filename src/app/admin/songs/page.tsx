'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Edit, Trash2, Plus, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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
  imageUrl?: string;
  isOriginal: boolean;
}

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'originals' | 'covers'>('all');
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
      return;
    }

    fetchSongs();
  }, [router]);

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

  const handleDelete = async (songId: string) => {
    if (!confirm('Are you sure you want to delete this song?')) {
      return;
    }

    setDeleting(songId);
    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setSongs(songs.filter(song => song._id !== songId));
      } else {
        alert('Failed to delete song');
      }
    } catch {
      alert('Failed to delete song');
    } finally {
      setDeleting(null);
    }
  };

  const filteredSongs = songs.filter(song => {
    if (filter === 'originals') return song.isOriginal;
    if (filter === 'covers') return !song.isOriginal;
    return true;
  });

  const getStreamingLinks = (song: Song) => {
    const links = [];
    if (song.spotifyUrl) links.push({ name: 'Spotify', url: song.spotifyUrl });
    if (song.youtubeUrl) links.push({ name: 'YouTube', url: song.youtubeUrl });
    if (song.soundcloudUrl) links.push({ name: 'SoundCloud', url: song.soundcloudUrl });
    return links;
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Songs</h1>
                <p className="text-gray-600">Manage your music catalog</p>
              </div>
            </div>
            <Link
              href="/admin/songs/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Song
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            All Songs ({songs.length})
          </button>
          <button
            onClick={() => setFilter('originals')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'originals'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            Originals ({songs.filter(s => s.isOriginal).length})
          </button>
          <button
            onClick={() => setFilter('covers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'covers'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            Covers ({songs.filter(s => !s.isOriginal).length})
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === 'all' ? 'No songs yet' : `No ${filter} yet`}
            </h3>
            <p className="text-gray-600 mb-6">Add your first song to get started</p>
            <Link
              href="/admin/songs/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Song
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song) => {
              const streamingLinks = getStreamingLinks(song);
              
              return (
                <div key={song._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
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
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        song.isOriginal 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {song.isOriginal ? 'Original' : 'Cover'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/songs/edit/${song._id}`}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit song"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(song._id)}
                          disabled={deleting === song._id}
                          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete song"
                        >
                          {deleting === song._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {song.title}
                    </h3>
                    
                    {song.artist && (
                      <p className="text-sm text-gray-600 mb-2">
                        by {song.artist}
                      </p>
                    )}

                    {song.releaseDate && (
                      <p className="text-xs text-gray-500 mb-2">
                        Released: {new Date(song.releaseDate).toLocaleDateString()}
                      </p>
                    )}

                    {song.album && (
                      <p className="text-sm text-gray-600 mb-2">
                        Album: {song.album}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mb-3">
                      {song.genre && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {song.genre}
                        </span>
                      )}
                      {song.duration && (
                        <span className="text-xs text-gray-500">
                          {song.duration}
                        </span>
                      )}
                    </div>

                    {/* Musicians */}
                    {song.musicians && song.musicians.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Musicians:</p>
                        <div className="space-y-1">
                          {song.musicians.map((musician, index) => (
                            <p key={index} className="text-xs text-gray-600">
                              {musician.name} - {musician.instrument}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Audio Player */}
                    {song.audioUrl && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-2">Audio:</p>
                        <audio controls className="w-full">
                          <source src={song.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    
                    {song.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {song.description}
                      </p>
                    )}
                    
                    {/* Streaming Links */}
                    {streamingLinks.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Streaming:</p>
                        <div className="flex flex-wrap gap-2">
                          {streamingLinks.map((link) => (
                            <a
                              key={link.name}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs"
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