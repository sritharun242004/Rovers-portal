import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const sports = [
  {
    name: 'Swimming',
    path: '/sports/swimming',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/Swimming.jpg',
    description: 'Olympic-standard aquatic training and technique development'
  },
  {
    name: 'Martial Arts',
    path: '/sports/karate',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/karate+2.jpg',
    description: 'Traditional and modern martial arts with international competition focus'
  },
  {
    name: 'Racket Games',
    path: '/sports/badminton',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/batminton.jpg',
    description: 'Precision sports including badminton and tennis with world-class coaching'
  },
  {
    name: 'Cricket',
    path: '/sports/cricket',
    image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Comprehensive cricket training across all formats and skill levels'
  },
  {
    name: 'Football',
    path: '/sports/football',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/football+1.jpg',
    description: 'FIFA-standard football training with international exposure opportunities'
  },
  {
    name: 'Athletics',
    path: '/sports/athletics',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/portal/WhatsApp+Image+2025-11-18+at+22.57.36.jpeg',
    description: 'Track and field excellence with Olympic preparation standards'
  },
];

export const FeaturedSports: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Sports Programs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive sports programs designed to take student athletes 
            from local competitions to international championships.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sports.map((sport, index) => (
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
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{sport.name}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{sport.description}</p>
                    <div className="flex items-center text-blue-600 font-semibold group">
                      <span>Learn More</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/sports"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 group"
          >
            View All Sports Programs
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};