import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LazyImage } from '../components/common/LazyImage';
import { CounterUp } from '../components/common/CounterUp';
import { VideoShowcase } from '../components/home/VideoShowcase';
import { VoiceOfRovers } from '../components/home/VoiceOfRovers';
import {
  ArrowRight,
  Trophy,
  Users,
  Globe,
  Target,
  Award,
  TrendingUp,
  Heart,
  Shield,
  Zap
} from 'lucide-react';

const sportsData = [
  {
    name: 'Skating',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Skating.png'
  },
  {
    name: 'Badminton',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Badminton.png'
  },
  {
    name: 'Taekwondo',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Taekwondo.png'
  },
  {
    name: 'Karate',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Karate.png'
  },
  {
    name: 'Silambam',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Silambam.png'
  },
  {
    name: 'Athletics',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/portal/WhatsApp+Image+2025-11-18+at+22.57.36.jpeg'
  },
  {
    name: 'Football',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Football.png'
  },
  {
    name: 'Cricket',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Cricket.png'
  },
  {
    name: 'Judo',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Judo.png'
  },
  {
    name: 'Padel Tennis',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Padel+Tennis.png'
  },
  {
    name: 'Tennis',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Tennis.png'
  },
  {
    name: 'Swimming',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Swimming.png'
  },
];

const solutionSteps = [
  {
    icon: Target,
    title: 'Conducting Local Events',
    description: 'Organizing 75+ local events for kids and students to discover their potential'
  },
  {
    icon: Users,
    title: 'Identify Talent',
    description: 'Scout promising student athletes across partner schools'
  },
  {
    icon: Globe,
    title: 'International Exposure',
    description: 'Access to global competitions and cultural exchanges'
  },
  {
    icon: Award,
    title: 'Achieve Excellence',
    description: 'Support athletes to reach podiums and scholarships'
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: 'Performance Excellence',
    description: 'Systematic training for peak athletic performance'
  },
  {
    icon: Heart,
    title: 'Character Development',
    description: 'Building discipline, teamwork, and leadership'
  },
  {
    icon: Shield,
    title: 'Safe Environment',
    description: 'Professional coaching with safety as priority'
  },
  {
    icon: Zap,
    title: 'Fast Track Progress',
    description: 'Accelerated development through proven methods'
  },
];

const partners = [
  'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/dsc-logo.4f0528de.webp',
  'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/DPIIT+Logo.png',
  'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/Startup+TN+Logo.png',
  'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/SPI+Edge+Logo.png',
  'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/Startup+Payanam+Logo.png',
  'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/Dolabs+Logo+from+SPI+Infrastructure.png',
];

export const Home: React.FC = () => {
  console.log('🏠 [Rovers-Website] Home.tsx - Component rendering');

  const [currentStep, setCurrentStep] = useState(0);
  const [showCloud, setShowCloud] = useState(false);

  useEffect(() => {
    console.log('✅ [Rovers-Website] Home.tsx - Component mounted successfully');
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % solutionSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowCloud(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen font-inter">
      {/* Hero Section - Redesigned with Background Image */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900"
        style={{
          backgroundImage: `url('https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/rovers-home-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        {/* Gradient Overlay for Depth and Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/70"></div>
        
        {/* Secondary Gradient for Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-rovers-emerald/10 via-transparent to-orange-500/10"></div>

        {/* Animated Mesh Gradient Blobs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-orange-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>
        </div>

        {/* Diagonal Stripes Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(255, 255, 255, 0.05) 20px,
              rgba(255, 255, 255, 0.05) 40px
            )`
          }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Floating Sport Icons */}
        <div className="absolute inset-0 hidden lg:block">
          <motion.div
            className="absolute top-20 left-16 text-emerald-400 opacity-20"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Trophy className="w-20 h-20" />
          </motion.div>
          <motion.div
            className="absolute bottom-32 right-24 text-orange-400 opacity-20"
            animate={{
              y: [0, -12, 0],
              rotate: [0, -8, 0],
              scale: [1, 1.08, 1]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Award className="w-24 h-24" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-16 text-emerald-300 opacity-15"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 15, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Globe className="w-16 h-16" />
          </motion.div>
          <motion.div
            className="absolute bottom-48 left-32 text-orange-300 opacity-15"
            animate={{
              y: [0, -10, 0],
              rotate: [0, -10, 0]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Target className="w-14 h-14" />
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="text-center">
            {/* Main Heading - Responsive Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight mb-4 sm:mb-6 md:mb-8"
            >
              <span className="block text-white mb-1 sm:mb-2">Play as Big as</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
                Your Dreams
              </span>
            </motion.h1>

            {/* Subtitle - Responsive */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 font-light max-w-3xl sm:max-w-4xl mx-auto leading-relaxed text-gray-200 px-2 sm:px-0"
            >
              From school playgrounds to <span className="text-emerald-400 font-semibold">global podiums</span> -
              empowering student athletes with <span className="text-orange-400 font-semibold">world-class training</span> and
              <span className="text-blue-400 font-semibold"> international exposure</span>
            </motion.p>

            {/* CTA Buttons - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center px-2 sm:px-0"
            >
              <Link
                to="/sports"
                className="group relative bg-gradient-to-r from-emerald-500 to-orange-500 hover:from-emerald-600 hover:to-orange-600 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 inline-flex items-center shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 w-full sm:w-auto justify-center min-h-[48px] sm:min-h-[56px]"
              >
                <Zap className="mr-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
                Start Your Journey
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
              </Link>

              <Link
                to="/contact"
                className="group border-2 border-white/30 hover:border-white bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 inline-flex items-center w-full sm:w-auto justify-center min-h-[48px] sm:min-h-[56px]"
              >
                <Users className="mr-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                Talk to Expert
              </Link>
            </motion.div>

            {/* Trust Indicators - Responsive */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-8 sm:mt-12 md:mt-16 flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-8 text-gray-400 text-xs sm:text-sm px-2 sm:px-0"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                <span>DPIIT Certified</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                <span>100+ Partner Schools</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span>75+ Events Annually</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Gradient Fade (appears after slight scroll) */}
        <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent transform translate-y-4 transition-opacity duration-500 ${showCloud ? 'opacity-100' : 'opacity-0'}`}></div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 border border-blue-200 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-blue-300 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-blue-200 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 px-4">Your Journey to Excellence</h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
              Follow the Rovers pathway from school sports to international championships.
              Each milestone represents a step closer to your dreams.
            </p>
          </motion.div>

          {/* Interactive Journey Map */}
          <div className="relative">
            {/* Journey Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 1200 600">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <path
                d="M 100 300 Q 300 150 500 300 T 900 200 Q 1000 150 1100 200"
                stroke="url(#pathGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="10,5"
                className="animate-pulse"
              />
            </svg>

            {/* Journey Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 relative z-10">
              {solutionSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative group cursor-pointer touch-manipulation"
                >
                  {/* Milestone Number */}
                  <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg ${index === 0 ? 'bg-orange-500' :
                      index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-green-500'
                      }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Milestone Card */}
                  <div className={`bg-white bg-opacity-90 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 h-48 sm:h-56 md:h-64 flex flex-col justify-center items-center text-center text-gray-900 border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 group-hover:bg-opacity-100 group-hover:scale-105 shadow-lg ${currentStep === index ? 'ring-2 ring-orange-500 bg-opacity-100' : ''
                    }`}>
                    <step.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 md:mb-4 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                    <h4 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 md:mb-3">{step.title}</h4>
                    <p className="text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed px-1">{step.description}</p>

                    {/* Progress Indicator */}
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${index === 0 ? 'bg-orange-500 w-1/4' :
                          index === 1 ? 'bg-blue-500 w-1/2' :
                            index === 2 ? 'bg-purple-500 w-3/4' : 'bg-green-500 w-full'
                          }`}
                      ></div>
                    </div>
                  </div>

                  {/* Sport Examples */}
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                    <div className="bg-gray-900 bg-opacity-90 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap">
                      {index === 0 && '75+ Local Events Conducted'}
                      {index === 1 && 'Badminton, Karate, Cricket'}
                      {index === 2 && 'International Tournaments'}
                      {index === 3 && 'Championships & Scholarships'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Success Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
            >
              {[
                { value: '15', suffix: 'K+', label: 'Students Trained', color: 'text-orange-500' },
                { value: '132', suffix: '+', label: 'International Winners', color: 'text-blue-400' },
                { value: '6', suffix: '+', label: 'Countries Reached', color: 'text-purple-400' },
                { value: '100', suffix: '+', label: 'Partner Schools', color: 'text-green-400' },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <CounterUp
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={2.5}
                    delay={index * 0.2}
                    className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-1 md:mb-2 ${stat.color}`}
                  />
                  <div className="text-gray-700 text-xs sm:text-xs md:text-sm font-medium text-center">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12 md:mt-16"
            >
              <Link
                to="/sports"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 inline-flex items-center group shadow-2xl touch-manipulation"
              >
                Start Your Journey Today
                <ArrowRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sports Grid */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 px-4">Sports Categories</h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
              Choose from our comprehensive sports programs designed to take you from local competitions to international championships.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {sportsData.map((sport, index) => (
              <motion.div
                key={sport.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer touch-manipulation"
              >
                <Link to={`/sports?sport=${sport.name.toLowerCase().replace(' ', '-')}`}>
                  <div className="relative h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <LazyImage
                      src={sport.image}
                      alt={sport.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-rovers-emerald bg-opacity-0 group-hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center">
                      <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Trophy className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-4" />
                        <p className="text-lg md:text-xl font-bold">Join Competitions</p>
                      </div>
                    </div>
                    <div className="absolute bottom-2 sm:bottom-3 md:bottom-6 left-2 sm:left-3 md:left-6 right-2 sm:right-3 md:right-6 text-white">
                      <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{sport.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 px-4">Why Choose Rovers</h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
              Experience the difference with our comprehensive approach to student athlete development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group touch-manipulation"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-emerald-blue rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">{benefit.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <VideoShowcase />

      {/* Voice of Rovers Testimonials */}
      <VoiceOfRovers />

      {/* Partners Continuous Scroll */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 px-4">PERCEIVED BY</h2>
            <p className="text-lg sm:text-xl text-gray-800 font-semibold px-4">
              Collaborating with leading institutions worldwide
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              animate={{ x: [0, -100 * partners.length] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="flex space-x-20"
            >
              {[...partners, ...partners].map((logo, index) => {
                // Check if this is one of the logos that needs to be larger
                const isSmallLogo = logo.includes('Startup+Payanam') ||
                  logo.includes('SPI+Edge') ||
                  logo.includes('Dolabs');

                return (
                  <div key={index} className="flex-shrink-0 w-32 sm:w-40 md:w-48 h-16 sm:h-20 md:h-24 flex items-center justify-center p-2 sm:p-3 md:p-4 transition-all duration-300 hover:scale-110">
                    <LazyImage
                      src={logo}
                      alt={`Partner ${index}`}
                      className={`${isSmallLogo
                        ? 'max-h-12 sm:max-h-16 md:max-h-20 lg:max-h-24'
                        : 'max-h-10 sm:max-h-12 md:max-h-16 lg:max-h-20'
                        } max-w-full object-contain transition-all duration-300 hover:scale-105`}
                    />
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-6 md:mb-8 px-4"
          >
            Where Your Sports Journey Meets the World
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-gray-600 mb-8 md:mb-12 leading-relaxed px-4"
          >
            Join Rovers and give your students access to international competitions,
            world-class coaching, and opportunities that transform dreams into reality.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4"
          >
            <Link
              to="/sports"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 inline-flex items-center justify-center group shadow-xl hover:shadow-2xl touch-manipulation"
            >
              Start Your Journey
              <ArrowRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 touch-manipulation"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};