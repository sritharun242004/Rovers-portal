import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CounterUp } from '../components/common/CounterUp';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Trophy, 
  Globe,
  School,
  Award,
  ChevronRight,
  Target,
  Building,
  Star,
  ArrowRight
} from 'lucide-react';

// Information cards data
const informationCards = [
  {
    title: 'Championship Events',
    content: 'Elite-level competitions in Dubai Sports City with world-class infrastructure',
    stats: 'Professional-grade venues',
    icon: Trophy
  },
  {
    title: 'International Standards', 
    content: 'World-class facilities and professional management meeting global benchmarks',
    stats: 'Olympic-standard facilities',
    icon: Star
  },
  {
    title: 'Multi-Sport Platform',
    content: '9 sports categories for comprehensive development across all disciplines',
    stats: '9 sports categories',
    icon: Target
  },
  {
    title: 'Regional Hub',
    content: 'Central location connecting Asia-Pacific sports networks and opportunities',
    stats: 'Asia-Pacific gateway',
    icon: Globe
  }
];

// Sports categories list
const sportsCategories = [
  'Athletics (Track & Field Events)',
  'Swimming (International Standards)',
  'Tennis (Professional Courts)',
  'Football (FIFA Standards)',
  'Basketball (FIBA Regulations)',
  'Badminton (BWF Approved)',
  'Karate (WKF Standards)',
  'Taekwondo (WT Recognized)',
  'Multi-Sport Events (Combined Disciplines)'
];

// Key cities for map
const keyCities = [
  { name: 'Dubai', x: '65%', y: '70%' },
  { name: 'Abu Dhabi', x: '45%', y: '75%' },
  { name: 'Sharjah', x: '70%', y: '65%' }
];

export const UAE: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Below Navbar */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/sports"
                className="flex items-center text-gray-600 hover:text-rovers-emerald transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Sports Programs
              </Link>
            </div>
            <div className="hidden md:flex items-center text-sm text-gray-500">
              <Link to="/sports" className="hover:text-rovers-emerald">Sports Programs</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-rovers-emerald font-medium">UAE</span>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">ROVERS UAE Operations</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0011.jpg')`
          }}
        />
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}
          >
            UAE Sports Excellence Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white max-w-4xl mx-auto leading-relaxed"
            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
          >
            Elite multi-sport championships • Complete international platform
          </motion.p>
        </div>
      </section>

      {/* Sports Programs in UAE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sports Programs Available in UAE</h2>
            <p className="text-lg text-gray-600">Elite sports development with world-class facilities</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Athletics',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Athletics.png',
                description: 'Track and field events with regional competition opportunities',
                available: false
              },
              {
                name: 'Badminton',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Badminton.png',
                description: 'International badminton program coming soon to UAE',
                available: false
              },
              {
                name: 'Cricket',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Cricket.png',
                description: 'Professional cricket program coming soon to UAE',
                available: false
              },
              {
                name: 'Football',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Football.png',
                description: 'FIFA-standard football training coming soon to UAE',
                available: false
              },
              {
                name: 'Judo',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Judo.png',
                description: 'Olympic judo training program coming soon to UAE',
                available: false
              },
              {
                name: 'Karate',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Karate.png',
                description: 'Traditional karate training coming soon to UAE',
                available: false
              },
              {
                name: 'Padel Tennis',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Padel+Tennis.png',
                description: 'Modern padel tennis program coming soon to UAE',
                available: false
              },
              {
                name: 'Silambam',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Silambam.png',
                description: 'Traditional martial art program coming soon to UAE',
                available: false
              },
              {
                name: 'Skating',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Skating.png',
                description: 'Inline and roller skating program coming soon to UAE',
                available: false
              },
              {
                name: 'Swimming',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Swimming.png',
                description: 'World-class aquatic training coming soon to UAE',
                available: false
              },
              {
                name: 'Taekwondo',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Taekwondo.png',
                description: 'Traditional taekwondo program coming soon to UAE',
                available: false
              },
              {
                name: 'Tennis',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Tennis.png',
                description: 'Professional tennis development program coming soon to UAE',
                available: false
              }
            ].map((sport, index) => (
              <motion.div
                key={sport.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link to={sport.path}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={sport.image}
                        alt={sport.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      {!sport.available && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Coming Soon
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{sport.name}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{sport.description}</p>
                      <div className="flex items-center text-rovers-emerald font-semibold group">
                        <span>{sport.available ? 'View Event Details' : 'Stay Tuned'}</span>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* UAE Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">UAE Sports Excellence Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <CounterUp value="7" suffix="+" className="text-3xl font-bold" />
                <div className="text-white/90">Emirates Covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold">World-Class</div>
                <div className="text-white/90">Facilities</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Elite</div>
                <div className="text-white/90">Competition Standards</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Information Cards Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {informationCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-rovers-emerald/10 rounded-full flex items-center justify-center mb-4">
                  <card.icon className="w-6 h-6 text-rovers-emerald" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{card.content}</p>
                <div className="border-t pt-4">
                  <p className="text-rovers-emerald font-bold text-sm">{card.stats}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Categories in UAE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sports Categories in UAE</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Elite sports programs with international standards and professional facility partnerships
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sportsCategories.map((sport, index) => (
                <motion.div
                  key={sport}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-2 h-2 bg-rovers-emerald rounded-full mr-3"></div>
                  <span className="text-gray-700 font-medium">{sport}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Metrics Bar */}
      <section className="py-12 bg-rovers-emerald">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-center items-center text-center md:text-left space-y-6 md:space-y-0 md:space-x-12"
          >
            <div className="text-white">
              <div className="text-3xl font-bold">World-Class</div>
              <div className="text-emerald-100">Facilities</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-emerald-300"></div>
            <div className="text-white">
              <CounterUp value="9" suffix="+" className="text-3xl font-bold" delay={0.2} />
              <div className="text-emerald-100">Sports Categories</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-emerald-300"></div>
            <div className="text-white">
              <div className="text-3xl font-bold">Elite</div>
              <div className="text-emerald-100">Competition Standards</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join ROVERS UAE?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience elite sports development in world-class facilities with international standards
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/events/uae-multisport"
              className="bg-rovers-emerald hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center group shadow-xl hover:shadow-2xl"
            >
              View Upcoming UAE Events
              <Calendar className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/partners#partnership-form"
              className="border-2 border-rovers-emerald text-rovers-emerald hover:bg-rovers-emerald hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center"
            >
              Partner with Rovers UAE
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
