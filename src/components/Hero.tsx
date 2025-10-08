import React from 'react';
import { Search, Users, Briefcase } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fadeInUp leading-tight">
            Your Gateway to
            <span className="text-blue-200 block">Career Development</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 animate-fadeInUp animation-delay-300 px-4">
            Connecting talented professionals with leading Companies Across Saudi Arabia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center mb-8 sm:mb-12 animate-fadeInUp animation-delay-600 px-4">
            <a
              href="#vacancies"
              className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
            >
              Browse Vacancies
            </a>
            <a
              href="/#/contact"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              Contact Us
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8 mt-6 sm:mt-16 px-4">
            <div className="text-center animate-fadeInUp animation-delay-900">
              <div className="bg-white bg-opacity-20 w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Users className="w-5 h-5 sm:w-8 sm:h-8 text-blue-200" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-0.5 sm:mb-2">24+ Years</h3>
              <p className="text-blue-200 text-xs sm:text-base">Legacy</p>
            </div>
            <div className="text-center animate-fadeInUp animation-delay-1200">
              <div className="bg-white bg-opacity-20 w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Briefcase className="w-5 h-5 sm:w-8 sm:h-8 text-blue-200" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-0.5 sm:mb-2">900+</h3>
              <p className="text-blue-200 text-xs sm:text-base">Partner Companies</p>
            </div>
            <div className="text-center animate-fadeInUp animation-delay-1500">
              <div className="bg-white bg-opacity-20 w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <Search className="w-5 h-5 sm:w-8 sm:h-8 text-blue-200" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-0.5 sm:mb-2">10+</h3>
              <p className="text-blue-200 text-xs sm:text-base">Active Vacancies</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;