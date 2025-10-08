import React, { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { JobPosting } from '../lib/supabase';
import JobCard from './JobCard';

interface VacanciesProps {
  jobs: JobPosting[];
  onRefresh: () => void;
}

const Vacancies: React.FC<VacanciesProps> = ({ jobs, onRefresh }) => {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  // Deep link helpers
  const getJobIdFromUrl = () => {
    const url = new URL(window.location.href);
    return url.searchParams.get('job') || null;
  };
  const setJobIdInUrl = (id: string | null, replace = false) => {
    const url = new URL(window.location.href);
    if (id) {
      url.searchParams.set('job', id);
    } else {
      url.searchParams.delete('job');
    }
    (replace ? window.history.replaceState : window.history.pushState).call(window.history, {}, '', url);
  };

  // On mount: expand if ?job= exists
  useEffect(() => {
    const initial = getJobIdFromUrl();
    if (initial) setExpandedJob(initial);

    const onPop = () => {
      setExpandedJob(getJobIdFromUrl());
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, []);

  // Auto-refresh when there are no jobs
  useEffect(() => {
    if (jobs.length === 0 && onRefresh) {
      const interval = setInterval(() => {
        onRefresh();
      }, 30000); // refresh every 30s when empty
      return () => clearInterval(interval);
    }
  }, [jobs.length, onRefresh]);

  // No fallback jobs: if there are no jobs from the database, show an empty-state message

  // Use database jobs only
  const displayJobs = jobs.map(job => ({
    ...job,
    whatsappNumber: job.whatsapp_number,
    // Ensure media is always an array
    media: Array.isArray(job.media) ? job.media : [{
      type: 'image' as const,
      url: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: job.title
    }]
  }));

  const handleExpand = (jobId: string) => {
    setExpandedJob(jobId);
    setJobIdInUrl(jobId);
  };

  const handleClose = () => {
    setExpandedJob(null);
    setJobIdInUrl(null);
  };

  return (
    <section id="vacancies" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 animate-fade-in-up">Current Vacancies</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-300 px-4">
            Discover exciting career opportunities in aviation with top companies across the Middle East
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 animate-fade-in-up animation-delay-600"></div>
        </div>

        {displayJobs.length === 0 ? (
          <div className="text-center text-gray-700 py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No current job vacancies</h3>
            <p className="text-gray-600 mb-6 px-4 max-w-xl mx-auto">
              We update opportunities regularly. In the meantime, you can join our WhatsApp group or contact us directly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.open('https://chat.whatsapp.com/FUNInHCqf1MBnelif61bat', '_blank', 'noopener,noreferrer')}
                className="relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-white text-sm overflow-hidden group transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)',
                  backgroundSize: '400% 400%',
                  animation: 'rainbow-gradient 3s ease infinite'
                }}
              >
                <span>Join WhatsApp Group</span>
              </button>
              <button
                onClick={() => window.open('https://wa.me/94775253543?text=' + encodeURIComponent('Hi AirKings! I am looking for opportunities. Could you help me find suitable positions?'), '_blank', 'noopener,noreferrer')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
              >
                Contact us on WhatsApp
              </button>
            </div>
          </div>
        ) : (
          <div className="jobs-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {displayJobs.map((job, index) => (
              <div
                key={job.id}
                className="animate-fade-in-up h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <JobCard
                  {...job}
                  image={job.media && job.media[0] ? job.media[0].url : 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  isExpanded={expandedJob === job.id}
                  onExpand={() => handleExpand(job.id)}
                  onClose={handleClose}
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12 sm:mt-16 animate-fade-in-up animation-delay-1000 px-4">
          {/* Rainbow WhatsApp Group Bar */}
          <div className="mb-4 sm:mb-8">
            <button
              onClick={() => {
                const whatsappGroupUrl = `https://chat.whatsapp.com/FUNInHCqf1MBnelif61bat`;
                window.open(whatsappGroupUrl, '_blank', 'noopener,noreferrer');
              }}
              className="relative inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-bold text-white text-sm sm:text-base lg:text-lg overflow-hidden group transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
              style={{
                background: 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)',
                backgroundSize: '400% 400%',
                animation: 'rainbow-gradient 3s ease infinite'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="relative z-10 text-center">Join Our WhatsApp Vacancy Group</span>
            </button>
          </div>

          <p className="text-sm sm:text-base text-gray-600 mb-6">Can't find the right position? We're here to help!</p>
          
          <button
            onClick={() => {
              const whatsappUrl = `https://wa.me/94775253543?text=${encodeURIComponent('Hi AirKings! I am looking for opportunities. Could you help me find suitable positions?')}`;
              window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Contact Us for More Opportunities
          </button>
        </div>
      </div>
    </section>
  );
};

export default Vacancies;