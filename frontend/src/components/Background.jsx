import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const Background = () => {
    const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX - 250);
            mouseY.set(e.clientY - 250);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-slate-950"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,20,80,0.3),rgba(2,6,23,1))]"></div>
            
            {/* Interactive Mouse Follower Blob */}
            <motion.div 
                className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"
                style={{ 
                    x: mouseX,
                    y: mouseY,
                }}
            />

            {/* Static Animated Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
            
            {/* Grainy Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.02] contrast-150" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>
    );
};

export default Background;
