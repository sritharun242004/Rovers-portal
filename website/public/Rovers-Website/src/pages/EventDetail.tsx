import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Trophy, Target, Star, ArrowRight, ExternalLink, Globe, ArrowLeft } from 'lucide-react';
import { LazyImage } from '../components/common/LazyImage';

const eventsData: { [key: string]: any } = {
  'india-badminton': {
    id: 'india-badminton',
    title: 'World Record Attempt - India',
    featuredSport: 'Badminton',
    date: 'September 28, 2025',
    time: '9:00 AM - 6:00 PM IST',
    venue: 'Tamil Nadu Physical Education and Sports University',
    location: 'Chennai, Tamil Nadu, India',
    country: 'India',
    flag: '🇮🇳',
    bannerImage: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/batminton.jpg',
    description: 'Join the premier badminton championship for kids in India, featuring world-class badminton competitions designed to showcase young talent.',
    sportsIncluded: [
      {
        name: 'Badminton',
        schedule: '9:00 AM - 12:00 PM',
        ageGroups: ['Under-10', 'Under-12', 'Under-15', 'Under-18'],
        description: 'Singles and doubles competitions across all age categories'
      }
    ],
    highlights: [
      'International coaching staff',
      'Live streaming of events',
      'Awards ceremony with medals',
      'Professional badminton courts',
      'Expert coaching clinics'
    ],
    registrationUrl: 'https://rovers.life/parent',
    mapLink: 'https://maps.google.com/?q=Tamil+Nadu+Physical+Education+and+Sports+University+Chennai'
  },
  'malaysia-silambam': {
    id: 'malaysia-silambam',
    title: 'World Record Attempt - Malaysia',
    featuredSport: 'Silambam',
    date: 'September 6, 2025',
    time: '8:00 AM - 7:00 PM MYT',
    venue: 'Educity Sports Complex',
    location: 'Iskandar Puteri, Johor, Malaysia',
    country: 'Malaysia',
    flag: '🇲🇾',
    bannerImage: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/Silambam.jpg',
    description: 'Experience the premier Silambam championship for kids in Malaysia, showcasing traditional Tamil martial arts with authentic techniques and cultural heritage.',
    sportsIncluded: [
      {
        name: 'Silambam',
        schedule: '8:00 AM - 11:00 AM',
        ageGroups: ['Under-10', 'Under-14', 'Under-18'],
        description: 'Traditional Tamil martial art with bamboo sticks'
      }
    ],
    highlights: [
      'Traditional Silambam masters from Tamil Nadu',
      'Traditional Malaysian cuisine',
      'Cultural heritage demonstrations',
      'Heritage sports demonstration',
      'Authentic martial arts training'
    ],
    registrationUrl: 'https://rovers.life/parent',
    mapLink: 'https://maps.google.com/?q=Educity+Iskandar+Puteri+Johor+Malaysia'
  },
  'uae-multisport': {
    id: 'uae-multisport',
    title: 'World Record Attempt - UAE',
    featuredSport: 'Multi-Sport',
    date: 'September 6, 2025',
    time: '7:00 AM - 8:00 PM GST',
    venue: 'Dubai Sports City',
    location: 'Dubai, United Arab Emirates',
    country: 'UAE',
    flag: '🇦🇪',
    bannerImage: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/athletics.jpg',
    description: 'Historic moment spanning UAE and India, featuring 9 sports for kids aged 7-17. Guinness World Record attempt with participation certificates and official World Record Certificate.',
    recordAttempt: {
      title: 'International Guinness World Record Attempt',
      description: 'Attempting to set the record for the largest simultaneous multisport championship across two countries',
      guinnessLink: 'https://www.guinnessworldrecords.com/',
      uniquePoints: [
        'First-ever dual-country sports record attempt',
        'Live satellite connection with India venue',
        'Official World Record Certificate',
        'International sports federation endorsement'
      ]
    },
    sportsIncluded: [
      {
        name: 'Swimming',
        schedule: '7:00 AM - 10:00 AM',
        ageGroups: ['7-9', '10-12', '13-15', '16-17'],
        description: 'Olympic-standard pool competitions'
      },
      {
        name: 'Athletics',
        schedule: '8:00 AM - 12:00 PM',
        ageGroups: ['7-9', '10-12', '13-15', '16-17'],
        description: 'Track and field events'
      },
      {
        name: 'Badminton',
        schedule: '9:00 AM - 2:00 PM',
        ageGroups: ['8-10', '11-13', '14-17'],
        description: 'International standard courts'
      },
      {
        name: 'Tennis',
        schedule: '10:00 AM - 3:00 PM',
        ageGroups: ['8-10', '11-13', '14-17'],
        description: 'Hard court competitions'
      },
      {
        name: 'Football',
        schedule: '3:00 PM - 6:00 PM',
        ageGroups: ['7-9', '10-12', '13-15', '16-17'],
        description: '7-a-side tournaments'
      },
      {
        name: 'Basketball',
        schedule: '11:00 AM - 4:00 PM',
        ageGroups: ['10-12', '13-15', '16-17'],
        description: '3x3 and 5x5 formats'
      },
      {
        name: 'Karate',
        schedule: '1:00 PM - 5:00 PM',
        ageGroups: ['7-9', '10-12', '13-17'],
        description: 'Kata and kumite divisions'
      },
      {
        name: 'Taekwondo',
        schedule: '2:00 PM - 6:00 PM',
        ageGroups: ['8-10', '11-13', '14-17'],
        description: 'Olympic-style competitions'
      },
      {
        name: 'Chess',
        schedule: '12:00 PM - 8:00 PM',
        ageGroups: ['7-9', '10-12', '13-15', '16-17'],
        description: 'Rapid and blitz tournaments'
      }
    ],
    highlights: [
      'Dual-country live broadcast',
      'International media coverage',
      'VIP spectator areas',
      'Cultural exchange programs',
      'Professional sports photography',
      'Awards ceremony with international dignitaries'
    ],
    registrationUrl: 'https://rovers.life/parent',
    mapLink: 'https://maps.google.com/?q=Dubai+Sports+City+UAE',
    status: 'coming-soon'
  }
};

export const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const eventData = eventId ? eventsData[eventId] : null;

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <Link to="/sports" className="text-blue-600 hover:text-blue-700">
            Return to Sports Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/sports"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Sports Programs
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative h-screen bg-gray-900">
        <LazyImage
          src={eventData.bannerImage}
          alt={eventData.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center mb-4">
                <span className="text-6xl mr-4">{eventData.flag}</span>
                <div className="bg-orange-500 px-6 py-3 rounded-full text-white font-bold text-xl">
                  {eventData.date}
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
              style={{ textShadow: '4px 4px 8px rgba(0, 0, 0, 0.8)' }}
            >
              {eventData.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <p className="text-orange-400 font-bold text-xl md:text-2xl mb-2">
                Featured Sport: {eventData.featuredSport}
              </p>
              <p className="text-lg md:text-xl font-semibold mb-4">{eventData.venue}</p>
              <p className="text-base md:text-lg">{eventData.location}</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              {eventData.description}
            </motion.p>

            {eventData.status === 'coming-soon' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mb-6"
              >
                <span className="bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-bold">
                  Coming Soon
                </span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href={eventData.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center group touch-manipulation"
              >
                Register Now
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={eventData.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center touch-manipulation"
              >
                View Location
                <MapPin className="ml-2 w-6 h-6" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section for UAE */}
      {eventData.status === 'coming-soon' && (
        <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-8xl mb-8">🚀</div>
              <h2 className="text-5xl font-black mb-6">Coming Soon!</h2>
              <p className="text-2xl mb-8 leading-relaxed">
                Stay tuned for more exciting details about this historic multi-sport championship. 
                We're preparing something amazing for young athletes across UAE and India!
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
                <h3 className="text-3xl font-bold mb-4">What to Expect:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                  <div className="flex items-center justify-center">
                    <Trophy className="w-6 h-6 mr-3" />
                    <span>9 Different Sports</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Users className="w-6 h-6 mr-3" />
                    <span>Ages 7-17 Welcome</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Globe className="w-6 h-6 mr-3" />
                    <span>Dual-Country Event</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Star className="w-6 h-6 mr-3" />
                    <span>World Record Attempt</span>
                  </div>
                </div>
              </div>
              <p className="text-xl mb-8">
                Visit our registration page to stay updated and be the first to know when registration opens!
              </p>
              <a
                href="https://rovers.life/parent"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-orange-600 hover:bg-gray-100 px-12 py-6 rounded-full font-bold text-xl transition-all duration-300 inline-flex items-center group shadow-2xl"
              >
                Visit Registration Page
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {/* Event Details */}
      {eventData.status !== 'coming-soon' && (
        <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Event Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Event Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Date</p>
                      <p className="text-gray-600">{eventData.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Time</p>
                      <p className="text-gray-600">{eventData.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Venue</p>
                      <p className="text-gray-600">{eventData.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Location</p>
                      <p className="text-gray-600">{eventData.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* World Record Attempt */}
              {eventData.recordAttempt && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="mb-12 bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl"
                >
                  <div className="flex items-center mb-4">
                    <Trophy className="w-8 h-8 text-orange-500 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">{eventData.recordAttempt.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">{eventData.recordAttempt.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {eventData.recordAttempt.uniquePoints.map((point: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={eventData.recordAttempt.guinnessLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    Learn about Guinness World Records
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </motion.div>
              )}

              {/* Sports Schedule */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Sports & Schedule</h3>
                <div className="space-y-6">
                  {eventData.sportsIncluded.map((sport: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-xl">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <h4 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">{sport.name}</h4>
                        <span className="text-orange-600 font-semibold">{sport.schedule}</span>
                      </div>
                      <p className="text-gray-600 mb-3">{sport.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {sport.ageGroups.map((age: string, idx: number) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {age}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-2xl mb-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Event Highlights</h3>
                <div className="space-y-3">
                  {eventData.highlights.map((highlight: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Registration CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-orange-500 to-red-500 p-8 rounded-2xl text-white text-center"
              >
                <Trophy className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Ready to Make History?</h3>
                <p className="mb-6 leading-relaxed">
                  Join thousands of young athletes in this record-breaking event. Register now to secure your spot!
                </p>
                <a
                  href={eventData.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white text-orange-600 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-300 touch-manipulation"
                >
                  Register Now
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};