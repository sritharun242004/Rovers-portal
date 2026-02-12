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
  Plane,
  Shield,
  ArrowRight
} from 'lucide-react';

// Information cards data
const informationCards = [
  {
    title: 'Quarterly Championships',
    content: '5-7 major events every quarter across different regions',
    stats: '20+ events annually',
    icon: Calendar
  },
  {
    title: 'Global Pathway', 
    content: 'Selected Indian students receive full sponsorship for international competitions',
    stats: '50+ students annually to UAE/Malaysia',
    icon: Globe
  },
  {
    title: 'Educational Partnerships',
    content: 'Direct collaboration with schools and academies for talent identification',
    stats: '200+ partner institutions',
    icon: School
  },
  {
    title: 'Complete Sponsorship',
    content: 'Flight, accommodation, food, training - everything covered for deserving students',
    stats: '100% expense coverage',
    icon: Shield
  }
];

// Sports categories list
const sportsCategories = [
  'Athletics (Track & Field Events)',
  'Badminton (Singles & Doubles)',
  'Swimming (Multiple Stroke Categories)',
  'Karate (Traditional & Sport Karate)',
  'Silambam (Traditional Tamil Martial Art)',
  'Football (5-a-side Format)',
  'Tennis (Singles & Doubles)',
  'Skating (Speed & Artistic)',
  'Chess (Classical & Rapid)',
  'Basketball (Modified Court)',
  'Cricket (Short Format)',
  'Taekwondo (Sparring & Patterns)'
];

// Key cities for map
const keyCities = [
  { name: 'Delhi', x: '48%', y: '25%' },
  { name: 'Mumbai', x: '25%', y: '55%' },
  { name: 'Chennai', x: '60%', y: '75%' },
  { name: 'Bangalore', x: '55%', y: '70%' },
  { name: 'Kolkata', x: '70%', y: '45%' }
];

export const India: React.FC = () => {
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
              <span className="text-rovers-emerald font-medium">India</span>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">ROVERS India Operations</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0017.jpg')`
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
            Transforming Indian Student Athletes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white max-w-4xl mx-auto leading-relaxed"
            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
          >
            5-7 quarterly events across all states • Complete international support
          </motion.p>
        </div>
      </section>

      {/* Sports Programs in India */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sports Programs Available in India</h2>
            <p className="text-lg text-gray-600">Comprehensive sports development with international exposure</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Badminton',
                path: '/events/india-badminton',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Badminton.png',
                description: 'Olympic-standard badminton training with international competition opportunities',
                available: true
              },
              {
                name: 'Athletics',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Athletics.png',
                description: 'Track and field events with international competition opportunities',
                available: false
              },
              {
                name: 'Cricket',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Cricket.png',
                description: 'Comprehensive cricket development program coming soon',
                available: false
              },
              {
                name: 'Football',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Football.png',
                description: 'FIFA-standard football training coming soon to India',
                available: false
              },
              {
                name: 'Judo',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Judo.png',
                description: 'Olympic judo training program coming soon',
                available: false
              },
              {
                name: 'Karate',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Karate.png',
                description: 'Traditional karate training coming soon to India',
                available: false
              },
              {
                name: 'Padel Tennis',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Padel+Tennis.png',
                description: 'Modern padel tennis program coming soon to India',
                available: false
              },
              {
                name: 'Silambam',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Silambam.png',
                description: 'Traditional Tamil martial art coming soon to India',
                available: false
              },
              {
                name: 'Skating',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Skating.png',
                description: 'Inline and roller skating program coming soon',
                available: false
              },
              {
                name: 'Swimming',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Swimming.png',
                description: 'Aquatic excellence program coming soon to India',
                available: false
              },
              {
                name: 'Taekwondo',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Taekwondo.png',
                description: 'Traditional taekwondo program coming soon to India',
                available: false
              },
              {
                name: 'Tennis',
                path: '/events/coming-soon-event',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Tennis.png',
                description: 'Professional tennis development coming soon',
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

          {/* India Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-rovers-emerald to-orange-500 p-8 rounded-xl text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">ROVERS India Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <CounterUp value="28" suffix="+" className="text-3xl font-bold" />
                <div className="text-white/90">States Covered</div>
              </div>
              <div>
                <CounterUp value="150" suffix="+" className="text-3xl font-bold" delay={0.2} />
                <div className="text-white/90">Schools Partnered</div>
              </div>
              <div>
                <CounterUp value="25000" suffix="+" className="text-3xl font-bold" delay={0.4} />
                <div className="text-white/90">Students Reached</div>
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

      {/* Sports Categories in India */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sports Categories in India</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive sports programs across multiple disciplines
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
              <CounterUp value="5000" suffix="+" className="text-3xl font-bold" />
              <div className="text-emerald-100">Students Evaluated</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-emerald-300"></div>
            <div className="text-white">
              <CounterUp value="85" suffix="+" className="text-3xl font-bold" delay={0.2} />
              <div className="text-emerald-100">International Winners</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-emerald-300"></div>
            <div className="text-white">
              <CounterUp value="4" suffix="+" className="text-3xl font-bold" delay={0.4} />
              <div className="text-emerald-100">Years Operating</div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join ROVERS India?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take the next step in your sports journey with comprehensive support and international opportunities
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
              to="/events/india-badminton"
              className="bg-rovers-emerald hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center group shadow-xl hover:shadow-2xl"
            >
              View Upcoming India Events
              <Calendar className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/partners#partnership-form"
              className="border-2 border-rovers-emerald text-rovers-emerald hover:bg-rovers-emerald hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center"
            >
              Partner with Rovers India
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};