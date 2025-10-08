import React from 'react';

const CreditBar: React.FC = () => {
  const websiteUrl = 'https://www.behance.net/rasha-ahamed'; // change if needed

  return (
    <div className="my-8 sm:my-6">
      <a
        href={websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col sm:flex-row items-center justify-center sm:justify-start mx-auto sm:mx-0"
        aria-label="Designed, Developed & Hosted by Rasha Production"
      >
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 rounded-full bg-gray-900 px-6 py-2 border border-cyan-400/30 shadow-[0_0_10px_rgba(0,255,204,0.2)] transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_18px_rgba(0,255,204,0.45)] text-center sm:text-left">
          <span className="text-gray-300 text-sm sm:text-base">
            Designed, Developed & Hosted by
          </span>
          <span className="text-white text-sm sm:text-base font-semibold neon-transition neon-on-hover group-hover:text-cyan-400">
            Rasha Production
          </span>
        </div>
      </a>
    </div>
  );
};

export default CreditBar;
