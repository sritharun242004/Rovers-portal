import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingIntroProps {
  onComplete: () => void;
}

export const LoadingIntro: React.FC<LoadingIntroProps> = ({ onComplete }) => {
  const [showRovers, setShowRovers] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Fast animation sequence timeline (4 seconds total)
    const timer1 = setTimeout(() => {
      setShowRovers(true);
    }, 1000); // Show "Rovers" after 1 second of logo rotation

    const timer2 = setTimeout(() => {
      setShowSubtitle(true);
    }, 2000); // Show subtitle after additional 1 second

    const timer3 = setTimeout(() => {
      setFadeOut(true);
    }, 3500); // Start fade out after 3.5 seconds total

    const timer4 = setTimeout(() => {
      onComplete();
    }, 4000); // Complete transition after 4 seconds

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
          {/* Black Background */}
          <div className="absolute inset-0 bg-black"></div>

          {/* CSS Keyframes */}
          <style jsx>{`
            @keyframes slowRotate {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
            
            @keyframes gentlePulse {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
              100% {
                transform: scale(1);
              }
            }
          `}</style>

          {/* Main content container with locked logo position */}
          <div className="relative w-full h-full">
            
            {/* Centered Logo - Fixed Position (moved up) */}
            <div className="absolute inset-0 flex items-center justify-center -mt-16 sm:-mt-20 md:-mt-24">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1
                }}
                transition={{
                  scale: { duration: 0.6, ease: "easeOut" },
                  opacity: { duration: 0.6, ease: "easeOut" }
                }}
              >
                <div className="relative">
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
                    style={{
                      animation: 'slowRotate 8s linear infinite'
                    }}
                  >
                    <img
                      src="https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/rovers+favicon.png"
                      alt="ROVERS Logo"
                      className="w-full h-full"
                      style={{ 
                        filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.3)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2))',
                        animation: 'gentlePulse 3s ease-in-out infinite'
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Text Container - Positioned in Lower Half */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 flex flex-col items-center justify-start pt-12 sm:pt-16 md:pt-20 text-center px-4">
              
              {/* Rovers Text */}
              <AnimatePresence>
                {showRovers && (
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-white font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 tracking-tight"
                    style={{ 
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      textShadow: '0 6px 16px rgba(0, 0, 0, 0.8), 0 3px 8px rgba(0, 0, 0, 0.9), 0 1px 4px rgba(0, 0, 0, 1), 0 0 25px rgba(0, 0, 0, 0.5)',
                      filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.15)) contrast(1.1)',
                      color: '#ffffff'
                    }}
                  >
                    Rovers
                  </motion.h1>
                )}
              </AnimatePresence>

              {/* Subtitle Text */}
              <AnimatePresence>
                {showSubtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="text-white font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wide"
                    style={{ 
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 1), 0 1px 3px rgba(0, 0, 0, 1), 0 0 20px rgba(0, 0, 0, 0.6)',
                      filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.12)) contrast(1.05)',
                      color: '#ffffff'
                    }}
                  >
                    International School Games
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Loading indicator dots - Bottom of screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.3 }}
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2"
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 bg-white/60 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
