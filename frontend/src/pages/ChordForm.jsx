import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Save, Loader2, Music, User, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ChordForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    chords_lyrics: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      api.get(`/chords/${id}`)
        .then((res) => setFormData(res.data.data))
        .catch((err) => {
          console.error(err);
          navigate('/');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isEdit) {
        await api.put(`/chords/${id}`, formData);
      } else {
        await api.post('/chords', formData);
      }
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20 animate-pulse">Loading chord data...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="flex items-center text-indigo-300 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Vault</span>
        </Link>
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Song Chord' : 'Add New Chord'}</h1>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-indigo-200">
                <Music className="w-4 h-4 mr-2" />
                Song Title
              </label>
              <input
                type="text"
                className="glass-input w-full"
                placeholder="e.g. Bohemian Rhapsody"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title[0]}</p>}
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-indigo-200">
                <User className="w-4 h-4 mr-2" />
                Artist / Band
              </label>
              <input
                type="text"
                className="glass-input w-full"
                placeholder="e.g. Queen"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              />
              {errors.artist && <p className="text-rose-400 text-xs mt-1">{errors.artist[0]}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-indigo-200">
              <AlignLeft className="w-4 h-4 mr-2" />
              Chords & Lyrics
            </label>
            <textarea
              className="glass-input w-full h-80 font-mono text-sm leading-relaxed"
              placeholder="[G] Is this the real life? [C] Is this just fantasy?..."
              value={formData.chords_lyrics}
              onChange={(e) => setFormData({ ...formData, chords_lyrics: e.target.value })}
            />
            {errors.chords_lyrics && <p className="text-rose-400 text-xs mt-1">{errors.chords_lyrics[0]}</p>}
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Tip: Use brackets [C] for chords to distinguish from lyrics.</p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="glass-button flex items-center space-x-2 px-8"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>{isEdit ? 'Update' : 'Save'} Chord</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ChordForm;
