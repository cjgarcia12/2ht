'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X, Upload, Music } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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
  imageUrl: string;
  isOriginal: boolean;
}

export default function NewSongPage() {
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
    imageUrl: '',
    isOriginal: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newMusician, setNewMusician] = useState<Musician>({ name: '', instrument: '' });
  const router = useRouter();

  // Bytescale configuration for audio
  const uploadWidgetOptions = {
    apiKey: process.env.NEXT_PUBLIC_BYTESCALE_API_KEY || "not_set", 
    maxFileCount: 1,
    mimeTypes: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a"],
    editor: { images: { crop: false } },
    styles: {
      colors: {
        primary: "#2563eb",
      },
    },
  };

  // Bytescale configuration for images
  const imageUploadOptions = {
    apiKey: process.env.NEXT_PUBLIC_BYTESCALE_API_KEY || "not_set",
    maxFileCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    editor: { images: { crop: true } },
    styles: {
      colors: {
        primary: "#2563eb",
      },
    },
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

  const handleImageUpload = () => {
    setUploadingImage(true);
    UploadWidget.open(imageUploadOptions).then(
      (files) => {
        if (files.length > 0) {
          const file = files[0];
          setFormData(prev => ({
            ...prev,
            imageUrl: file.fileUrl
          }));
        }
        setUploadingImage(false);
      },
      (error) => {
        console.error("Upload error:", error);
        setError("Failed to upload cover art. Please try again.");
        setUploadingImage(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.audioUrl) {
      setError('Please upload an audio file');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
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
        setError('Failed to create song. Please try again.');
      }
    } catch {
      setError('Failed to create song. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Add New Song</h1>
              <p className="text-gray-600">Upload and manage your music</p>
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
                Audio File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {formData.audioUrl ? (
                  <div className="text-center">
                    <Music className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-600 font-medium">Audio file uploaded successfully!</p>
                    <audio controls className="mt-3 mx-auto">
                      <source src={formData.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, audioUrl: '' }))}
                      className="mt-2 text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove file
                    </button>
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

            {/* Cover Art Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Art
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {formData.imageUrl ? (
                  <div className="text-center">
                    <div className="mb-3">
                      <Image 
                        src={formData.imageUrl} 
                        alt="Cover art preview" 
                        width={128}
                        height={128}
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                    </div>
                    <p className="text-sm text-green-600 font-medium">Cover art uploaded successfully!</p>
                    <div className="mt-3 space-x-2">
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploadingImage}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {uploadingImage ? 'Uploading...' : 'Replace Image'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploadingImage}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {uploadingImage ? 'Uploading...' : 'Upload Cover Art'}
                    </button>
                    <p className="text-sm text-gray-600 mt-2">
                      Supports JPG, PNG, WebP, GIF files
                    </p>
                  </div>
                )}
              </div>
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
                disabled={loading || uploading || uploadingImage}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Song
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