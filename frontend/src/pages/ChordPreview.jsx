import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const ChordPreview = () => {
    const { id } = useParams();
    const [chord, setChord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Autoscroll & View states
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(2);
    const [fontSize, setFontSize] = useState(20);
    const [scrollProgress, setScrollProgress] = useState(0);
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

        const handleScroll = () => {
            const totalHeight = document.body.offsetHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [id]);

    useEffect(() => {
        if (isScrolling) {
            scrollIntervalRef.current = setInterval(() => {
                window.scrollBy({ top: 1, behavior: 'auto' });
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    setIsScrolling(false);
                }
            }, 100 / scrollSpeed);
        } else {
            clearInterval(scrollIntervalRef.current);
        }
        return () => clearInterval(scrollIntervalRef.current);
    }, [isScrolling, scrollSpeed]);

    // Helper to highlight chords in [C] format
    const formatContent = (text) => {
        if (!text) return '';
        // Regex to find content inside brackets [Am7]
        const parts = text.split(/(\[[^\]]+\])/g);
        return parts.map((part, i) => {
            if (part.startsWith('[') && part.endsWith(']')) {
                return <span key={i} className="text-yellow-400 font-bold bg-yellow-400/10 px-1 rounded mx-0.5">{part.slice(1, -1)}</span>;
            }
            return part;
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-indigo-300 font-medium animate-pulse">Opening Vault...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center">
                <p className="text-red-400 text-xl mb-6">{error}</p>
                <Link to="/" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl transition">Back to Dashboard</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-32 relative bg-slate-950 selection:bg-indigo-500/30">
            {/* Premium Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,20,80,0.5),rgba(2,6,23,1))]"></div>
                
                {/* Animated Mesh */}
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
                
                {/* Grainy Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] contrast-150" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            </div>

            {/* Scroll Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-white/5">
                <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-100"
                    style={{ width: `${scrollProgress}%` }}
                ></div>
            </div>

            {/* Multi-Control Dock */}
            <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full max-w-xl px-4 md:px-6">
                <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-3 md:gap-6 w-full">
                    {/* Speed Control */}
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-[120px]">
                        <div className="p-1.5 md:p-2 bg-indigo-500/10 rounded-lg">
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <input 
                            type="range" min="1" max="10" value={scrollSpeed} 
                            onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                            className="flex-1 h-1 md:h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>

                    {/* Font Size Control */}
                    <div className="flex items-center bg-white/5 rounded-xl md:rounded-2xl p-0.5 md:p-1">
                        <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white/60 hover:text-white transition hover:bg-white/5 rounded-lg md:rounded-xl text-xs md:text-sm">A-</button>
                        <div className="w-px h-3 md:h-4 bg-white/10"></div>
                        <button onClick={() => setFontSize(Math.min(40, fontSize + 2))} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white/60 hover:text-white transition hover:bg-white/5 rounded-lg md:rounded-xl text-base md:text-lg">A+</button>
                    </div>

                    {/* Action Toggle */}
                    <button 
                        onClick={() => setIsScrolling(!isScrolling)}
                        className={`px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold transition-all flex items-center gap-2 md:gap-3 text-sm md:text-base ${
                            isScrolling 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95'
                        }`}
                    >
                        {isScrolling ? (
                            <><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-400 rounded-full animate-pulse"></div> STOP</>
                        ) : (
                            <><svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg> SCROLL</>
                        )}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4 md:gap-6">
                    <div className="space-y-2 md:space-y-4">
                        <Link to="/" className="inline-flex items-center text-white/40 hover:text-indigo-400 transition gap-2 group text-xs md:text-sm font-medium">
                            <svg className="w-3 h-3 md:w-4 md:h-4 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                            Library
                        </Link>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight md:leading-none">
                            {chord.title}
                        </h1>
                        <p className="text-xl md:text-2xl lg:text-3xl text-indigo-400 font-medium opacity-80">{chord.artist}</p>
                    </div>
                    
                    <Link to={`/chords/edit/${chord.id}`} className="group relative px-6 md:px-8 py-3 md:py-4 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl border border-white/10 transition-all overflow-hidden text-center">
                        <span className="relative z-10 text-white font-semibold text-sm md:text-base">Edit Masterpiece</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                    </Link>
                </div>

                {/* Content Area */}
                <div className="relative">
                    <div className="absolute -inset-2 md:-inset-4 bg-white/[0.02] backdrop-blur-3xl rounded-[20px] md:rounded-[40px] border border-white/5"></div>
                    <div className="relative p-5 md:p-12">
                        <pre 
                            className="text-white font-mono leading-[1.8] whitespace-pre-wrap transition-all duration-300"
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            {formatContent(chord.chords_lyrics)}
                        </pre>
                    </div>
                </div>

                {/* Footer Tip */}
                <div className="mt-20 text-center pb-12">
                    <p className="text-white/20 text-sm font-medium tracking-widest uppercase">End of Sheet • Rock On 🤘</p>
                </div>
            </div>
        </div>
    );
};

export default ChordPreview;
