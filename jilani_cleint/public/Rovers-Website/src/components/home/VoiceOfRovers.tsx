import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

const videoTestimonials = [
  {
    id: 1,
    name: 'Parent Testimonial',
    role: 'Dubai Sports Council Recognition',
    location: 'Dubai, UAE',
    videoUrl: 'https://www.instagram.com/reel/DJhiCcXNpD3/?uutm_source=ig_web_copy_link&igshMzRlODBiNWFlZA==',
    embedUrl: 'https://www.instagram.com/reel/DJhiCcXNpD3/embed',
    videoType: 'instagram',
    thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    quote: '"We are so happy to share our experience with the Rovers International meet! The entire trip was seamlessly organized, but the most incredible part was Rovers making it possible for our children to enter the Dubai Sports Council and be recognized and awarded by them."',
    fullTestimonial: '"We are so happy to share our experience with the Rovers International meet! The entire trip was seamlessly organized, but the most incredible part was Rovers making it possible for our children to enter the Dubai Sports Council and be recognized and awarded by them. This was an unforgettable, \'dream come true\' moment for everyone.\n\nThank you to the dedicated team and coaches, particularly Jeelani Sir for his patience with all our questions, and Sana Ma\'am. We wholeheartedly support Rovers and wish them many more successes!"',
    achievement: 'Dubai Sports Council Recognition',
    sport: 'International Meet',
    category: 'Parent Testimonial'
  },
  {
    id: 2,
    name: 'Annual Bicycle Program',
    role: 'Building Bonds Beyond Borders',
    location: 'International Program',
    videoUrl: 'https://www.instagram.com/reel/DGmyaBFtFfQ/',
    embedUrl: 'https://www.instagram.com/reel/DGmyaBFtFfQ/embed',
    videoType: 'instagram',
    thumbnail: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400',
    quote: '"A transformative experience that blended sport, resilience, and global connection."',
    fullTestimonial: '"The Rovers Annual Bicycle Program marked a new chapter in our journey - one that blended sport, resilience, and global connection. Participants described it as a transformative experience, not just for their bodies but for their hearts.\n\nDespite challenges like travel and immigration barriers, the Rovers team ensured every family felt supported and included. From logistics to emotional encouragement, the academy\'s care extended far beyond the training ground.\n\nThis program became a symbol of what Rovers Sports Academy truly stands for - unity, growth, and international friendship through sport. It wasn\'t just a ride; it was a movement of hope and shared achievement that strengthened the entire Rovers community."',
    achievement: 'International Cycling Event',
    sport: 'Cycling',
    category: 'Event Testimonial'
  },
  {
    id: 3,
    name: 'Karate Champions',
    role: 'Young Athletes Share Their Journey',
    location: 'Rovers Sports Academy',
    videoUrl: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/testimonials/Karate+Testimonial+(1).mp4#t=0.12',
    videoType: 'direct',
    thumbnail: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/testimonials/Karate+Testimonial+(1).mp4#t=0.12',
    quote: '"In an inspiring showcase of determination and skill, our karate students share their heartfelt stories."',
    fullTestimonial: '"In an inspiring showcase of determination and skill, participants at the Rovers Sports Academy karate competition shared their heartfelt stories, illuminating the profound impact karate has had on their lives. From Orange Chan\'s aspiration to protect his family, to Nyor Ariana Rauda\'s journey towards self-confidence and resilience against bullying, each testimony is a testament to the transformative power of martial arts.\n\nLarishi Gheshan and Pamina Sri expressed pure joy and pride in displaying their talents, underscoring the emotional and psychological benefits derived from engaging in karate."',
    achievement: 'Student Testimonials',
    sport: 'Karate',
    category: 'Student Success'
  },
  {
    id: 4,
    name: 'International Karate Kata',
    role: 'Competition Success Story',
    location: 'MPIP Hall',
    videoUrl: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/testimonials/Karate+Testimonial+2+(1).mp4#t=0.12',
    videoType: 'direct',
    thumbnail: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/testimonials/Karate+Testimonial+2+(1).mp4#t=0.12',
    quote: '"Our young athletes made history at the Rovers International Karate Kata Competition."',
    fullTestimonial: '"Our young athletes made history at the Rovers International Karate Kata Competition held at MPIP Hall - the first international stage for our academy. Their dedication, discipline, and spirit of perseverance shone through every performance.\n\nGuided by our experienced coaches, the students showcased not only exceptional karate skills but also mental strength and teamwork. Their victory stands as a proud reflection of Rovers Sports Academy\'s commitment to holistic training - building champions on and off the mat."',
    achievement: 'International Champions',
    sport: 'Karate Kata',
    category: 'Competition Victory'
  }
];

export const VoiceOfRovers: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % videoTestimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % videoTestimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + videoTestimonials.length) % videoTestimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
    setIsAutoPlaying(false);
  };

  const handleVideoPlay = () => {
    setIsAutoPlaying(false);
  };

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
            Voice of Rovers
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
            Hear heartfelt stories from our families, students, and champions - real experiences of transformation, growth, and international success
          </p>
        </motion.div>

        {/* Video Testimonials Carousel */}
        <div className="relative">
          {/* Main Carousel Display */}
          <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-0"
              >
                {/* Testimonial Content - Left Side */}
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-rovers-emerald/5 to-blue-50">
                  <div className="mb-6">
                    <blockquote className="text-base sm:text-lg md:text-xl font-medium text-gray-700 leading-relaxed mb-6 italic">
                      {videoTestimonials[currentTestimonial].quote}
                    </blockquote>
                    
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                      {videoTestimonials[currentTestimonial].fullTestimonial}
                    </p>
                  </div>

                  {/* Achievement Badge */}
                  <div className="inline-flex items-center space-x-3 bg-rovers-emerald/10 text-rovers-emerald px-6 py-3 rounded-full mb-6">
                    <Trophy className="w-6 h-6" />
                    <span className="text-lg font-semibold">
                      {videoTestimonials[currentTestimonial].achievement}
                    </span>
                  </div>

                  {/* Sport & Category Info */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-rovers-emerald rounded-full"></div>
                      <span>{videoTestimonials[currentTestimonial].sport}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{videoTestimonials[currentTestimonial].category}</span>
                    </div>
                  </div>
                </div>

                {/* Video Container - Right Side */}
                <div className={`relative w-full bg-gray-900 overflow-hidden ${
                  videoTestimonials[currentTestimonial].videoType === 'instagram' 
                    ? 'h-[600px] md:h-[700px]' 
                    : 'h-[500px]'
                }`}>
                  {videoTestimonials[currentTestimonial].videoType === 'instagram' ? (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <div className="instagram-embed-container">
                        <iframe
                          key={currentTestimonial}
                          src={videoTestimonials[currentTestimonial].embedUrl}
                          className="instagram-embed-fix w-full h-full"
                          style={{ 
                            border: 'none', 
                            overflow: 'hidden', 
                            minHeight: '600px',
                            maxWidth: '100%'
                          }}
                          scrolling="no"
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        />
                      </div>
                    </div>
                  ) : (
                    <video
                      key={currentTestimonial}
                      controls
                      onPlay={handleVideoPlay}
                      preload="metadata"
                      className="w-full h-full object-cover"
                      poster={videoTestimonials[currentTestimonial].thumbnail}
                    >
                      <source src={videoTestimonials[currentTestimonial].videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows - Fixed Visibility */}
            {videoTestimonials.length > 1 && (
              <>
                <button
                  onClick={prevTestimonial}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-rovers-emerald p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-20 border border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-rovers-emerald p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-20 border border-gray-200"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          {/* Carousel Indicators */}
          {videoTestimonials.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {videoTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-rovers-emerald scale-125'
                      : 'bg-gray-300 hover:bg-rovers-emerald/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Success Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          {[
            { value: '1000+', label: 'Happy Families', color: 'text-rovers-emerald' },
            { value: '98%', label: 'Parent Satisfaction', color: 'text-blue-500' },
            { value: '132+', label: 'International Winners', color: 'text-purple-500' },
            { value: '6+', label: 'Countries Reached', color: 'text-orange-500' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className={`text-2xl sm:text-3xl md:text-4xl font-black mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-gray-700 text-sm sm:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
