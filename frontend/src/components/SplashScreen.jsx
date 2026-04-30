import React from 'react';
import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';

const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617]">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-violet-600/10 blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    ease: [0, 0.71, 0.2, 1.01]
                }}
                className="flex flex-col items-center"
            >
                {/* Logo Container */}
                <div className="relative mb-8">
                    <motion.div
                        animate={{ 
                            boxShadow: [
                                "0 0 0px 0px rgba(99, 102, 241, 0)",
                                "0 0 40px 10px rgba(99, 102, 241, 0.3)",
                                "0 0 0px 0px rgba(99, 102, 241, 0)"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40"
                    >
                        <Music2 className="w-12 h-12 text-white" />
                    </motion.div>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-black text-white tracking-tighter mb-2"
                >
                    Vault Chord
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-400 text-sm font-medium tracking-[0.2em] uppercase"
                >
                    Song Chord Vault
                </motion.p>

                {/* Loading Indicator */}
                <div className="mt-16 relative w-8 h-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full rounded-full border-2 border-indigo-500/20 border-t-indigo-500"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default SplashScreen;
