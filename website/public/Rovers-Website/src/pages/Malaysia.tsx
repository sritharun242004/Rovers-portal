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
  ChevronRight,
  Building,
  Bell,
  Clock
} from 'lucide-react';

// Information cards data
const informationCards = [
  {
    title: 'Strategic Location',
    content: 'Positioned at the heart of Southeast Asia with excellent connectivity to global markets',
    stats: 'Regional sports hub',
    icon: Globe
  },
  {
    title: 'Cultural Diversity', 
    content: 'Multi-cultural sporting environment reflecting Malaysia\'s diverse heritage and traditions',
    stats: 'Unity through sports',
    icon: Users
  },
  {
    title: 'Modern Infrastructure',
    content: 'State-of-the-art sports facilities in Kuala Lumpur and across major Malaysian cities',
    stats: 'World-class venues',
    icon: Building
  },
  {
    title: 'Youth Development',
    content: 'Comprehensive programs focusing on developing young Malaysian sporting talent',
    stats: 'Future champions program',
    icon: Trophy
  }
];

// Sports categories list
const sportsCategories = [
  'Badminton (National Sport Excellence)',
  'Swimming (Aquatic Sports Development)',
  'Athletics (Track & Field Programs)',
  'Football (FIFA Development)',
  'Basketball (Regional Competitions)',
  'Tennis (Court Sports Programs)',
  'Squash (Commonwealth Sport)',
  'Cycling (Road & Track Events)',
  'Table Tennis (Indoor Sports)',
  'Martial Arts (Traditional & Modern)',
  'Hockey (Field Hockey Development)',
  'Volleyball (Beach & Indoor)'
];

export const Malaysia: React.FC = () => {
  const scrollToRegistration = () => {
    const registrationSection = document.getElementById('registration-cta');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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
              <span className="text-rovers-emerald font-medium">Malaysia</span>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">ROVERS Malaysia Operations</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0015.jpg')`
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
            Malaysia Sports Development Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white max-w-4xl mx-auto leading-relaxed"
            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
          >
            Truly Asia's sporting gateway • Cultural diversity meets athletic excellence
          </motion.p>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Sports Events in Malaysia</h2>
            <p className="text-xl text-gray-600 mb-6">Join us for an exciting lineup of sports championships across Malaysia</p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-rovers-emerald text-white px-6 py-3 rounded-full font-semibold shadow-lg">
                <Calendar className="inline-block w-5 h-5 mr-2" />
                November 26 - December 14, 2025
              </div>
              <div className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
                <Clock className="inline-block w-5 h-5 mr-2" />
                9:00 AM - 4:00 PM Daily
              </div>
            </div>
          </motion.div>

          {/* Johor Bahru Events */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-rovers-emerald to-emerald-600 p-6 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <MapPin className="w-6 h-6 mr-2" />
                    Johor Bahru Championships
                  </h3>
                  <p className="text-emerald-100 text-lg">EduCity Sports Complex</p>
                  <p className="text-emerald-100 text-sm">Persiaran Kampus, Educity, 81550 Iskandar Puteri, Johor Darul Ta'zim, Malaysia</p>
                </div>
                <a 
                  href="https://maps.app.goo.gl/Nmjw1L9Z505xfTkKf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-rovers-emerald px-4 py-2 rounded-full font-semibold hover:bg-emerald-50 transition-colors flex items-center"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  View Map
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-b-2xl shadow-lg">
              {[
                {
                  name: 'Skating',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Skating.png',
                  subcategory: 'Quad & Inline',
                  ages: 'Under 7, 9, 12, 15, 17'
              },
              {
                name: 'Badminton',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Badminton.png',
                  subcategory: 'Singles & Doubles',
                  ages: 'Under 9, 12, 15, 17'
                },
                {
                  name: 'Taekwondo',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Taekwondo.png',
                  subcategory: 'Poomsae',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Karate',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Karate.png',
                  subcategory: 'Kata',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Silambam',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Silambam.png',
                  subcategory: 'Thanithiramai',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Athletics',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Athletics.png',
                  subcategory: 'Running',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Football',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Football.png',
                  subcategory: '7v7',
                  ages: 'Under 9, 12, 15, 17'
              },
              {
                name: 'Cricket',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Cricket.png',
                  subcategory: '7v7',
                  ages: 'Under 9, 12, 15'
                }
              ].map((sport, index) => (
                <motion.div
                  key={sport.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  onClick={scrollToRegistration}
                  className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-200 hover:border-rovers-emerald hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-32 mb-3 overflow-hidden rounded-lg">
                    <img
                      src={sport.image}
                      alt={sport.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{sport.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-rovers-emerald font-semibold">{sport.subcategory}</p>
                    <p className="text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {sport.ages}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Kuala Lumpur Events */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <MapPin className="w-6 h-6 mr-2" />
                    Kuala Lumpur Championships
                  </h3>
                  <p className="text-blue-100 text-lg">Venue: TBA Soon</p>
                  <p className="text-blue-100 text-sm">Location details will be announced shortly</p>
                </div>
                <div className="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold">
                  Venue TBA
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-b-2xl shadow-lg">
              {[
                {
                  name: 'Skating',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Skating.png',
                  subcategory: 'Quad & Inline',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Badminton',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Badminton.png',
                  subcategory: 'Singles & Doubles',
                  ages: 'Under 9, 12, 15, 17'
                },
                {
                  name: 'Taekwondo',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Taekwondo.png',
                  subcategory: 'Poomsae',
                  ages: 'Under 7, 9, 12, 15, 17'
              },
              {
                name: 'Karate',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Karate.png',
                  subcategory: 'Kata',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Silambam',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Silambam.png',
                  subcategory: 'Thanithiramai',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Athletics',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Athletics.png',
                  subcategory: 'Running',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Football',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Football.png',
                  subcategory: '7v7',
                  ages: 'Under 9, 12, 15, 17'
                },
                {
                  name: 'Cricket',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Cricket.png',
                  subcategory: '7v7',
                  ages: 'Under 9, 12, 15'
                }
              ].map((sport, index) => (
                <motion.div
                  key={sport.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  onClick={scrollToRegistration}
                  className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-32 mb-3 overflow-hidden rounded-lg">
                    <img
                      src={sport.image}
                      alt={sport.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{sport.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-blue-600 font-semibold">{sport.subcategory}</p>
                    <p className="text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {sport.ages}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Penang Events */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <MapPin className="w-6 h-6 mr-2" />
                    Penang Championships
                  </h3>
                  <p className="text-purple-100 text-lg">Venue: TBA Soon</p>
                  <p className="text-purple-100 text-sm">Location details will be announced shortly</p>
                </div>
                <div className="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold">
                  Venue TBA
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-b-2xl shadow-lg">
              {[
              {
                name: 'Skating',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Skating.png',
                  subcategory: 'Quad & Inline',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Badminton',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Badminton.png',
                  subcategory: 'Singles & Doubles',
                  ages: 'Under 9, 12, 15, 17'
              },
              {
                name: 'Taekwondo',
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Taekwondo.png',
                  subcategory: 'Poomsae',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Karate',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Karate.png',
                  subcategory: 'Kata',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Silambam',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Silambam.png',
                  subcategory: 'Thanithiramai',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Athletics',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Athletics.png',
                  subcategory: 'Running',
                  ages: 'Under 7, 9, 12, 15, 17'
                },
                {
                  name: 'Football',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Football.png',
                  subcategory: '7v7',
                  ages: 'Under 9, 12, 15, 17'
                },
                {
                  name: 'Cricket',
                  image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Cricket.png',
                  subcategory: '7v7',
                  ages: 'Under 9, 12, 15'
              }
            ].map((sport, index) => (
                <motion.div
                key={sport.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                  onClick={scrollToRegistration}
                  className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-200 hover:border-purple-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-32 mb-3 overflow-hidden rounded-lg">
                      <img
                        src={sport.image}
                        alt={sport.name}
                      className="w-full h-full object-cover"
                      />
                        </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{sport.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-purple-600 font-semibold">{sport.subcategory}</p>
                    <p className="text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {sport.ages}
                    </p>
                  </div>
              </motion.div>
            ))}
          </div>
          </motion.div>

          {/* Registration CTA */}
          <motion.div
            id="registration-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-rovers-emerald via-blue-600 to-purple-600 p-8 rounded-2xl text-white text-center shadow-2xl"
          >
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-3xl font-bold mb-4">Register for Championships Now!</h3>
            <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
              Don't miss out on these exciting sports championships across Malaysia. Register today and showcase your talent!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://rovers.life/register"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center group shadow-xl hover:shadow-2xl"
              >
                <Bell className="mr-2 w-5 h-5" />
                Register Now
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-rovers-emerald px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center"
              >
                Get More Information
              </Link>
            </div>
          </motion.div>

          {/* Malaysia Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-red-600 to-blue-600 p-8 rounded-xl text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">ROVERS Malaysia Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <CounterUp value="3" suffix="" className="text-3xl font-bold" />
                <div className="text-white/90">Cities Hosting Events</div>
              </div>
              <div>
                <CounterUp value="8" suffix="" className="text-3xl font-bold" />
                <div className="text-white/90">Sports Disciplines</div>
              </div>
              <div>
                <CounterUp value="24" suffix="" className="text-3xl font-bold" />
                <div className="text-white/90">Championship Events</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Regional</div>
                <div className="text-white/90">Sports Hub</div>
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

      {/* Sports Categories in Malaysia */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sports Categories in Malaysia</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive sports programs embracing both traditional and modern athletic disciplines
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
              <CounterUp value="2500" suffix="+" className="text-3xl font-bold" />
              <div className="text-emerald-100">Students Reached</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-emerald-300"></div>
            <div className="text-white">
              <div className="text-3xl font-bold">Multi-Cultural</div>
              <div className="text-emerald-100">Integration</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-emerald-300"></div>
            <div className="text-white">
              <div className="text-3xl font-bold">Regional</div>
              <div className="text-emerald-100">Sports Hub</div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join ROVERS Malaysia Championships?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience world-class sports championships across three major Malaysian cities from November 26 to December 14, 2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="https://rovers.life/register"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-rovers-emerald hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center group shadow-xl hover:shadow-2xl"
            >
              Register for Championships
              <Calendar className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/partners#partnership-form"
              className="border-2 border-rovers-emerald text-rovers-emerald hover:bg-rovers-emerald hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center"
            >
              Partner with Rovers Malaysia
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
