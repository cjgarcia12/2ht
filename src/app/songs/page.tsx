'use client';

import { useState, useEffect } from 'react';
import { Music, ExternalLink, Calendar, Users, Play, X } from 'lucide-react';

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
  videoUrl?: string;
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

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState<{ open: boolean; url: string }>({ open: false, url: '' });

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

  const getStreamingLinks = (song: Song) => {
    const links = [];
    if (song.spotifyUrl) links.push({ name: 'Spotify', url: song.spotifyUrl, color: 'bg-green-600' });
    if (song.youtubeUrl) links.push({ name: 'YouTube', url: song.youtubeUrl, color: 'bg-red-600' });
    if (song.soundcloudUrl) links.push({ name: 'SoundCloud', url: song.soundcloudUrl, color: 'bg-orange-600' });
    return links;
  };

  const openVideoModal = (url: string) => {
    setVideoModal({ open: true, url });
  };

  const closeVideoModal = () => {
    setVideoModal({ open: false, url: '' });
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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of music
          </p>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No songs yet
            </h3>
            <p className="text-gray-600">Check back soon for new music!</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-4">
            {songs.map((song) => {
              const streamingLinks = getStreamingLinks(song);
              
              return (
                <div key={song._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-start gap-4">
                    {/* Album Art */}
                    {song.imageUrl ? (
                      <div 
                        className="w-24 h-24 bg-gray-200 bg-cover bg-center rounded flex-shrink-0" 
                        style={{ backgroundImage: `url(${song.imageUrl})` }}
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                        <Music className="w-10 h-10 text-white opacity-50" />
                      </div>
                    )}
                    
                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {song.title}
                          </h3>
                          {song.artist && (
                            <p className="text-gray-600">{song.artist}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {song.genre && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {song.genre}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            song.isOriginal 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {song.isOriginal ? 'Original' : 'Cover'}
                          </span>
                        </div>
                      </div>

                      {song.album && (
                        <p className="text-sm text-gray-600 mb-2">
                          Album: {song.album}
                        </p>
                      )}

                      {song.releaseDate && (
                        <div className="flex items-center text-gray-600 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            Released: {new Date(song.releaseDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {song.description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {song.description}
                        </p>
                      )}

                      {/* Musicians */}
                      {song.musicians && song.musicians.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center text-gray-700 mb-1">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Musicians:</span>
                          </div>
                          <div className="flex flex-wrap gap-2 ml-5">
                            {song.musicians.map((musician, index) => (
                              <span key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                {musician.name} - {musician.instrument}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Audio Player */}
                      {song.audioUrl && (
                        <div className="mb-3">
                          <audio controls className="w-full max-w-md">
                            <source src={song.audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}

                      {/* Video Button */}
                      {song.videoUrl && (
                        <div className="mb-3">
                          <button
                            onClick={() => openVideoModal(song.videoUrl!)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Watch Video
                          </button>
                        </div>
                      )}
                      
                      {/* Streaming Links */}
                      {streamingLinks.length > 0 && (
                        <div>
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
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {videoModal.open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeVideoModal}
        >
          <div 
            className="relative bg-black rounded-lg max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <video 
              controls 
              autoPlay
              className="w-full rounded-lg"
            >
              <source src={videoModal.url} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
