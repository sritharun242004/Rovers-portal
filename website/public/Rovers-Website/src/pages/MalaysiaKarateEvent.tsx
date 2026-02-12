import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  Clock,
  Star,
  ChevronRight,
  Zap,
  Bell,
  Target,
  Shield,
  Award
} from 'lucide-react';
import { LazyImage } from '../components/common/LazyImage';

export const MalaysiaKarateEvent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-rovers-emerald transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Malaysia
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-rovers-emerald to-blue-600">
        <div className="absolute inset-0 bg-gradient-to-r from-rovers-emerald/90 to-blue-600/90"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Trophy className="w-8 h-8 text-white" />
                <span className="text-white font-semibold text-lg">KARATE CHAMPIONSHIP</span>
              </div>
              
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Malaysia Karate
                <br />
                <span className="text-yellow-300">Championship 2025</span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Join the most prestigious karate tournament in Malaysia! Experience traditional martial arts excellence 
                with international standards and compete alongside the best young karatekas in the region.
              </p>

              <div className="flex flex-col space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-yellow-300" />
                  <span className="text-white font-medium">January 28, 2025</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-yellow-300" />
                  <span className="text-white font-medium">10:00 AM - 3:00 PM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-yellow-300" />
                  <span className="text-white font-medium">Johor Bahru, Malaysia (Venue TBA)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-yellow-300" />
                  <span className="text-white font-medium">Ages 7-17 • All Skill Levels Welcome</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
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
                  Get More Info
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <LazyImage
                  src="https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/Karate.png"
                  alt="Malaysia Karate Championship"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg z-20">
                LIVE EVENT
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-6">Event Highlights</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the power, precision, and spirit of traditional karate in Malaysia's premier youth championship.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Traditional Forms (Kata)',
                description: 'Demonstrate technical precision and artistic expression through traditional karate forms.',
                color: 'text-red-500'
              },
              {
                icon: Zap,
                title: 'Sparring Competition (Kumite)',
                description: 'Controlled contact sparring showcasing speed, timing, and tactical excellence.',
                color: 'text-blue-500'
              },
              {
                icon: Shield,
                title: 'Breaking Techniques',
                description: 'Display power and focus through board breaking demonstrations.',
                color: 'text-green-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-6`} />
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-6">Competition Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Multiple age divisions and skill levels ensure fair competition for all participants.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { age: '7-9 Years', level: 'Beginner & Intermediate', color: 'bg-yellow-100 text-yellow-800' },
              { age: '10-12 Years', level: 'All Levels', color: 'bg-blue-100 text-blue-800' },
              { age: '13-15 Years', level: 'Intermediate & Advanced', color: 'bg-green-100 text-green-800' },
              { age: '16-17 Years', level: 'Advanced', color: 'bg-red-100 text-red-800' }
            ].map((category, index) => (
              <motion.div
                key={category.age}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center hover:border-rovers-emerald transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.age}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${category.color}`}>
                  {category.level}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes and Recognition */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-6">Prizes & Recognition</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Champions will receive prestigious awards and recognition for their martial arts excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: 'Championship Trophies',
                description: 'Gold, Silver, and Bronze trophies for top 3 finishers in each category.',
                color: 'text-yellow-400'
              },
              {
                icon: Award,
                title: 'Certificates',
                description: 'Official participation certificates for all competitors.',
                color: 'text-blue-400'
              },
              {
                icon: Star,
                title: 'Special Recognition',
                description: 'Awards for Best Technique, Spirit, and Sportsmanship.',
                color: 'text-green-400'
              }
            ].map((prize, index) => (
              <motion.div
                key={prize.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <prize.icon className={`w-16 h-16 ${prize.color} mx-auto mb-6`} />
                <h3 className="text-xl font-bold text-white mb-4">{prize.title}</h3>
                <p className="text-gray-300 leading-relaxed">{prize.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-rovers-emerald">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-white mb-6"
          >
            Ready to Showcase Your Karate Skills?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-white/90 mb-8 leading-relaxed"
          >
            Join us for an unforgettable karate championship experience in Malaysia. 
            Register now and be part of martial arts history!
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
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center group shadow-2xl"
            >
              Register for Championship
              <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-rovers-emerald px-12 py-4 rounded-full font-bold text-lg transition-all duration-300"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
