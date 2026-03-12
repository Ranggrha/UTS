import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [chords, setChords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChords();
  }, []);

  const fetchChords = async () => {
    try {
      const response = await api.get('/chords');
      setChords(response.data);
    } catch (err) {
      console.error('Error fetching chords', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteChord = async (id) => {
    if (window.confirm('Are you sure you want to delete this chord?')) {
      try {
        await api.delete(`/chords/${id}`);
        setChords(chords.filter((c) => c.id !== id));
      } catch (err) {
        alert('Failed to delete chord');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-6 rounded-2xl">
          <h1 className="text-3xl font-bold text-white tracking-tight">Vault Dashboard</h1>
          <div className="flex gap-4">
            <Link
              to="/chords/create"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg"
            >
              + Add Chord
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg"
            >
              Logout
            </button>
          </div>
        </header>

        {loading ? (
          <div className="text-white text-center text-xl animate-pulse">Scanning Vault...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chords.map((chord) => (
              <div
                key={chord.id}
                className="bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 rounded-2xl p-6 transition-all hover:scale-[1.02] hover:bg-opacity-10 group"
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{chord.title}</h3>
                  <p className="text-indigo-300 font-medium">{chord.artist}</p>
                </div>
                <div className="h-32 overflow-hidden text-white text-opacity-60 text-sm italic mb-6 line-clamp-4">
                  {chord.chords_lyrics}
                </div>
                <div className="flex justify-between mt-auto">
                  <Link
                    to={`/chords/edit/${chord.id}`}
                    className="text-white bg-blue-500 bg-opacity-50 hover:bg-opacity-80 px-4 py-2 rounded-lg transition-all"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteChord(chord.id)}
                    className="text-white bg-red-500 bg-opacity-50 hover:bg-opacity-80 px-4 py-2 rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {chords.length === 0 && (
              <div className="col-span-full text-center text-white text-opacity-50 py-20">
                <p className="text-xl">Your vault is empty.</p>
                <Link to="/chords/create" className="text-indigo-400 hover:underline">Start adding chords now!</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
