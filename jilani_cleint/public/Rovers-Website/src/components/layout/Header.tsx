import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Country pages have white backgrounds from the start, so need blue text immediately
  const isCountryPage = ['/india', '/uae', '/malaysia'].some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-gray-100/95 backdrop-blur-sm shadow-lg' 
        : 'bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-md border-b border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center">
            <div className="flex items-center text-2xl sm:text-3xl font-bold tracking-tight">
              <AnimatePresence mode="wait">
                {isScrolled ? (
                  <motion.img
                    key="favicon"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    src="https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/favicon+(1).png"
                    alt="ROVERS Logo" 
                    className="w-6 h-8 sm:w-8 sm:h-10 md:w-12 md:h-12 mt-2 sm:mt-3 ml-4 sm:ml-8 md:ml-10"
                    loading="eager"
                  />
                ) : (
                  <motion.img
                    key="full-logo"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    src="https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/new+logo.png"
                    alt="ROVERS Logo" 
                    className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto mt-2 sm:mt-3 md:mt-4"
                    loading="eager"
                  />
                )}
              </AnimatePresence>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            <Link
              to="/"
              className={`text-sm xl:text-base font-semibold transition-all duration-300 relative group ${
                isActivePath('/') && location.pathname === '/' 
                  ? (isScrolled ? 'text-blue-600' : 'text-white')
                  : (isScrolled || isCountryPage ? 'text-blue-800 hover:text-blue-600' : 'text-white/90 hover:text-white')
              }`}
            >
              Home
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-orange-400 transition-all duration-300 group-hover:w-full ${
                isActivePath('/') && location.pathname === '/' ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link
              to="/about"
              className={`text-sm xl:text-base font-semibold transition-all duration-300 relative group ${
                isActivePath('/about') 
                  ? (isScrolled ? 'text-blue-600' : 'text-white')
                  : (isScrolled || isCountryPage ? 'text-blue-800 hover:text-blue-600' : 'text-white/90 hover:text-white')
              }`}
            >
              About Us
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-orange-400 transition-all duration-300 group-hover:w-full ${
                isActivePath('/about') ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link
              to="/sports"
              className={`text-sm xl:text-base font-semibold transition-all duration-300 relative group ${
                isActivePath('/sports') 
                  ? (isScrolled ? 'text-blue-600' : 'text-white')
                  : (isScrolled || isCountryPage ? 'text-blue-800 hover:text-blue-600' : 'text-white/90 hover:text-white')
              }`}
            >
              Events
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-orange-400 transition-all duration-300 group-hover:w-full ${
                isActivePath('/sports') ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link
              to="/academy"
              className={`text-sm xl:text-base font-semibold transition-all duration-300 relative group ${
                isActivePath('/academy') 
                  ? (isScrolled ? 'text-blue-600' : 'text-white')
                  : (isScrolled || isCountryPage ? 'text-blue-800 hover:text-blue-600' : 'text-white/90 hover:text-white')
              }`}
            >
              School Programs
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-orange-400 transition-all duration-300 group-hover:w-full ${
                isActivePath('/academy') ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link
              to="/partners"
              className={`text-sm xl:text-base font-semibold transition-all duration-300 relative group ${
                isActivePath('/partners') 
                  ? (isScrolled ? 'text-blue-600' : 'text-white')
                  : (isScrolled || isCountryPage ? 'text-blue-800 hover:text-blue-600' : 'text-white/90 hover:text-white')
              }`}
            >
              Partners
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-orange-400 transition-all duration-300 group-hover:w-full ${
                isActivePath('/partners') ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link
              to="/contact"
              className={`text-sm xl:text-base font-semibold transition-all duration-300 relative group ${
                isActivePath('/contact') 
                  ? (isScrolled ? 'text-blue-600' : 'text-white')
                  : (isScrolled || isCountryPage ? 'text-blue-800 hover:text-blue-600' : 'text-white/90 hover:text-white')
              }`}
            >
              Contact
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-orange-400 transition-all duration-300 group-hover:w-full ${
                isActivePath('/contact') ? 'w-full' : ''
              }`}></span>
            </Link>

            {/* Login Buttons */}
            <a
              href="https://rovers.life/register"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 xl:px-5 py-2.5 rounded-full font-semibold text-sm xl:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                isScrolled || isCountryPage
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-white/95 hover:bg-white text-blue-600 backdrop-blur-sm border border-white/20'
              }`}
            >
              School Login
            </a>
            <a
              href="https://rovers.life/register"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 xl:px-5 py-2.5 rounded-full font-semibold text-sm xl:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white' 
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
              }`}
            >
              Parent Login
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 sm:p-3 rounded-lg transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isScrolled 
                ? 'text-blue-800 hover:text-blue-900 hover:bg-gray-200' 
                : 'text-white hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white border-opacity-20 mt-2"
            >
              <div className="py-4 space-y-1 bg-gray-100/95 backdrop-blur-sm rounded-b-lg shadow-lg">
                <Link
                  to="/"
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium px-4 py-4 transition-colors touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium px-4 py-4 transition-colors touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/sports"
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium px-4 py-4 transition-colors touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Events
                </Link>
                <Link
                  to="/academy"
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium px-4 py-4 transition-colors touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  School Programs
                </Link>
                <Link
                  to="/partners"
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium px-4 py-4 transition-colors touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Partners
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium px-4 py-4 transition-colors touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="px-4 pt-2 space-y-2 border-t border-gray-200">
                  <a
                    href="https://rovers.life/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 text-white py-4 rounded-lg font-medium text-center touch-manipulation transition-colors hover:bg-blue-700"
                  >
                    School Login
                  </a>
                  <a
                    href="https://rovers.life/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 text-white py-4 rounded-lg font-medium text-center touch-manipulation transition-colors hover:bg-green-700"
                  >
                    Parent Login
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};