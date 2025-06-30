'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X, Upload, Music } from 'lucide-react';
import Link from 'next/link';
import { UploadWidget } from "@bytescale/upload-widget";

interface Musician {
  name: string;
  instrument: string;
}

interface SongForm {
  title: string;
  description: string;
  releaseDate: string;
  musicians: Musician[];
  audioUrl: string;
  artist: string;
  album: string;
  genre: string;
  spotifyUrl: string;
  youtubeUrl: string;
  soundcloudUrl: string;
  lyrics: string;
  imageUrl: string;
  isOriginal: boolean;
}

export default function EditSongPage({ params }: { params: Promise<{ id: string }> }) {
  const [songId, setSongId] = useState<string>('');
  const [formData, setFormData] = useState<SongForm>({
    title: '',
    description: '',
    releaseDate: '',
    musicians: [],
    audioUrl: '',
    artist: '',
    album: '',
    genre: '',
    spotifyUrl: '',
    youtubeUrl: '',
    soundcloudUrl: '',
    lyrics: '',
    imageUrl: '',
    isOriginal: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newMusician, setNewMusician] = useState<Musician>({ name: '', instrument: '' });
  const router = useRouter();

  // Bytescale configuration
  const uploadWidgetOptions = {
    apiKey: process.env.NEXT_PUBLIC_BYTESCALE_API_KEY || "public_kW15bGmJe9LKCqgE5eZHHWQn92K4", // Replace with your actual API key
    maxFileCount: 1,
    mimeTypes: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a"],
    editor: { images: { crop: false } },
    styles: {
      colors: {
        primary: "#2563eb",
      },
    },
  };

  useEffect(() => {
    const initializePage = async () => {
      // Check if user is authenticated
      const adminAuth = localStorage.getItem('adminAuth');
      if (!adminAuth) {
        router.push('/admin/login');
        return;
      }

      // Get the song ID from params
      const resolvedParams = await params;
      setSongId(resolvedParams.id);
      
      // Fetch the song data
      await fetchSong(resolvedParams.id);
    };

    initializePage();
  }, [params, router]);

  const fetchSong = async (id: string) => {
    try {
      const response = await fetch(`/api/songs/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const song = data.data;
        
        // Format the release date for date input
        const releaseDate = song.releaseDate ? new Date(song.releaseDate).toISOString().split('T')[0] : '';
        
        setFormData({
          title: song.title || '',
          description: song.description || '',
          releaseDate: releaseDate,
          musicians: song.musicians || [],
          audioUrl: song.audioUrl || '',
          artist: song.artist || '',
          album: song.album || '',
          genre: song.genre || '',
          spotifyUrl: song.spotifyUrl || '',
          youtubeUrl: song.youtubeUrl || '',
          soundcloudUrl: song.soundcloudUrl || '',
          lyrics: song.lyrics || '',
          imageUrl: song.imageUrl || '',
          isOriginal: song.isOriginal,
        });
      } else {
        setError('Failed to load song data');
      }
    } catch {
      setError('Failed to load song data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleMusicianChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMusician(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMusician = () => {
    if (newMusician.name.trim() && newMusician.instrument.trim()) {
      setFormData(prev => ({
        ...prev,
        musicians: [...prev.musicians, { ...newMusician }]
      }));
      setNewMusician({ name: '', instrument: '' });
    }
  };

  const removeMusician = (index: number) => {
    setFormData(prev => ({
      ...prev,
      musicians: prev.musicians.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = () => {
    setUploading(true);
    UploadWidget.open(uploadWidgetOptions).then(
      (files) => {
        if (files.length > 0) {
          const file = files[0];
          setFormData(prev => ({
            ...prev,
            audioUrl: file.fileUrl
          }));
        }
        setUploading(false);
      },
      (error) => {
        console.error("Upload error:", error);
        setError("Failed to upload audio file. Please try again.");
        setUploading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/songs');
      } else {
        setError('Failed to update song. Please try again.');
      }
    } catch {
      setError('Failed to update song. Please try again.');
    } finally {
      setSaving(false);
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
              href="/admin/songs"
              className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Song</h1>
              <p className="text-gray-600">Update song details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Song Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter song title"
                />
              </div>

              <div>
                <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Release Date
                </label>
                <input
                  type="date"
                  id="releaseDate"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the song, inspiration, story behind it..."
              />
            </div>

            {/* Audio Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {formData.audioUrl ? (
                  <div className="text-center">
                    <Music className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-600 font-medium">Audio file uploaded!</p>
                    <audio controls className="mt-3 mx-auto">
                      <source src={formData.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="mt-3 space-x-2">
                      <button
                        type="button"
                        onClick={handleFileUpload}
                        disabled={uploading}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {uploading ? 'Uploading...' : 'Replace File'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, audioUrl: '' }))}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove file
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <button
                      type="button"
                      onClick={handleFileUpload}
                      disabled={uploading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload MP3 File'}
                    </button>
                    <p className="text-sm text-gray-600 mt-2">
                      Supports MP3, WAV, M4A files
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Musicians Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Musicians
              </label>
              
              {/* Add new musician */}
              <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add Musician</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    name="name"
                    value={newMusician.name}
                    onChange={handleMusicianChange}
                    placeholder="Musician name"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="instrument"
                    value={newMusician.instrument}
                    onChange={handleMusicianChange}
                    placeholder="Instrument"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addMusician}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Musicians list */}
              {formData.musicians.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Musicians List</h4>
                  {formData.musicians.map((musician, index) => (
                    <div key={index} className="flex items-center justify-between bg-white border rounded-lg p-3">
                      <div>
                        <span className="font-medium">{musician.name}</span>
                        <span className="text-gray-600 ml-2">- {musician.instrument}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMusician(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-2">
                  Artist/Band Name
                </label>
                <input
                  type="text"
                  id="artist"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Artist or band name"
                />
              </div>

              <div>
                <label htmlFor="album" className="block text-sm font-medium text-gray-700 mb-2">
                  Album
                </label>
                <input
                  type="text"
                  id="album"
                  name="album"
                  value={formData.album}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Album name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Rock, Jazz, Blues, Pop"
              />
            </div>

            {/* Streaming Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Streaming Links (Optional)</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="spotifyUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Spotify URL
                  </label>
                  <input
                    type="url"
                    id="spotifyUrl"
                    name="spotifyUrl"
                    value={formData.spotifyUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://open.spotify.com/track/..."
                  />
                </div>

                <div>
                  <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    id="youtubeUrl"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="soundcloudUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  SoundCloud URL
                </label>
                <input
                  type="url"
                  id="soundcloudUrl"
                  name="soundcloudUrl"
                  value={formData.soundcloudUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://soundcloud.com/..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Art URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/cover-art.jpg"
              />
            </div>

            <div>
              <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 mb-2">
                Lyrics
              </label>
              <textarea
                id="lyrics"
                name="lyrics"
                rows={8}
                value={formData.lyrics}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter song lyrics here..."
              />
            </div>

            {/* Original/Cover Toggle */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="isOriginal"
                name="isOriginal"
                checked={formData.isOriginal}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isOriginal" className="text-sm font-medium text-gray-700">
                This is an original song (uncheck if it&apos;s a cover)
              </label>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <Link
                href="/admin/songs"
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Song
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 