import React from 'react';
import { MapPin, Phone, MessageCircle, Mail } from 'lucide-react';

const phones = [
  { label: 'Number 01', number: '+94 77 525 3543' },
  { label: 'Number 02', number: '+94 77 713 7813' },
  { label: 'Number 03', number: '011 237 5677' },
  // Add more numbers as needed:
  // { label: 'Office', number: '+94 xx xxx xxxx' },
];

const whatsapps = [
  { label: 'WhatsApp 01', number: '+94 77 525 3543' },
  { label: 'WhatsApp 02', number: '+94 77 713 7813' },
  // Add more WhatsApp numbers as needed
];

const addressLines = ['532/1, Sirkotha Lane', 'Colombo 03.'];
const emails = ['cv@airkingsgroup.com', 'hr@airkingsgroup.com'];

const Contact: React.FC = () => {
  const openTel = (n: string) => (window.location.href = `tel:${n.replace(/\s|\+/g, '')}`);
  const openWa = (n: string) => window.open(`https://wa.me/${n.replace(/\s|\+/g, '')}`, '_blank', 'noopener,noreferrer');
  const openMail = (addr: string) => (window.location.href = `mailto:${addr}`);

  return (
    <section className="py-16 sm:py-20 bg-gray-50" aria-labelledby="contact-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h1 id="contact-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 animate-fadeInUp">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
            We’re here to help. Reach us via phone, WhatsApp, email, or visit our office.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 animate-fadeInUp animation-delay-600"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Cards */}
          <div className="space-y-6 lg:col-span-1">
            <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeInUp">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                  <p className="text-gray-600">
                    {addressLines.map((l, i) => (
                      <span key={i}>
                        {l}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <a
                href="https://www.google.com/maps?q=532/1%20Sirkotha%20Lane%2C%20Colombo%2003"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Open in Google Maps
              </a>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeInUp animation-delay-300">
              <div className="flex items-start gap-3 mb-4">
                <Phone className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div className="w-full">
                  <h3 className="text-lg font-semibold text-gray-800">Phone Numbers</h3>
                  <ul className="mt-2 space-y-2">
                    {phones.map((p) => (
                      <li key={p.label} className="flex items-center justify-between">
                        <span className="text-gray-600">{p.label}</span>
                        <button
                          onClick={() => openTel(p.number)}
                          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                          aria-label={`Call ${p.label} ${p.number}`}
                        >
                          {p.number}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeInUp animation-delay-600">
              <div className="flex items-start gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div className="w-full">
                  <h3 className="text-lg font-semibold text-gray-800">WhatsApp</h3>
                  <ul className="mt-2 space-y-2">
                    {whatsapps.map((w) => (
                      <li key={w.label} className="flex items-center justify-between">
                        <span className="text-gray-600">{w.label}</span>
                        <button
                          onClick={() => openWa(w.number)}
                          className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                          aria-label={`WhatsApp ${w.label} ${w.number}`}
                        >
                          {w.number}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeInUp animation-delay-900">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-purple-600 flex-shrink-0" />
                <div className="w-full">
                  <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                  <ul className="mt-2 space-y-2">
                    {emails.map((addr) => (
                      <li key={addr} className="flex items-center justify-between">
                        <span className="text-gray-600">Inbox</span>
                        <button
                          onClick={() => openMail(addr)}
                          className="text-purple-600 hover:text-purple-700 font-semibold transition-colors break-all"
                          aria-label={`Email ${addr}`}
                        >
                          {addr}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative w-full h-[300px] sm:h-[420px] rounded-xl overflow-hidden shadow-lg bg-gray-200 animate-fadeInUp">
              <iframe
                title="Air Kings Group Location"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=532/1%20Sirkotha%20Lane%2C%20Colombo%2003&output=embed"
              ></iframe>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => whatsapps[0] && openWa(whatsapps[0].number)}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Chat on WhatsApp
              </button>
              <button
                onClick={() => phones[0] && openTel(phones[0].number)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Call Us Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
