import React from 'react';
import { Plane } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 z-50 flex items-center justify-center overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="text-center relative z-10">
        {/* Luxury logo container */}
        <div className="relative mb-12">
          <div className="w-32 h-32 mx-auto relative">
            {/* Rotating rings */}
            <div className="absolute inset-0 border-4 border-white border-opacity-20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border-4 border-blue-300 border-opacity-40 rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-4 border-4 border-white border-opacity-60 rounded-full animate-spin-slow"></div>
            
            {/* Center logo */}
            <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse-luxury">
              <img 
                src="https://i.imgur.com/V9ENjZd.png" 
                alt="AirKings Logo" 
                className="w-12 h-12 object-contain animate-bounce-gentle" 
              />
            </div>
            
            {/* Glowing effect */}
            <div className="absolute inset-0 rounded-full bg-white opacity-10 animate-ping-slow"></div>
          </div>
        </div>

        {/* Luxury text animation */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 animate-fade-in-up">
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '0.1s' }}>A</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '0.2s' }}>I</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '0.3s' }}>R</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '0.4s' }}>K</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '0.5s' }}>I</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '0.6s' }}>N</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '0.7s' }}>G</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '0.8s' }}>S</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '0.9s' }}>G</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '1.0s' }}>R</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '1.1s' }}>O</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '1.2s' }}>U</span>
            <span className="inline-block animate-letter-bounce" style={{ animationDelay: '1.3s' }}>P</span>
          </h2>
          <p className="text-blue-200 text-lg animate-fade-in-up animation-delay-500">
            ' Your Success Is Our Business '
          </p>
        </div>

        {/* Luxury progress bar */}
        <div className="w-80 mx-auto">
          <div className="h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-white via-blue-200 to-white rounded-full animate-progress-luxury shadow-lg"></div>
          </div>
          <p className="text-blue-200 text-sm mt-4 animate-fade-in-up animation-delay-1000">
            Preparing your gateway to success...
          </p>
        </div>
      </div>

      {/* Luxury corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white border-opacity-30 animate-fade-in"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white border-opacity-30 animate-fade-in"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white border-opacity-30 animate-fade-in"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white border-opacity-30 animate-fade-in"></div>
    </div>
  );
};

export default LoadingScreen;