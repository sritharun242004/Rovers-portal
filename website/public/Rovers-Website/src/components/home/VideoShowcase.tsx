import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const videoData = [
  {
    id: '6BDaTuwhu0s',
    title: 'ROVERS Championship Highlights',
    description: 'Watch our athletes compete at the highest level in international championships'
  },
  {
    id: 'F_AjvbLTGMk',
    title: 'Student Athletes in Competition',
    description: 'See our student athletes showcase their skills and determination'
  },
  {
    id: '-n8pB3degXw',
    title: 'International Sports Meet',
    description: 'Experience the excitement of our international sports events'
  }
];

export const VideoShowcase: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 px-4">
            Rovers in Action
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
            Watch highlights from our international championships and student athlete success stories
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {videoData.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer h-full"
            >
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100 h-full flex flex-col">
                {/* Video Container */}
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&showinfo=0&enablejsapi=1`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    frameBorder="0"
                    loading="lazy"
                  />
                </div>

                {/* Video Info */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-rovers-emerald transition-colors duration-300">
                    {video.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">
                    {video.description}
                  </p>
                  
                  {/* ROVERS Branding */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-rovers-emerald rounded-full"></div>
                      <span className="text-xs font-semibold text-rovers-emerald uppercase tracking-wide">
                        Rovers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
