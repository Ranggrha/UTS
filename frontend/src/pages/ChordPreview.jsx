import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const ChordPreview = () => {
    const { id } = useParams();
    const [chord, setChord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Autoscroll states
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(2); // 1-10 speed levels
    const scrollIntervalRef = useRef(null);

    useEffect(() => {
        const fetchChord = async () => {
            try {
                const res = await api.get(`/chords/${id}`);
                setChord(res.data.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load chord details');
            } finally {
                setLoading(false);
            }
        };

        fetchChord();
    }, [id]);

    // Handle Autoscroll logic
    useEffect(() => {
        if (isScrolling) {
            scrollIntervalRef.current = setInterval(() => {
                window.scrollBy({
                    top: 1,
                    behavior: 'auto'
                });
                
                // Stop if reached bottom
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    setIsScrolling(false);
                }
            }, 100 / scrollSpeed);
        } else {
            clearInterval(scrollIntervalRef.current);
        }

        return () => clearInterval(scrollIntervalRef.current);
    }, [isScrolling, scrollSpeed]);

    const toggleScroll = () => setIsScrolling(!isScrolling);

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center pt-32 px-6">
            <div className="text-white text-center">Loading Chord...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center pt-32 px-6">
            <div className="text-red-400 text-center mb-6">{error}</div>
            <Link to="/" className="text-indigo-400 hover:text-indigo-300">Back to Dashboard</Link>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 px-6 pb-24 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
            {/* Floating Autoscroll Controls */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <span className="text-white/60 text-sm font-medium">Speed</span>
                    <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={scrollSpeed} 
                        onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                        className="w-32 h-2 bg-indigo-500/30 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                    />
                    <span className="text-indigo-300 font-bold w-6">{scrollSpeed}</span>
                </div>
                
                <div className="h-8 w-px bg-white/10"></div>
                
                <button 
                    onClick={toggleScroll}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
                        isScrolling 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30' 
                        : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20'
                    }`}
                >
                    {isScrolling ? (
                        <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            Stop
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            Start Autoscroll
                        </>
                    )}
                </button>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Link to="/" className="flex items-center text-indigo-300 hover:text-indigo-200 transition gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <div className="flex gap-4">
                        <Link to={`/chords/edit/${chord.id}`} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl border border-white/10 transition">
                            Edit
                        </Link>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl mb-12">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">{chord.title}</h1>
                        <p className="text-2xl text-indigo-300">{chord.artist}</p>
                    </div>

                    <div className="bg-black/40 rounded-3xl p-8 shadow-inner overflow-x-auto">
                        <pre className="text-white font-mono text-xl leading-loose whitespace-pre-wrap">
                            {chord.chords_lyrics}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChordPreview;
