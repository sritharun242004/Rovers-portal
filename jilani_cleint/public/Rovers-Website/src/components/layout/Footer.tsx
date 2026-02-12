import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Instagram, Youtube } from 'lucide-react';
import { LazyImage } from '../common/LazyImage';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Contact Information</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-rovers-emerald flex-shrink-0" />
                <span className="text-sm md:text-base text-white">roverssportsmeet@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-rovers-emerald flex-shrink-0" />
                <span className="text-sm md:text-base text-white">INDIA / UAE / MALAYSIA / SINGAPORE / OMAN / QATAR</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <Link to="/about" className="text-white hover:text-rovers-emerald transition-colors">
                About Us
              </Link>
              <Link to="/sports" className="text-white hover:text-rovers-emerald transition-colors">
                Sports Programs
              </Link>
              <Link to="/academy" className="text-white hover:text-rovers-emerald transition-colors">
                Academy
              </Link>
              <Link to="/partners" className="text-white hover:text-rovers-emerald transition-colors">
                Partners
              </Link>
              <Link to="/contact" className="text-white hover:text-rovers-emerald transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Follow Us</h3>
            <div className="flex space-x-4 mb-4 md:mb-6">
              <a href="https://www.instagram.com/roverssportsmeet" target="_blank" rel="noopener noreferrer" className="text-white hover:text-rovers-emerald transition-colors touch-manipulation">
                <Instagram className="w-5 h-5 md:w-6 md:h-6" />
              </a>
              <a href="https://www.youtube.com/@roverssportsmeet" target="_blank" rel="noopener noreferrer" className="text-white hover:text-rovers-emerald transition-colors touch-manipulation">
                <Youtube className="w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>
            <p className="text-white text-xs md:text-sm leading-relaxed">
              Stay connected for the latest updates on tournaments, success stories, and opportunities.
            </p>
          </div>
        </div>

        {/* Bottom Branding Line */}
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <LazyImage 
              src="https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/new+logo.png" 
              alt="ROVERS Logo" 
              className="h-6 md:h-8 w-auto"
            />
          </div>
          <p className="text-gray-400 text-sm">&copy; 2024 Top Tekker Sports Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};