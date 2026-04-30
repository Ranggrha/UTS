import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Background from './components/Background';
import SplashScreen from './components/SplashScreen';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ChordForm from './pages/ChordForm';
import ChordPreview from './pages/ChordPreview';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
};

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/login" element={
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        <Login />
                    </motion.div>
                } />
                <Route path="/register" element={
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        <Register />
                    </motion.div>
                } />
                
                <Route path="/" element={
                    <PrivateRoute>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                            <Dashboard />
                        </motion.div>
                    </PrivateRoute>
                } />

                <Route path="/chords/:id" element={
                    <PrivateRoute>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }}>
                            <ChordPreview />
                        </motion.div>
                    </PrivateRoute>
                } />
                
                <Route path="/chords/create" element={
                    <PrivateRoute>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <ChordForm />
                        </motion.div>
                    </PrivateRoute>
                } />
                
                <Route path="/chords/edit/:id" element={
                    <PrivateRoute>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <ChordForm />
                        </motion.div>
                    </PrivateRoute>
                } />
            </Routes>
        </AnimatePresence>
    );
};

const AppContent = () => {
    const { loading } = useContext(AuthContext);

    if (loading) {
        return <SplashScreen />;
    }

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            <Background />
            <div className="relative z-10">
                <Navbar />
                <AnimatedRoutes />
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
