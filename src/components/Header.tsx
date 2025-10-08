import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Clock as ClockIcon } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Live Sri Lanka time (Asia/Colombo)
  const [slTime, setSlTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Colombo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const tick = () => setSlTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="bg-white shadow-lg z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Name link to Home */}
          <a href="/" aria-label="Go to Home" className="flex items-center space-x-3 group">
            <div className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <img 
                src="https://i.imgur.com/YxI6UWT.png" 
                alt="Air Kings Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                AIR KINGS GROUP
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">HR SOLUTIONS</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group text-sm xl:text-base">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/#vacancies" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group text-sm xl:text-base">
              Vacancies
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/#about" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group text-sm xl:text-base">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/#/contact" className="text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group text-sm xl:text-base">
              Contact
              <span className="absolute -bottom-1 left-0 w-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Contact Icons + SL Clock */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {/* Phone */}
            <a
              href="tel:+94775253543"
              className="p-2 lg:p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 group"
            >
              <Phone className="w-4 h-4 lg:w-5 lg:h-5 group-hover:animate-pulse" />
            </a>
            {/* Mail */}
            <a
              href="mailto:cv@airkings.com"
              className="p-2 lg:p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 group"
            >
              <Mail className="w-4 h-4 lg:w-5 lg:h-5 group-hover:animate-pulse" />
            </a>
            {/* SL Time pill (fixed width, no layout shift) */}
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 h-8 text-blue-700 font-semibold shadow-sm hover:bg-blue-100 transition-all duration-300 flex-shrink-0">
              <ClockIcon className="w-4 h-4" />
              <span
                className="text-xs sm:text-sm font-mono text-center w-[88px]"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {slTime || '--:--:--'}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-110"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t animate-slide-down">
            <nav className="flex flex-col items-center space-y-3 px-2">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-all duration-300 py-2 text-center">Home</a>
              <a href="/#vacancies" className="text-gray-700 hover:text-blue-600 transition-all duration-300 py-2 text-center">Vacancies</a>
              <a href="/#about" className="text-gray-700 hover:text-blue-600 transition-all duration-300 py-2 text-center">About</a>
              <a href="/#/contact" className="text-gray-700 hover:text-blue-600 transition-all duration-300 py-2 text-center">Contact</a>
              
              {/* Mobile Contact Links */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <a
                  href="tel:+94775253543"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors py-2"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Call Us</span>
                </a>
                <a
                  href="mailto:cv@airkings.com"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors py-2"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email Us</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;