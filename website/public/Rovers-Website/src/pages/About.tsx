import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Globe, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage } from '../components/common/LazyImage';

const team = [
  {
    name: 'Founder & CEO - Jeelani Subahan',
    role: 'Founder & CEO',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Founder+%26+CEO+-+Jeelani+Subahan.png',
    bio: 'Visionary leader transforming student sports education with international exposure and excellence.'
  },
  {
    name: 'Director - Sana Parwin',
    role: 'Director',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Director+-+Sana+Parwin.jpg',
    bio: 'Operations expert ensuring seamless execution of international sports programs and student development.'
  },
  {
    name: 'Community Partner - Nawin',
    role: 'Community Partner',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Community+Partner+-+Nawin.png',
    bio: 'Community engagement specialist building partnerships with schools and local sports organizations.'
  },
  {
    name: 'Advisory & Growth - Ratheesh Krishnan',
    role: 'Advisory & Growth',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Advisory+%26+Growth+-+Ratheesh+Krishnan.png',
    bio: 'Strategic advisor with extensive experience in sports industry growth and international expansion.'
  },
  {
    name: 'Skating - Ramesh',
    role: 'Skating Director',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/Ramesh.jpg',
    bio: 'Expert skating director with years of experience in developing world-class skaters and preparing them for national and international competitions.'
  },
  {
    name: 'Skating - Saraswathi',
    role: 'Skating Technical Director',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/Saraswathi.jpg',
    bio: 'Technical skating specialist focusing on precision training, technique refinement, and competitive excellence for aspiring skaters.'
  },
  {
    name: 'Silambam - Sandeep',
    role: 'Silambam Master',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Silambam+-+Sandeep.png',
    bio: 'Traditional Silambam master preserving Tamil martial arts while preparing athletes for international competition.'
  },
  {
    name: 'Karate - Thariq',
    role: 'Karate Sensei',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Karate+-+Thariq.png',
    bio: 'Karate expert with multiple black belts and experience in international martial arts competitions.'
  },
  {
    name: 'Director Athletics - Bala T D',
    role: 'Director Athletics',
    image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Director+Athletics+-+Bala+T+D.jpg',
    bio: 'Athletics specialist with expertise in track and field development and international competition preparation.'
  },
];

const solutions = [
  {
    icon: Target,
    title: 'Conducting Local Events',
    description: 'Organizing 75+ local events for kids and students to discover their potential and passion for sports.'
  },
  {
    icon: Users,
    title: 'Identify Talent',
    description: 'Scout promising student athletes across partner schools and academies through systematic evaluation.'
  },
  {
    icon: Globe,
    title: 'International Exposure',
    description: 'Access to international competitions, training camps, and cultural exchanges.'
  },
  {
    icon: Award,
    title: 'Achieve Excellence',
    description: 'Support athletes in reaching podium finishes and scholarship opportunities.'
  },
];

const carouselImages = [
  {
    src: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0017.jpg',
    title: 'Community Outreach Programs',
    description: 'Rovers team engaging with local communities to promote sports education'
  },
  {
    src: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0013.jpg',
    title: 'Professional Training Sessions',
    description: 'Our expert coaches conducting world-class training programs'
  },
  {
    src: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0011.jpg',
    title: 'Team Collaboration',
    description: 'Rovers leadership team working together to create champions'
  }
];

export const About: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        setIsTransitioning(false);
      }, 200);
    }, 2500); // Switch every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
      setIsTransitioning(false);
    }, 200);
  };

  const prevImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 sm:py-24 md:py-32 bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 mobile-text-responsive"
          >
            WHO WE ARE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto leading-relaxed mobile-text-responsive"
          >
            Rovers is more than a sports institute - we're a gateway to global opportunities 
            for student athletes who dare to dream big.
          </motion.p>
        </div>
      </section>

      {/* Group Photo Section */}
      <section className="py-16 bg-gradient-to-b from-white to-rovers-emerald/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-rovers-emerald to-rovers-blue bg-clip-text text-transparent">
                Our Team in Action
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              See our dedicated team working together to create champions and transform lives through sports.
            </p>
          </motion.div>
          
          {/* Professional Carousel */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl perspective-1000">
            <div className={`relative h-96 md:h-[500px] transform-style-preserve-3d transition-all duration-700 ${
              isTransitioning ? 'animate-pulse scale-105' : ''
            }`}>
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 transform ${
                    index === currentImageIndex 
                      ? 'opacity-100 scale-100 rotateY-0' 
                      : index === (currentImageIndex - 1 + carouselImages.length) % carouselImages.length
                        ? 'opacity-0 scale-95 -rotateY-45'
                        : 'opacity-0 scale-95 rotateY-45'
                  }`}
                  style={{
                    transform: index === currentImageIndex 
                      ? 'rotateY(0deg) scale(1)' 
                      : index === (currentImageIndex - 1 + carouselImages.length) % carouselImages.length
                        ? 'rotateY(-45deg) scale(0.95)'
                        : 'rotateY(45deg) scale(0.95)',
                    transformOrigin: 'center center',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <LazyImage
                    src={image.src}
                    alt={image.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isTransitioning ? 'brightness-110 contrast-110' : ''
                    }`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-700 ${
                    isTransitioning ? 'from-black/80 via-black/30' : ''
                  }`}></div>
                  <div className={`absolute bottom-8 left-8 right-8 text-white transition-all duration-700 ${
                    isTransitioning ? 'transform translate-y-2 scale-105' : ''
                  }`}>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{image.title}</h3>
                    <p className="text-base md:text-lg opacity-90 leading-relaxed">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-rovers-emerald/20 backdrop-blur-sm hover:bg-rovers-emerald/40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 border border-rovers-emerald/30"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-rovers-emerald/20 backdrop-blur-sm hover:bg-rovers-emerald/40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-rotate-12 border border-rovers-emerald/30"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentImageIndex(index);
                      setIsTransitioning(false);
                    }, 200);
                  }}
                  className={`w-4 h-4 rounded-full transition-all duration-500 hover:scale-125 ${
                    index === currentImageIndex 
                      ? 'bg-rovers-emerald scale-125 shadow-lg ring-2 ring-rovers-emerald/50' 
                      : 'bg-white/50 hover:bg-rovers-emerald/75 hover:scale-110'
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-gradient-to-b from-rovers-emerald/10 to-rovers-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-rovers-blue to-rovers-emerald bg-clip-text text-transparent">
                  Our Mission
                </span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We believe every student athlete deserves the opportunity to compete on the world stage. 
                Rovers bridges the gap between school sports and international competition, providing 
                comprehensive training, exposure, and support systems that transform potential into performance.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Through strategic partnerships with schools, world-class coaching, and international 
                competition opportunities, we create pathways for students to achieve excellence 
                in their chosen sports while maintaining their academic commitments.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rovers-red/20 to-rovers-yellow/20 rounded-2xl transform rotate-3"></div>
              <LazyImage
                src="https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/WhatsApp+Image+Sept+16+2025+from+SPI+Infrastructure.jpg"
                alt="Student athletes training"
                className="relative z-10 w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-16 bg-gradient-to-b from-rovers-blue/10 to-rovers-red/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-rovers-emerald to-rovers-blue bg-clip-text text-transparent">
                Our Solution
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              From local events to international championships - our comprehensive pathway transforms student athletes into global champions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-rovers-emerald/20' :
                    index === 1 ? 'bg-rovers-blue/20' :
                    index === 2 ? 'bg-rovers-red/20' : 'bg-rovers-yellow/20'
                  }`}>
                    <solution.icon className={`w-8 h-8 ${
                      index === 0 ? 'text-rovers-emerald' :
                      index === 1 ? 'text-rovers-blue' :
                      index === 2 ? 'text-rovers-red' : 'text-rovers-yellow'
                    }`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-700 leading-relaxed">{solution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-gradient-to-b from-rovers-red/10 to-rovers-yellow/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-rovers-emerald to-rovers-blue bg-clip-text text-transparent">
                Meet Our Team
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Meet the experienced professionals driving Rovers' mission to create global champions.
            </p>
          </motion.div>

          {/* First Row - Top 3 Team Members */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.slice(0, 3).map((member, index) => (
                <motion.div
                  key={member.name + index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-rovers-emerald/20"
                >
                  <LazyImage
                    src={member.image}
                    alt={member.name}
                    className="w-36 h-36 object-cover rounded-full mx-auto mb-4 shadow-md"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-rovers-emerald font-semibold mb-3 text-lg">{member.role}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Second Row - Remaining Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.slice(3).map((member, index) => (
              <motion.div
                key={member.name + index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 ${
                  index % 4 === 0 ? 'border-rovers-blue/20' :
                  index % 4 === 1 ? 'border-rovers-red/20' :
                  index % 4 === 2 ? 'border-rovers-yellow/20' : 'border-rovers-emerald/20'
                }`}
              >
                <LazyImage
                  src={member.image}
                  alt={member.name}
                  className="w-36 h-36 object-cover rounded-full mx-auto mb-4 shadow-md"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className={`font-semibold mb-3 text-base ${
                  index % 4 === 0 ? 'text-rovers-blue' :
                  index % 4 === 1 ? 'text-rovers-red' :
                  index % 4 === 2 ? 'text-rovers-yellow' : 'text-rovers-emerald'
                }`}>{member.role}</p>
                <p className="text-gray-700 text-xs leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};