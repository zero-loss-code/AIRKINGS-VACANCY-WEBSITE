import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Linkedin, Facebook, Instagram, Youtube, Crown } from 'lucide-react';
import CreditBar from './CreditBar';

interface FooterProps {
  onAdminAccess?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminAccess }) => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/94775253543', '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    window.location.href = 'tel:+94775253543';
  };

  const handleEmail = () => {
    window.location.href = 'mailto:info@airkings.com';
  };

  const handleSocialClick = (platform: string) => {
    // Replace with actual social media URLs
    const urls = {
      facebook: 'https://www.facebook.com/airkingsgrouphr/',
      linkedin: 'https://www.linkedin.com/company/airkingsgroup/?viewAsMember=true',
      instagram: 'https://www.instagram.com/airkingsgroup/reels/?hl=en',
      youtube: 'https://www.youtube.com/@airkingsgroup',
      tiktok: 'https://www.tiktok.com/@airkingsgroup'
    };
    const url = urls[platform as keyof typeof urls] || '#';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 sm:py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-white rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white rounded-full animate-pulse animation-delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-8 mb-8 sm:mb-12">
          {/* Company Info */}
          <div className="animate-fade-in-up text-center sm:text-left">
            <a href="/" aria-label="Go to Home" className="flex items-center space-x-3 mb-6 group justify-center sm:justify-start">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="https://i.imgur.com/YxI6UWT.png" 
                  alt="AirKings Logo" 
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain" 
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold group-hover:text-blue-300 transition-colors duration-300">AIR KINGS GROUP</h3>
                <p className="text-xs sm:text-sm text-gray-400">HR SOLUTIONS</p>
              </div>
            </a>
            <p className="text-sm sm:text-base text-gray-400 mb-6 leading-relaxed">
              AIR KINGS GROUP is a trusted recruitment and staffing solutions provider with 37 years of legacy. We specialize in connecting skilled professionals with leading employers, delivering reliable, efficient, and tailored workforce solutions across multiple industries. Our experience ensures the right talent meets the right opportunity.
            </p>
            <div className="flex space-x-3 sm:space-x-4 justify-center sm:justify-start">
              <button
                onClick={() => handleSocialClick('linkedin')}
                className="text-gray-400 hover:text-blue-400 transform hover:scale-110 transition-all duration-300 p-2 hover:bg-blue-900 hover:bg-opacity-20 rounded-full"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => handleSocialClick('facebook')}
                className="text-gray-400 hover:text-blue-600 transform hover:scale-110 transition-all duration-300 p-2 hover:bg-blue-900 hover:bg-opacity-20 rounded-full"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => handleSocialClick('instagram')}
                className="text-gray-400 hover:text-pink-400 transform hover:scale-110 transition-all duration-300 p-2 hover:bg-pink-900 hover:bg-opacity-20 rounded-full"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => handleSocialClick('youtube')}
                className="text-gray-400 hover:text-red-500 transform hover:scale-110 transition-all duration-300 p-2 hover:bg-red-900 hover:bg-opacity-20 rounded-full"
              >
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => handleSocialClick('tiktok')}
                className="text-gray-400 hover:text-purple-400 transform hover:scale-110 transition-all duration-300 p-2 hover:bg-purple-900 hover:bg-opacity-20 rounded-full"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up animation-delay-300 sm:col-span-1 lg:col-span-1 text-center sm:text-left">
            {/* Crown with tapered lines (mobile only) */}
            <div className="sm:hidden flex items-center justify-center mb-3">
              <span className="block h-[2px] w-24 max-w-[30%] bg-gradient-to-l from-white/40 via-white/10 to-transparent rounded-full"></span>
              <Crown className="w-5 h-5 text-white/80 mx-3" />
              <span className="block h-[2px] w-24 max-w-[30%] bg-gradient-to-r from-white/40 via-white/10 to-transparent rounded-full"></span>
            </div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-blue-300">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a 
                  href="/#home" 
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/#vacancies" 
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  Current Vacancies
                </a>
              </li>
              <li>
                <a 
                  href="/#about" 
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="/#/contact" 
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="#careers" 
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  Career Guidance
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="animate-fade-in-up animation-delay-600 sm:col-span-2 lg:col-span-1 text-center sm:text-left">
            {/* Crown with tapered lines (mobile only) */}
            <div className="sm:hidden flex items-center justify-center mb-3">
              <span className="block h-[2px] w-24 max-w-[30%] bg-gradient-to-l from-white/40 via-white/10 to-transparent rounded-full"></span>
              <Crown className="w-5 h-5 text-white/80 mx-3" />
              <span className="block h-[2px] w-24 max-w-[30%] bg-gradient-to-r from-white/40 via-white/10 to-transparent rounded-full"></span>
            </div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-blue-300">Our Services</h4>
            <ul className="space-y-2 sm:space-y-3 text-gray-400">
              <li className="text-sm sm:text-base hover:text-white transition-colors duration-300 cursor-pointer">Visa and Work Permit Assistance</li>
              <li className="text-sm sm:text-base hover:text-white transition-colors duration-300 cursor-pointer">Pre-Departure Training</li>
              <li className="text-sm sm:text-base hover:text-white transition-colors duration-300 cursor-pointer">Placement & Job Matching</li>
              <li className="text-sm sm:text-base hover:text-white transition-colors duration-300 cursor-pointer">Medical Checkups & Insurance</li>
              <li className="text-sm sm:text-base hover:text-white transition-colors duration-300 cursor-pointer">Management Roles</li>
              <li className="text-sm sm:text-base hover:text-white transition-colors duration-300 cursor-pointer">Flight Booking & Travel Arrangements</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up animation-delay-900 sm:col-span-2 lg:col-span-1 text-center sm:text-left">
            {/* Crown with tapered lines (mobile only) */}
            <div className="sm:hidden flex items-center justify-center mb-3">
              <span className="block h-[2px] w-24 max-w-[30%] bg-gradient-to-l from-white/40 via-white/10 to-transparent rounded-full"></span>
              <Crown className="w-5 h-5 text-white/80 mx-3" />
              <span className="block h-[2px] w-24 max-w-[30%] bg-gradient-to-r from-white/40 via-white/10 to-transparent rounded-full"></span>
            </div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-blue-300">Contact Us</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center sm:items-start justify-center sm:justify-start space-x-3 group">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0 sm:mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-sm sm:text-base text-gray-400 group-hover:text-white transition-colors duration-300 text-center sm:text-left">
                  {/* Mobile: single line; Desktop: two lines */}
                  <span className="sm:hidden whitespace-nowrap">532/1, Sirkotha Lane, Colombo 03.</span>
                  <span className="hidden sm:block">
                    532/1, Sirkotha Lane<br />
                    Colombo 03.
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-3 group">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <button 
                  onClick={handleCall}
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap sm:whitespace-normal"
                >
                  +94775253543
                </button>
              </div>
              {/* New secondary phone number */}
              <div className="flex items-center justify-center sm:justify-start space-x-3 group">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <button
                  onClick={() => (window.location.href = 'tel:+94777137813')}
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap sm:whitespace-normal"
                >
                  +94 77 713 7813
                </button>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-3 group">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <button 
                  onClick={handleEmail}
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap sm:whitespace-normal"
                >
                  cv@airkingsgroup.com
                </button>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-3 group">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <button
                  onClick={handleWhatsApp}
                  className="text-sm sm:text-base text-gray-400 hover:text-green-400 transition-colors duration-300 whitespace-nowrap sm:whitespace-normal"
                >
                  WhatsApp Support
                </button>
              </div>
            </div>

            {/* Quick Contact Button */}
            <div className="mt-4 sm:mt-6 flex justify-center sm:justify-start">
              <button
                onClick={handleWhatsApp}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold flex items-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Quick Contact
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left text-gray-400 mb-4 md:mb-0 text-sm sm:text-base">
              <p>&copy; 2025 AirKings Recruitment Agency. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              
              </a>
              <a href="https://policies.google.com/terms?hl=en" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#cookies" className="text-gray-400 hover:text-white transition-colors duration-300">
                Cookie Policy
              </a>
              {onAdminAccess && (
                <button
                  onClick={onAdminAccess}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Centered credit bar */}
        <CreditBar />
      </div>
    </footer>
  );
};

export default Footer;