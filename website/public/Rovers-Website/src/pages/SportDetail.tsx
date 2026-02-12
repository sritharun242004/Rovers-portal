import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Trophy, Target, Star, ArrowRight } from 'lucide-react';
import { LazyImage } from '../components/common/LazyImage';

const sportsData: { [key: string]: any } = {
  badminton: {
    name: 'Badminton',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/batminton.jpg',
    heroImage: 'https://images.pexels.com/photos/8007401/pexels-photo-8007401.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Master the art of precision and agility in badminton with our comprehensive training program designed for international competition standards.',
    history: 'Badminton originated in India and has become one of the fastest racquet sports in the world. Our program focuses on developing lightning-fast reflexes, strategic thinking, and the precision needed to compete at international levels.',
    methodology: [
      'Technical stroke development and footwork mastery',
      'Strategic game planning and court positioning',
      'Physical conditioning for speed and endurance',
      'Mental training for competitive pressure'
    ],
    benefits: [
      'Improved hand-eye coordination and reflexes',
      'Enhanced cardiovascular fitness and agility',
      'Strategic thinking and quick decision-making',
      'Discipline and mental toughness'
    ],
    ageGroups: [
      { group: 'Junior (8-12 years)', focus: 'Basic techniques and fun introduction' },
      { group: 'Youth (13-16 years)', focus: 'Competitive skills and tournament preparation' },
      { group: 'Senior (17+ years)', focus: 'Advanced techniques and international standards' }
    ],
    gallery: [
      'https://images.pexels.com/photos/8007401/pexels-photo-8007401.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/8007426/pexels-photo-8007426.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/8007390/pexels-photo-8007390.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    successStory: {
      name: 'Akhil Kumar',
      achievement: 'National Champion 2024',
      story: 'Started with basic school badminton and through ROVERS training, competed in 6 international tournaments before winning the National Championship.'
    }
  },
  karate: {
    name: 'Karate',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/karate+2.jpg',
    heroImage: 'https://images.pexels.com/photos/4164757/pexels-photo-4164757.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Develop discipline, strength, and character through traditional karate training with modern competitive techniques.',
    history: 'Karate, meaning "empty hand," is a martial art that develops both physical prowess and mental discipline. Our program combines traditional Shotokan techniques with modern competition strategies.',
    methodology: [
      'Traditional kata forms and kumite sparring',
      'Character development and discipline training',
      'Competition preparation and tournament strategy',
      'Self-defense applications and practical techniques'
    ],
    benefits: [
      'Physical strength and flexibility development',
      'Mental discipline and focus enhancement',
      'Self-confidence and character building',
      'Self-defense skills and awareness'
    ],
    ageGroups: [
      { group: 'Little Dragons (5-8 years)', focus: 'Basic movements and discipline' },
      { group: 'Youth (9-15 years)', focus: 'Belt progression and competition prep' },
      { group: 'Adult (16+ years)', focus: 'Advanced techniques and mastery' }
    ],
    gallery: [
      'https://images.pexels.com/photos/4164757/pexels-photo-4164757.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/7045586/pexels-photo-7045586.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4164758/pexels-photo-4164758.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    successStory: {
      name: 'Meera Joshi',
      achievement: 'World Junior Championship Bronze',
      story: 'Through dedicated karate training at ROVERS, Meera developed the discipline and technique to compete internationally and win bronze at the World Junior Championships.'
    }
  },
  swimming: {
    name: 'Swimming',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/Swimming.jpg',
    heroImage: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Dive into excellence with our swimming program featuring Olympic-standard training and technique development.',
    history: 'Swimming is one of the most complete sports, developing every muscle group while building cardiovascular endurance. Our program follows international swimming federation standards.',
    methodology: [
      'Four-stroke technique mastery (freestyle, backstroke, breaststroke, butterfly)',
      'Endurance and speed training protocols',
      'Racing starts and turns optimization',
      'Mental preparation for competitive swimming'
    ],
    benefits: [
      'Full-body cardiovascular fitness',
      'Low-impact joint-friendly exercise',
      'Improved lung capacity and breathing',
      'Mental resilience and goal achievement'
    ],
    ageGroups: [
      { group: 'Learn to Swim (4-7 years)', focus: 'Water safety and basic strokes' },
      { group: 'Competitive (8-16 years)', focus: 'Technique refinement and racing' },
      { group: 'Elite (17+ years)', focus: 'Performance optimization and records' }
    ],
    gallery: [
      'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    successStory: {
      name: 'Vidya Sharma',
      achievement: 'State Record Holder',
      story: 'From learning basic strokes to breaking state records, Vidya\'s journey with ROVERS included international training camps that shaped her into a champion.'
    }
  },
  athletics: {
    name: 'Athletics',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/portal/WhatsApp+Image+2025-11-18+at+22.57.36.jpeg',
    heroImage: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/portal/WhatsApp+Image+2025-11-18+at+22.57.36.jpeg',
    description: 'Excel in track and field events with professional coaching and state-of-the-art training facilities.',
    history: 'Athletics, the foundation of all sports, encompasses running, jumping, and throwing events. Our program develops speed, strength, and endurance for international competition.',
    methodology: [
      'Event-specific technique development',
      'Strength and conditioning protocols',
      'Speed and agility training systems',
      'Competition strategy and mental preparation'
    ],
    benefits: [
      'Explosive power and speed development',
      'Improved coordination and balance',
      'Goal-setting and achievement mindset',
      'Physical and mental resilience'
    ],
    ageGroups: [
      { group: 'Youth (8-13 years)', focus: 'Multi-event development and fun' },
      { group: 'Junior (14-17 years)', focus: 'Event specialization and competition' },
      { group: 'Senior (18+ years)', focus: 'Elite performance and records' }
    ],
    gallery: [
      'https://images.pexels.com/photos/2009490/pexels-photo-2009490.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2202685/pexels-photo-2202685.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    successStory: {
      name: 'Arjun Patel',
      achievement: 'Asian Games Qualifier',
      story: 'Starting as a school track runner, Arjun\'s speed caught ROVERS\' attention. Through systematic training, he qualified for the Asian Games representing India.'
    }
  },
  football: {
    name: 'Football',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/football+1.jpg',
    heroImage: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Train with FIFA standards and develop teamwork, strategy, and technical skills for international football.',
    history: 'Football is the world\'s most popular sport, requiring technical skill, tactical awareness, and team coordination. Our program follows FIFA development guidelines.',
    methodology: [
      'Technical skills development (dribbling, passing, shooting)',
      'Tactical understanding and game intelligence',
      'Physical conditioning and injury prevention',
      'Team dynamics and leadership development'
    ],
    benefits: [
      'Teamwork and communication skills',
      'Strategic thinking and decision-making',
      'Physical fitness and coordination',
      'Leadership and social development'
    ],
    ageGroups: [
      { group: 'Grassroots (6-10 years)', focus: 'Fun and basic skills development' },
      { group: 'Youth (11-16 years)', focus: 'Technical skills and team play' },
      { group: 'Elite (17+ years)', focus: 'Professional preparation and scholarships' }
    ],
    gallery: [
      'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    successStory: {
      name: 'Karthik Reddy',
      achievement: 'Youth Academy Selection',
      story: 'Karthik\'s technical skills and game intelligence developed through ROVERS training earned him selection to a prestigious European youth academy.'
    }
  },
  cricket: {
    name: 'Cricket',
    image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=600',
    heroImage: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Master the gentleman\'s game with comprehensive cricket training covering all formats and international standards.',
    history: 'Cricket combines strategy, skill, and endurance across multiple formats. Our program develops players for T20, ODI, and Test cricket with emphasis on technique and game awareness.',
    methodology: [
      'Batting technique and shot selection',
      'Bowling mechanics and variations',
      'Fielding excellence and game awareness',
      'Mental toughness and pressure handling'
    ],
    benefits: [
      'Strategic thinking and patience',
      'Hand-eye coordination excellence',
      'Team collaboration and leadership',
      'Mental resilience under pressure'
    ],
    ageGroups: [
      { group: 'Under-12', focus: 'Basic skills and fun introduction' },
      { group: 'Under-16', focus: 'Technique development and competition' },
      { group: 'Under-19', focus: 'Advanced skills and professional preparation' }
    ],
    gallery: [
      'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1661951/pexels-photo-1661951.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    successStory: {
      name: 'Rohit Sharma',
      achievement: 'State Team Captain',
      story: 'From school cricket to leading the state team, Rohit\'s journey with ROVERS developed his leadership and technical skills for competitive cricket.'
    }
  },
  basketball: {
    name: 'Basketball',
    image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600',
    heroImage: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Develop basketball skills with NBA-standard training focusing on teamwork, athleticism, and strategic play.',
    history: 'Basketball demands athleticism, teamwork, and strategic thinking. Our program develops players using international basketball federation standards and modern training methods.',
    methodology: [
      'Fundamental skills (shooting, dribbling, passing)',
      'Team tactics and game strategy',
      'Athletic conditioning and agility',
      'Mental toughness and leadership development'
    ],
    benefits: [
      'Improved athleticism and coordination',
      'Teamwork and communication skills',
      'Strategic thinking and quick decisions',
      'Leadership and confidence building'
    ],
    ageGroups: [
      { group: 'Mini Basketball (8-12 years)', focus: 'Fun introduction and basic skills' },
      { group: 'Youth (13-16 years)', focus: 'Skill development and team play' },
      { group: 'Elite (17+ years)', focus: 'Advanced tactics and scholarship preparation' }
    ],
    gallery: [
      'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1544775/pexels-photo-1544775.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1752776/pexels-photo-1752776.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    successStory: {
      name: 'Aisha Patel',
      achievement: 'National Youth Team',
      story: 'Aisha\'s basketball journey with ROVERS led to selection for the national youth team and a scholarship to a prestigious sports university.'
    }
  },
  chess: {
    name: 'Chess',
    image: 'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=600',
    heroImage: 'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Develop strategic thinking and mental acuity through competitive chess training and international tournament preparation.',
    history: 'Chess is the ultimate mind sport, developing strategic thinking, pattern recognition, and mental endurance. Our program follows FIDE standards for competitive chess development.',
    methodology: [
      'Opening theory and strategic principles',
      'Tactical pattern recognition',
      'Endgame technique mastery',
      'Tournament psychology and time management'
    ],
    benefits: [
      'Enhanced strategic thinking and planning',
      'Improved concentration and focus',
      'Pattern recognition and analysis',
      'Mental resilience and patience'
    ],
    ageGroups: [
      { group: 'Beginners (6-10 years)', focus: 'Basic rules and fun introduction' },
      { group: 'Intermediate (11-15 years)', focus: 'Tactical development and tournaments' },
      { group: 'Advanced (16+ years)', focus: 'Master-level play and ratings' }
    ],
    gallery: [
      'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1040158/pexels-photo-1040158.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    successStory: {
      name: 'Vikram Singh',
      achievement: 'International Master',
      story: 'Vikram\'s chess journey with ROVERS led to achieving the International Master title and representing India in world youth championships.'
    }
  },
  silambam: {
    name: 'Silambam',
    image: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/Silambam.jpg',
    heroImage: 'https://images.pexels.com/photos/4164757/pexels-photo-4164757.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Traditional Tamil martial art with modern competitive edge, preserving cultural heritage while achieving international recognition.',
    history: 'Silambam is an ancient Tamil martial art using bamboo staves. Our program preserves traditional techniques while preparing athletes for modern international competitions.',
    methodology: [
      'Traditional weapon forms and techniques',
      'Cultural heritage and philosophy study',
      'Modern competition preparation',
      'Physical conditioning and flexibility training'
    ],
    benefits: [
      'Cultural connection and heritage pride',
      'Full-body coordination and flexibility',
      'Mental discipline and focus',
      'Unique competitive advantage internationally'
    ],
    ageGroups: [
      { group: 'Beginners (8-12 years)', focus: 'Basic forms and cultural introduction' },
      { group: 'Intermediate (13-17 years)', focus: 'Advanced techniques and competition' },
      { group: 'Advanced (18+ years)', focus: 'Mastery and international representation' }
    ],
    gallery: [
      'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/Sports+section/Silambam.jpg',
      'https://images.pexels.com/photos/7045586/pexels-photo-7045586.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4164758/pexels-photo-4164758.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    successStory: {
      name: 'Ravi Krishnan',
      achievement: 'World Silambam Championship Gold',
      story: 'Ravi\'s dedication to preserving Tamil martial arts while competing internationally earned him gold at the World Silambam Championships.'
    }
  }
};

export const SportDetail: React.FC = () => {
  const { sport } = useParams<{ sport: string }>();
  const sportData = sport ? sportsData[sport] : null;

  if (!sportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sport Not Found</h1>
          <Link to="/sports" className="text-blue-600 hover:text-blue-700">
            Return to Sports Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: `url('${sportData.heroImage}')`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{sportData.name}</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              {sportData.description}
            </p>
            <a
              href="https://rovers.life/register"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 inline-flex items-center group"
            >
              Register for {sportData.name}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Sport History & Description */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About {sportData.name}</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {sportData.history}
              </p>
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Why Choose Our {sportData.name} Program?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our {sportData.name.toLowerCase()} program is designed with international standards in mind. 
                  We provide comprehensive training that covers technical skills, physical conditioning, 
                  mental preparation, and competition strategy to ensure our athletes are ready for global challenges.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <LazyImage
                src={sportData.image}
                alt={sportData.name}
                className="rounded-2xl shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Training Methodology */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Training Methodology</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our systematic approach to {sportData.name.toLowerCase()} training ensures comprehensive development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sportData.methodology.map((method: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Training Focus</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{method}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Age Groups */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits & Skills Developed</h2>
              <div className="space-y-4">
                {sportData.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Age Groups */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Age Groups & Levels</h2>
              <div className="space-y-4">
                {sportData.ageGroups.map((group: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.group}</h3>
                    <p className="text-gray-600">{group.focus}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Story</h2>
            <p className="text-xl text-gray-600">
              Meet one of our {sportData.name.toLowerCase()} champions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                <img
                  src={sportData.gallery[0]}
                  alt={sportData.successStory.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{sportData.successStory.name}</h3>
              <p className="text-orange-600 font-semibold mb-4">{sportData.successStory.achievement}</p>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                {sportData.successStory.story}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Training Gallery</h2>
            <p className="text-xl text-gray-600">
              See our {sportData.name.toLowerCase()} training in action
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sportData.gallery.map((image: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={image}
                  alt={`${sportData.name} training ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-6"
          >
            Ready to Start Your {sportData.name} Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 mb-8 leading-relaxed"
          >
            Join ROVERS and take your {sportData.name.toLowerCase()} skills to the international level.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="https://rovers.life/register"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center group"
            >
              Register Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};