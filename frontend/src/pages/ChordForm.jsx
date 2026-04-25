import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const ChordForm = () => {
    const [formData, setFormData] = useState({ title: '', artist: '', chords_lyrics: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            api.get(`/chords/${id}`)
                .then(res => setFormData(res.data.data))
                .catch(err => console.error(err));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await api.put(`/chords/${id}`, formData);
            } else {
                await api.post('/chords', formData);
            }
            navigate('/');
        } catch (err) {
            setErrors(err.response?.data || { message: 'Failed to save chord' });
        }
    };

    return (
        <div className="min-h-screen pt-28 md:pt-32 px-4 md:px-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex justify-center pb-12">
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
                    {id ? '✏️ Edit Chord' : '✨ Add New Chord'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <label className="text-white/70 text-sm ml-2">Song Title</label>
                            <input
                                type="text"
                                className="w-full mt-2 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="e.g. Bohemian Rhapsody"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title[0]}</p>}
                        </div>
                        <div>
                            <label className="text-white/70 text-sm ml-2">Artist Name</label>
                            <input
                                type="text"
                                className="w-full mt-2 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="e.g. Queen"
                                value={formData.artist}
                                onChange={(e) => setFormData({...formData, artist: e.target.value})}
                                required
                            />
                            {errors.artist && <p className="text-red-400 text-xs mt-1">{errors.artist[0]}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="text-white/70 text-sm ml-2">Chords & Lyrics</label>
                        <textarea
                            className="w-full mt-2 bg-white/5 border border-white/20 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-sm leading-relaxed"
                            rows="12"
                            placeholder="[C] Is this the real life? [Am] Is this just fantasy?"
                            value={formData.chords_lyrics}
                            onChange={(e) => setFormData({...formData, chords_lyrics: e.target.value})}
                            required
                        ></textarea>
                        {errors.chords_lyrics && <p className="text-red-400 text-xs mt-1">{errors.chords_lyrics[0]}</p>}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="submit" className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1">
                            {id ? 'Update Chord' : 'Save to Vault'}
                        </button>
                        <button type="button" onClick={() => navigate('/')} className="px-8 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl border border-white/10 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChordForm;
