import React from 'react';
import { MapPin, Clock, MessageCircle, X, Share2, Download, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  status: 'urgent' | 'now_recruiting' | 'closing_soon' | 'expired';
  image: string;
  description: string;
  requirements: string[];
  benefits: string[];
  media: Array<{
    type: 'image' | 'video';
    url: string;
    alt?: string;
    // Added optional focal fields for cropping controls
    focalX?: number;
    focalY?: number;
    focalScale?: number; // NEW
  }>;
  whatsappNumber: string;
  isExpanded?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  company,
  location,
  salary,
  type,
  status,
  image,
  description,
  requirements,
  benefits,
  media,
  whatsappNumber,
  isExpanded = false,
  onExpand,
  onClose
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'urgent':
        return { 
          label: 'URGENT', 
          bgColor: 'bg-red-600', 
          textColor: 'text-white',
          pulseColor: 'animate-pulse'
        };
      case 'now_recruiting':
        return { 
          label: 'NOW RECRUITING', 
          bgColor: 'bg-green-600', 
          textColor: 'text-white',
          pulseColor: ''
        };
      case 'closing_soon':
        return { 
          label: 'CLOSING SOON', 
          bgColor: 'bg-orange-600', 
          textColor: 'text-white',
          pulseColor: 'animate-pulse'
        };
      case 'expired':
        return { 
          label: 'EXPIRED', 
          bgColor: 'bg-gray-500', 
          textColor: 'text-white',
          pulseColor: ''
        };
      default:
        return { 
          label: 'NOW RECRUITING', 
          bgColor: 'bg-green-600', 
          textColor: 'text-white',
          pulseColor: ''
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const handleApplyNow = () => {
    if (status === 'expired') {
      alert('This position has expired and is no longer accepting applications.');
      return;
    }
    const message = `Hi AirKings! I'm interested in applying for the ${title} position at ${company}. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Build a deep link to this card
  const buildDeepLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('job', id);
    return url.toString();
  };

  // Helper: copy text to clipboard with TS-safe fallback
  const copyDeepLink = async (text: string) => {
    try {
      const navAny = (window.navigator as any);
      if (navAny?.clipboard?.writeText) {
        await navAny.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      alert('Link copied to clipboard!');
    } catch {
      // Last resort prompt
      window.prompt('Copy this link', text);
    }
  };

  const handleShare = async () => {
    const deepLink = buildDeepLink();

    // Pick the best image to share
    const current = media?.[currentMediaIndex];
    let imageUrl: string | undefined;
    if (current && current.type === 'image') imageUrl = current.url;
    else {
      const firstImage = media?.find(m => m.type === 'image');
      imageUrl = firstImage?.url || image;
    }

    try {
      if (imageUrl) {
        const res = await fetch(imageUrl, { mode: 'cors' });
        const blob = await res.blob().catch(() => null);
        if (blob && 'canShare' in navigator) {
          const ext = blob.type.split('/')[1] || 'jpg';
          const safeTitle = title.replace(/[^\w\-]+/g, '_');
          const file = new File([blob], `${safeTitle}.${ext}`, { type: blob.type });

          // Share with file if supported
          if ((navigator as any).canShare?.({ files: [file] })) {
            await (navigator as any).share({
              title: `${title} at ${company}`,
              text: description,
              url: deepLink,
              files: [file],
            });
            return;
          }
        }
      }

      // Fallback: share without file
      if ('share' in navigator) {
        await (navigator as any).share({
          title: `${title} at ${company}`,
          text: description,
          url: deepLink,
        });
      } else {
        await copyDeepLink(deepLink);
      }
    } catch (e) {
      console.error('Share failed:', e);
      try {
        await copyDeepLink(deepLink);
      } catch {
        // last resort
        window.open(deepLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // CHANGE: download the current image (or first image) as a file
  const handleDownload = async () => {
    // Prefer the currently viewed image
    const current = media?.[currentMediaIndex];
    let imageUrl: string | undefined;

    if (current && current.type === 'image') {
      imageUrl = current.url;
    } else {
      // Fallback to the first image in media
      const firstImage = media?.find(m => m.type === 'image');
      if (firstImage) {
        imageUrl = firstImage.url;
      } else if (image) {
        // Final fallback: the card cover image
        imageUrl = image;
      }
    }

    if (!imageUrl) {
      alert('No image available to download.');
      return;
    }

    try {
      const res = await fetch(imageUrl, { mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();

      // Infer extension from blob type or URL
      const typeToExt: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'image/svg+xml': 'svg'
      };
      const urlExtMatch = imageUrl.split('?')[0].split('.').pop();
      const extFromType = typeToExt[blob.type] || (urlExtMatch && urlExtMatch.length <= 5 ? urlExtMatch : 'jpg');
      const safeTitle = title.replace(/[^\w\-]+/g, '_');
      const filename = `${safeTitle}_image.${extFromType}`;

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error('Image download failed:', e);
      // As a fallback, try a direct navigation which may prompt a download if headers permit
      const a = document.createElement('a');
      a.href = imageUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handlePrevMedia = () => {
    if (media && media.length > 0) {
      setCurrentMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    }
  };

  const handleNextMedia = () => {
    if (media && media.length > 0) {
      setCurrentMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // Compute object-position and zoom from the first media's focal point
  const coverFocalX = ((media?.[0]?.focalX ?? 0.5) * 100).toFixed(2);
  const coverFocalY = ((media?.[0]?.focalY ?? 0.5) * 100).toFixed(2);
  const coverScale = media?.[0]?.focalScale ?? 1;

  if (isExpanded) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
          {/* Header with close button */}
          <div className="relative overflow-hidden rounded-t-2xl">
            {/* Media Carousel */}
            {media && media[currentMediaIndex] && media[currentMediaIndex].type === 'image' ? (
              <img
                src={media[currentMediaIndex].url}
                alt={media[currentMediaIndex].alt || title}
                className="w-full h-auto max-h-[60vh] object-contain bg-gray-100"
              />
            ) : media && media[currentMediaIndex] ? (
              <video
                src={media[currentMediaIndex].url}
                className="w-full h-auto max-h-[60vh] object-contain bg-gray-100"
                controls
                autoPlay
                muted
              />
            ) : (
              <img
                src="https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={title}
                className="w-full h-auto max-h-[60vh] object-contain bg-gray-100"
              />
            )}
            
            {/* Media Navigation */}
            {media && media.length > 1 && (
              <>
                <button
                  onClick={handlePrevMedia}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextMedia}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Media Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {media && media.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMediaIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentMediaIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all duration-300 hover:scale-110"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
            <div className="absolute bottom-4 left-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {type}
              </span>
            </div>
            <div className="absolute top-4 left-4">
              <span className={`${statusConfig.bgColor} ${statusConfig.textColor} px-4 py-2 rounded-full text-sm font-bold ${statusConfig.pulseColor}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-xl text-blue-600 font-semibold">{company}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Job details grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="flex items-start md:items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
                <div className="leading-tight md:leading-normal mt-0.5 md:mt-0">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-800">{location}</p>
                </div>
              </div>
              <div className="flex items-start md:items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 text-green-600 font-bold text-lg flex items-center justify-center leading-none mt-0.5 md:mt-0">
                  ﷼
                </div>
                <div className="leading-tight md:leading-normal mt-0.5 md:mt-0">
                  <p className="text-sm text-gray-500 mb-0.5 md:mb-0">Salary</p>
                  <p className="font-bold text-gray-800 text-base md:text-lg bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    {salary}
                  </p>
                </div>
              </div>
              <div className="flex items-start md:items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
                <div className="leading-tight md:leading-normal mt-0.5 md:mt-0">
                  <p className="text-sm text-gray-500 mb-0.5 md:mb-0">Type</p>
                  <p className="font-semibold text-gray-800 text-base md:text-lg">{type}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Job Description</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
              
              {/* Additional details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Requirements
                  </h4>
                  <ul className="text-gray-600 space-y-2">
                    {requirements.map((req, index) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Benefits
                  </h4>
                  <ul className="text-gray-600 space-y-2">
                    {benefits.map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Apply button */}
            <div className="flex justify-center">
              <button
                onClick={handleApplyNow}
                className={`${
                  status === 'expired' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105'
                } text-white py-4 px-12 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl`}
                disabled={status === 'expired'}
              >
                <MessageCircle className="w-6 h-6" />
                {status === 'expired' ? 'Position Expired' : 'Apply Now via WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group cursor-pointer h-full flex flex-col"
      onClick={onExpand}
    >
      {/* Job Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          style={{
            objectPosition: `${coverFocalX}% ${coverFocalY}%`,
            transformOrigin: `${coverFocalX}% ${coverFocalY}%`,
            transform: `scale(${coverScale})`
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <span className={`${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1 rounded-full text-xs font-bold ${statusConfig.pulseColor} inline-flex w-auto`}>
            {statusConfig.label}
          </span>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold inline-flex w-auto">
            {type}
          </span>
        </div>
      </div>

      {/* Job Details */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 font-semibold mb-4">{company}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 text-green-600 font-bold text-sm flex items-center justify-center">﷼</span>
            <span className="font-bold text-green-600">{salary}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">{description}</p>

        {/* Apply Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleApplyNow();
          }}
          className={`w-full ${
            status === 'expired' 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
          } text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl mt-auto`}
          disabled={status === 'expired'}
        >
          <MessageCircle className="w-5 h-5" />
          {status === 'expired' ? 'Expired' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;