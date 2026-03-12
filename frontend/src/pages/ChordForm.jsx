import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const ChordForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    chords_lyrics: '',
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchChord();
    }
  }, [id]);

  const fetchChord = async () => {
    try {
      const response = await api.get(`/chords/${id}`);
      setFormData(response.data);
    } catch (err) {
      alert('Failed to fetch chord details');
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await api.put(`/chords/${id}`, formData);
      } else {
        await api.post('/chords', formData);
      }
      navigate('/');
    } catch (err) {
      alert('Failed to save chord');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {id ? 'Edit Secret Chord' : 'New Chord Vault Entry'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Song Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="Enter title..."
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Artist Name</label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="Enter artist..."
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Chords & Lyrics</label>
            <textarea
              value={formData.chords_lyrics}
              onChange={(e) => setFormData({ ...formData, chords_lyrics: e.target.value })}
              className="w-full h-64 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl py-3 px-4 text-white font-mono focus:ring-2 focus:ring-purple-400 transition-all resize-none"
              placeholder="[C] Lyric here..."
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-bold py-3 rounded-xl transition-all border border-white border-opacity-20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Securing Data...' : (id ? 'Update Chord' : 'Store in Vault')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChordForm;
