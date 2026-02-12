import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Trophy, Users, Globe, Star, Target, Award, Shield, Zap, Medal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from '../components/common/LazyImage';

const Sports: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const sports = [
    {
      id: 'athletics',
      name: 'Athletics',
      image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/portal/WhatsApp+Image+2025-11-18+at+22.57.36.jpeg',
      tagline: 'Track and Field Excellence',
      category: 'Individual Sports',
      ageRange: '6-18 years',
      icon: Trophy,
      benefits: [
        'Builds super strong muscles and bones',
        'Makes your heart healthy and strong',
        'Teaches you to never give up',
        'Helps you run faster than your friends!'
      ],
      pathway: 'School → District → State → National → International',
      successRate: '85% of our athletes reach state level'
    },
    {
      id: 'badminton',
      name: 'Badminton',
      image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Badminton.png',
      tagline: 'Precision and Speed Mastery',
      category: 'Racquet Sports',
      ageRange: '5-18 years',
      icon: Zap,
      benefits: [
        'Super quick reflexes like a ninja',
        'Amazing hand-eye coordination',
        'Strong legs from jumping and lunging',
        'Sharp mind for strategy'
      ],
      pathway: 'Beginner → Club → District → National → BWF Tournaments',
      successRate: 'National champions trained here'
    },
    {
      id: 'cricket',
      name: 'Cricket',
      image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Cricket.png',
      tagline: 'Strategic Excellence',
      category: 'Team Sports',
      ageRange: '6-18 years',
      icon: Target,
      benefits: [
        'Teaches patience and planning',
        'Builds teamwork and leadership',
        'Improves concentration for hours',
        'Develops hand-eye coordination'
      ],
      pathway: 'School → Club → District → State → IPL Academies',
      successRate: 'State team selections guaranteed'
    },
    {
      id: 'football',
      name: 'Football',
      image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Football.png',
      tagline: 'Global Sport Excellence',
      category: 'Team Sports',
      ageRange: '4-18 years',
      icon: Globe,
      benefits: [
        'Amazing cardiovascular fitness',
        'Perfect teamwork skills',
        'Quick decision making',
        'Leadership on and off field'
      ],
      pathway: 'Grassroots → Youth Academy → Professional Clubs',
      successRate: 'European academy scholarships available'
    },
    {
      id: 'swimming',
      name: 'Swimming',
      image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Swimming.png',
      tagline: 'Aquatic Excellence',
      category: 'Individual Sports',
      ageRange: '3-18 years',
      icon: Trophy,
      benefits: [
        'Full-body workout and strength',
        'Healthy lungs and heart',
        'Low impact on joints',
        'Life-saving skill for safety'
      ],
      pathway: 'Learn to Swim → Competitive → National → Olympics',
      successRate: 'State records broken here'
    },
    {
      id: 'karate',
      name: 'Karate',
      image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Karate.png',
      tagline: 'Martial Arts Mastery',
      category: 'Martial Arts',
      ageRange: '4-18 years',
      icon: Star,
      benefits: [
        'Amazing flexibility and strength',
        'Laser-sharp focus and concentration',
        'Self-discipline and respect',
        'Confidence in any situation'
      ],
      pathway: 'White Belt → Black Belt → International Competitions',
      successRate: 'World championship medalists'
    },
    {
      id: 'judo',
      name: 'Judo',
      image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Judo.png',
      tagline: 'Discipline and Technique',
      category: 'Martial Arts',
      ageRange: '5-18 years',
      icon: Shield,
      benefits: [
        'Incredible balance and coordination',
        'Self-confidence and discipline',
        'Respect for others and yourself',
        'Physical and mental strength'
      ],
      pathway: 'Beginner → Dan Grades → Olympic Pathway',
      successRate: 'Asian Games qualifiers trained'
    },
    {
      id: 'tennis',
      name: 'Tennis',
      image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Tennis.png',
      tagline: 'Precision and Power',
      category: 'Racquet Sports',
      ageRange: '5-18 years',
      icon: Target,
      benefits: [
        'Hand-eye coordination mastery',
        'Strategic thinking and planning',
        'Physical fitness and agility',
        'Mental toughness under pressure'
      ],
      pathway: 'Junior Tournaments → ITF → Professional Circuit',
      successRate: 'ITF junior champions developed'
    },
    {
      id: 'taekwondo',
      name: 'Taekwondo',
      image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Taekwondo.png',
      tagline: 'Olympic Martial Arts',
      category: 'Martial Arts',
      ageRange: '4-18 years',
      icon: Medal,
      benefits: [
        'Incredible flexibility and kicks',
        'Mental focus and discipline',
        'Self-confidence and respect',
        'Olympic sport opportunities'
      ],
      pathway: 'Color Belts → Black Belt → Olympic Training',
      successRate: 'Olympic pathway available'
    },
    {
      id: 'skating',
      name: 'Skating',
      image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Skating.png',
      tagline: 'Speed and Artistic Excellence',
      category: 'Individual Sports',
      ageRange: '4-18 years',
      icon: Zap,
      benefits: [
        'Perfect balance and coordination',
        'Strong leg muscles',
        'Grace and artistic expression',
        'Speed and agility training'
      ],
      pathway: 'Basic Skills → Competitions → International Events',
      successRate: 'Asian championship participants'
    },
    {
      id: 'silambam',
      name: 'Silambam',
      image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Silambam.png',
      tagline: 'Traditional Martial Arts',
      category: 'Martial Arts',
      ageRange: '6-18 years',
      icon: Award,
      benefits: [
        'Amazing coordination and flexibility',
        'Connection to Tamil culture',
        'Full-body strength training',
        'Unique skill that impresses everyone'
      ],
      pathway: 'Traditional Forms → Competitions → World Championships',
      successRate: 'World championship gold medalists'
    },
    {
      id: 'padel-tennis',
      name: 'Padel Tennis',
      image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Padel+Tennis.png',
      tagline: 'Modern Racquet Sport',
      category: 'Racquet Sports',
      ageRange: '8-18 years',
      icon: Users,
      benefits: [
        'Easy to learn, hard to master',
        'Great social sport with friends',
        'Quick reflexes and strategy',
        'Perfect for all skill levels'
      ],
      pathway: 'Beginner → Club Level → International Circuits',
      successRate: 'National junior champions'
    }
  ];

  const categories = ['All Sports', 'Team Sports', 'Individual Sports', 'Racquet Sports', 'Martial Arts'];
  const [selectedCategory, setSelectedCategory] = useState('All Sports');

  const filteredSports = selectedCategory === 'All Sports' 
    ? sports 
    : sports.filter(sport => sport.category === selectedCategory);

  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);
  const maxIndex = Math.max(0, filteredSports.length - itemsPerView);

  useEffect(() => {
    if (isAutoPlaying && filteredSports.length > itemsPerView) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, maxIndex, filteredSports.length]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative py-32 bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Choose Your Sport,
              <br />
              <span className="text-orange-500">Shape Your Future</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white max-w-3xl mx-auto leading-relaxed mb-8"
            >
              From school playgrounds to international podiums - your journey starts here
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => document.getElementById('sports-carousel')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center group"
              >
                <Play className="mr-2 w-6 h-6" />
                Explore Sports Programs
              </button>
              <a
                href="https://rovers.life/register"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300"
              >
                Start Your Journey
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Upcoming World Record Attempts
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Join history-making multi-sport championships for kids across three countries
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* India Event Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url('https://postactionsbucket.s3.ap-south-1.amazonaws.com/event.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  willChange: 'transform'
                }}
              />
              <div className="absolute inset-0 bg-black/40"></div>
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-2xl">🇮🇳</span>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-2 text-white">World Record Attempt - India</h3>
                  <p className="text-orange-400 font-bold mb-2">Featured Sport: Badminton</p>
                  <p className="text-sm text-white font-bold mb-1">Transforming Indian Student Athletes</p>
                  <p className="text-xs text-white/80 mb-3">Tamil Nadu Physical Education and Sports University</p>
                </div>
                
                <div>
                  <p className="text-sm mb-4 leading-relaxed font-bold text-white">
                    Largest multisport championship for Kids - India
                  </p>
                  <Link
                    to="/india"
                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-extrabold transition-colors duration-300"
                  >
                    Explore India Program
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Malaysia Event Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url('https://postactionsbucket.s3.ap-south-1.amazonaws.com/event.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  willChange: 'transform'
                }}
              />
              <div className="absolute inset-0 bg-black/40"></div>
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-2xl">🇲🇾</span>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-2 text-white">World Record Attempt - Malaysia</h3>
                  <p className="text-orange-400 font-bold mb-2">Featured Sport: Silambam</p>
                  <p className="text-sm text-white font-bold mb-1">Martial Arts Excellence in Malaysia</p>
                  <p className="text-xs text-white/80 mb-3">Educity, Iskandar Puteri, Johor, Malaysia</p>
                </div>
                
                <div>
                  <p className="text-sm mb-4 leading-relaxed font-bold text-white">
                    Largest multisport championship for Kids - Malaysia
                  </p>
                  <Link
                    to="/malaysia"
                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-extrabold transition-colors duration-300"
                  >
                    Explore Malaysia Program
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* UAE Event Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url('https://postactionsbucket.s3.ap-south-1.amazonaws.com/event.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  willChange: 'transform'
                }}
              />
              <div className="absolute inset-0 bg-black/40"></div>
              
              <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-2xl">🇦🇪</span>
                  </div>
                  <h3 className="text-xl font-extrabold mb-2 text-white">World Record Attempt - UAE</h3>
                  <p className="text-orange-400 font-bold mb-1 text-sm">Featured Sport: Multi-Sport</p>
                  <p className="text-sm text-white font-bold mb-1">Elite Multi-Sport Excellence</p>
                  <p className="text-xs text-white/80 mb-2">Dubai Sports City, UAE</p>
                </div>
                
                <div>
                  <p className="text-xs mb-3 leading-tight font-bold text-white">
                    Historic moment spanning UAE and India, featuring 9 sports for kids aged 7-17. Guinness World Record attempt with participation certificates and official World Record Certificate.
                  </p>
                  <Link
                    to="/uae"
                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-extrabold transition-colors duration-300"
                  >
                    Explore UAE Program
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sports Carousel Section */}
      <section id="sports-carousel" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Professional Sports Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              World-class training designed to develop athletic excellence and character, 
              with pathways from beginner to international champion.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentIndex(0);
                }}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            {filteredSports.length > itemsPerView && (
              <>
                <button
                  onClick={prevSlide}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-900" />
                </button>
                <button
                  onClick={nextSlide}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-900" />
                </button>
              </>
            )}

            {/* Carousel Track */}
            <div className="overflow-hidden">
              <motion.div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
                }}
              >
                {filteredSports.map((sport, index) => (
                  <div
                    key={sport.id}
                    className="w-1/3 flex-shrink-0 px-4"
                    onMouseEnter={() => {
                      setHoveredCard(sport.id);
                      setIsAutoPlaying(false);
                    }}
                    onMouseLeave={() => {
                      setHoveredCard(null);
                      setIsAutoPlaying(true);
                    }}
                  >
                    <div className="group relative h-96 perspective-1000">
                      <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                        hoveredCard === sport.id ? 'rotate-y-180' : ''
                      }`}>
                        {/* Front of card */}
                        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-xl overflow-hidden">
                          <div 
                            className="w-full h-full bg-cover bg-center bg-no-repeat"
                            style={{ 
                              backgroundImage: `url('${sport.image}')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              willChange: 'transform'
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/30 to-transparent"></div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                              <div className="flex items-center mb-3">
                                <sport.icon className="w-8 h-8 text-orange-500 mr-3" />
                                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                  {sport.ageRange}
                                </span>
                              </div>
                              <h3 className="text-3xl font-black mb-2">{sport.name}</h3>
                              <p className="text-lg font-medium mb-2">{sport.tagline}</p>
                              <p className="text-sm text-blue-200">{sport.category}</p>
                            </div>
                          </div>
                        </div>

                        {/* Back of card */}
                        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl shadow-xl bg-gradient-to-br from-blue-900 to-blue-800 p-6 overflow-y-auto">
                          <div className="h-full flex flex-col text-white">
                            <div className="flex items-center mb-4">
                              <sport.icon className="w-8 h-8 text-orange-500 mr-3" />
                              <h3 className="text-2xl font-bold">{sport.name}</h3>
                            </div>
                            
                            <div className="flex-1 space-y-4 text-sm">
                              <div>
                                <h4 className="font-bold text-orange-500 mb-2">Key Benefits</h4>
                                <ul className="space-y-1">
                                  {sport.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-bold text-orange-500 mb-2">Pathway to Success</h4>
                                <p className="text-blue-100">{sport.pathway}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-bold text-orange-500 mb-2">Success Rate</h4>
                                <p className="text-blue-100 italic">{sport.successRate}</p>
                              </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-blue-700">
                              <a
                                href="https://rovers.life/register"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-bold transition-colors duration-300"
                              >
                                Start Your Journey
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Pagination Dots */}
            {filteredSports.length > itemsPerView && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'bg-blue-900 w-8' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl font-black text-white mb-6"
          >
            Ready to Begin Your Athletic Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Join Rovers Sports Academy and unlock your potential with professional coaching, 
            international opportunities, and a pathway to excellence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <a 
              href="https://rovers.life/register"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center group shadow-2xl"
            >
              Register Now
              <Trophy className="ml-2 w-6 h-6 group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300"
            >
              Contact Our Coaches
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Sports;