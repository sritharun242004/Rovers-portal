import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Trophy } from 'lucide-react';

const dubaiFinalsImages = [
  {
    image: 'https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Opening Ceremony',
    description: 'Grand opening of ROVERS Finals in Dubai with 200+ student athletes'
  },
  {
    image: 'https://images.pexels.com/photos/8007401/pexels-photo-8007401.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Badminton Championships',
    description: 'Intense badminton matches featuring top student athletes from across the region'
  },
  {
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Swimming Competitions',
    description: 'World-class swimming events in Dubai\'s premier aquatic facilities'
  },
  {
    image: 'https://images.pexels.com/photos/4164757/pexels-photo-4164757.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Martial Arts Finals',
    description: 'Traditional and modern martial arts competitions showcasing cultural diversity'
  },
  {
    image: 'https://images.pexels.com/photos/2202685/pexels-photo-2202685.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Victory Ceremony',
    description: 'Celebrating champions and recognizing excellence in international competition'
  },
];

export const FinalsShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % dubaiFinalsImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + dubaiFinalsImages.length) % dubaiFinalsImages.length);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-white mb-6">FINALS @ DUBAI</h2>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Experience the pinnacle of student athlete competition at our prestigious 
            Dubai Finals, where dreams become reality on the international stage.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mt-8 text-white">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>Dubai Sports City</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Annual Championship</span>
            </div>
            <div className="flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              <span>200+ Athletes</span>
            </div>
          </div>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="relative h-96 md:h-[500px]"
              >
                <img
                  src={dubaiFinalsImages[currentIndex].image}
                  alt={dubaiFinalsImages[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-3xl font-bold mb-2">{dubaiFinalsImages[currentIndex].title}</h3>
                  <p className="text-lg opacity-90">{dubaiFinalsImages[currentIndex].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-opacity-30 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-opacity-30 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {dubaiFinalsImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://rovers.life/register"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 inline-flex items-center group"
          >
            Qualify for Dubai Finals
            <Trophy className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};