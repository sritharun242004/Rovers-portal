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
  Bell
} from 'lucide-react';

export const ComingSoonEvent: React.FC = () => {
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
                Back
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
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Coming Soon
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Exciting Sports Program
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                We're working hard to bring you this amazing sports program. Stay tuned for exciting updates and be the first to know when registrations open!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white font-semibold">Date</div>
                  <div className="text-white/80 text-sm">Yet to announce</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <MapPin className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white font-semibold">Venue</div>
                  <div className="text-white/80 text-sm">Yet to announce</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-white font-semibold">Time</div>
                  <div className="text-white/80 text-sm">Yet to announce</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center">
                  <Clock className="w-20 h-20 text-white mx-auto mb-6 opacity-80" />
                  <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
                  <p className="text-white/90 mb-6">
                    Be the first to know when this exciting program launches. Follow us for the latest updates!
                  </p>
                  <a
                    href="https://rovers.life/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-rovers-emerald px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors inline-flex items-center"
                  >
                    Visit Rovers Life
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What to Expect</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              When this program launches, you can expect the same world-class ROVERS standard of excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: 'International Competition',
                description: 'Opportunity to compete at international level with full sponsorship support',
                color: 'bg-yellow-500'
              },
              {
                icon: Zap,
                title: 'Professional Training',
                description: 'World-class coaching and state-of-the-art training facilities',
                color: 'bg-blue-500'
              },
              {
                icon: Users,
                title: 'Complete Support',
                description: 'Full coverage including travel, accommodation, meals, and equipment',
                color: 'bg-green-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Highlights</h2>
            <p className="text-lg text-gray-600">Experience the ROVERS difference in sports excellence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: 'Expert Coaching',
                description: 'Learn from internationally certified coaches'
              },
              {
                icon: Trophy,
                title: 'Competition Ready',
                description: 'Prepare for national and international competitions'
              },
              {
                icon: Bell,
                title: 'Age-Appropriate',
                description: 'Programs designed for different age groups'
              },
              {
                icon: Zap,
                title: 'Skill Development',
                description: 'Focus on technical and tactical improvement'
              }
            ].map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-rovers-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <highlight.icon className="w-8 h-8 text-rovers-emerald" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{highlight.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-rovers-emerald">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Stay Connected</h2>
            <p className="text-xl text-emerald-100 mb-8">
              Don't miss out on this exciting opportunity! Follow ROVERS Life for the latest updates and be the first to register when this program opens.
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
              className="bg-white text-rovers-emerald px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center group hover:bg-gray-100 shadow-xl"
            >
              Visit Rovers Life
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-rovers-emerald px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center"
            >
              Contact Us for Updates
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
