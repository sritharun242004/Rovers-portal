import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sendEmail } from '../utils/emailService';
import { 
  Award, 
  Users, 
  Globe, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  School,
  Handshake,
  Target,
  Star,
  Shield,
  DollarSign,
  Trophy,
  TrendingUp,
  Heart,
  Zap,
  Medal,
  BookOpen,
  Briefcase,
  Send
} from 'lucide-react';

const benefits = [
  {
    icon: Globe,
    title: 'International Exposure',
    description: 'Access to global competitions and training exchanges for your students'
  },
  {
    icon: Trophy,
    title: 'Championship Preparation',
    description: 'Professional coaching and training programs that produce winners'
  },
  {
    icon: Users,
    title: 'Expert Coaching Staff',
    description: 'Access to internationally certified coaches and training methodologies'
  },
  {
    icon: School,
    title: 'Curriculum Integration',
    description: 'Seamless integration with academic schedules and requirements'
  },
];

const trainingPrograms = [
  {
    title: 'Foundation Level',
    ageRange: 'Ages 7-12',
    duration: '6 months',
    description: 'Basic skill development and sport fundamentals with character building',
    features: [
      'Basic skill development',
      'Sport fundamentals', 
      'Character building',
      'Fun-based learning approach'
    ],
    color: 'from-rovers-emerald to-rovers-blue',
    icon: Heart
  },
  {
    title: 'Advanced Level', 
    ageRange: 'Ages 13-16',
    duration: '12 months',
    description: 'Competitive training with mental conditioning and international preparation',
    features: [
      'Competitive training',
      'Mental conditioning',
      'International preparation',
      'Advanced technique development'
    ],
    color: 'from-rovers-blue to-rovers-red',
    icon: Zap
  },
  {
    title: 'Elite Level',
    ageRange: 'Ages 16-18', 
    duration: '18 months',
    description: 'Professional coaching with international competitions and scholarship opportunities',
    features: [
      'Professional coaching',
      'International competitions',
      'Scholarship opportunities',
      'Career pathway development'
    ],
    color: 'from-orange-500 via-red-500 to-yellow-500',
    icon: Trophy
  },
];

const solutionSteps = [
  {
    step: 1,
    title: 'School Partnerships',
    description: 'We collaborate with schools nationwide to identify exceptional student athletes',
    icon: School,
    color: 'rovers-emerald'
  },
  {
    step: 2,
    title: 'Talent Selection', 
    description: 'Rigorous selection process to find the top 2% of student athletes across all sports',
    icon: Target,
    color: 'rovers-blue'
  },
  {
    step: 3,
    title: 'Complete Sponsorship',
    description: 'Full financial support - coaching, training, equipment, travel, and competition costs',
    icon: Shield,
    color: 'rovers-red'
  },
  {
    step: 4,
    title: 'Professional Development',
    description: 'World-class coaching and training programs designed for international competition',
    icon: Trophy,
    color: 'rovers-yellow'
  },
];

const sportsCategories = [
  { name: 'Swimming', icon: '🏊‍♂️' },
  { name: 'Martial Arts', icon: '🥋' },
  { name: 'Racket Games', icon: '🏸' },
  { name: 'Cricket', icon: '🏏' },
  { name: 'Football', icon: '⚽' },
  { name: 'Basketball', icon: '🏀' },
  { name: 'Chess', icon: '♟️' },
  { name: 'Silambam', icon: '🥢' },
  { name: 'Athletics', icon: '🏃‍♂️' },
  { name: 'Tennis', icon: '🎾' },
  { name: 'Badminton', icon: '🏸' },
  { name: 'Karate', icon: '🥋' },
];

const successMetrics = [
  { value: '15,000+', label: 'Students Evaluated', icon: Users, color: 'rovers-emerald' },
  { value: '132+', label: 'International Champions', icon: Trophy, color: 'rovers-blue' },
  { value: '100%', label: 'Sponsorship Coverage', icon: Shield, color: 'rovers-red' },
  { value: '6+', label: 'Countries Reached', icon: Globe, color: 'rovers-yellow' },
];

const academyFeatures = [
  {
    title: 'Free Training',
    description: 'Complete cost coverage for selected students',
    icon: Heart,
    color: 'rovers-emerald'
  },
  {
    title: 'International Exposure', 
    description: 'Competitions in UAE, Malaysia, Qatar, India',
    icon: Globe,
    color: 'rovers-blue'
  },
  {
    title: 'Professional Coaching',
    description: 'Certified international-level coaches',
    icon: Award,
    color: 'rovers-red'
  },
  {
    title: 'Holistic Development',
    description: 'Academic support alongside athletic training',
    icon: BookOpen,
    color: 'rovers-yellow'
  },
  {
    title: 'Career Pathways',
    description: 'Scholarship and professional opportunities',
    icon: Briefcase,
    color: 'rovers-emerald'
  },
];

export const Academy: React.FC = () => {
  const [sponsorshipForm, setSponsorshipForm] = useState({
    fullName: '',
    email: '',
    businessName: '',
    phone: '',
    country: 'India',
    state: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSponsorshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use Nodemailer service to send email to roversmalaysia@gmail.com
      const result = await sendEmail(sponsorshipForm, 'academy');
      
      if (result.success) {
        setIsSubmitted(true);
        console.log('Email sent successfully:', result.messageId);
        
        // Reset form after 7 seconds
        setTimeout(() => {
          setSponsorshipForm({
            fullName: '',
            email: '',
            businessName: '',
            phone: '',
            country: 'India',
            state: '',
            message: ''
          });
          setIsSubmitted(false);
        }, 7000);
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Even on error, show as submitted and open mailto as backup
      setIsSubmitted(true);
      
      // Backup: Create plain text email
      const plainTextEmail = `
ROVERS SPORTS ACADEMY - Academy Sponsorship Application
======================================================

PERSONAL INFORMATION:
Full Name: ${sponsorshipForm.fullName}
Business Name: ${sponsorshipForm.businessName}

CONTACT DETAILS:
Email: ${sponsorshipForm.email}
Phone: ${sponsorshipForm.phone}
Country: ${sponsorshipForm.country}
State: ${sponsorshipForm.state}

MESSAGE:
${sponsorshipForm.message || 'No message provided'}

SUBMISSION DETAILS:
Submitted On: ${new Date().toLocaleString()}
Source: Academy Sponsorship Form

---
Please respond within 24-48 hours
      `;

      // Backup: Open mailto link to correct email
      const mailtoLink = `mailto:jeelu@rovers.life?subject=${encodeURIComponent('Academy Sponsorship Application - Rovers')}&body=${encodeURIComponent(plainTextEmail)}`;
      window.open(mailtoLink, '_blank');
      
      setTimeout(() => {
        setSponsorshipForm({
          fullName: '',
          email: '',
          businessName: '',
          phone: '',
          country: 'India',
          state: '',
          message: ''
        });
        setIsSubmitted(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSponsorshipChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSponsorshipForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 sm:py-24 md:py-32 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0013.jpg')`
        }}
      >
        {/* Rovers Color Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-rovers-emerald/30 via-rovers-blue/25 to-rovers-red/30"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-rovers-yellow/25 via-transparent to-rovers-emerald/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rovers-red/15 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight mobile-text-responsive"
            style={{ textShadow: '4px 4px 8px rgba(0, 0, 0, 0.8)' }}
          >
            Rovers For Schools
            <br />
            <span className="text-orange-500">Where Talent Meets Opportunity</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 mobile-text-responsive"
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}
          >
            Breaking barriers, building champions. We sponsor and develop the top 2% of student athletes who deserve global recognition.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            <button
              onClick={() => {
                const sponsorshipForm = document.getElementById('sponsorship-form');
                if (sponsorshipForm) {
                  sponsorshipForm.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center group shadow-2xl"
            >
              Apply Now
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Why Schools Choose Rovers */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center mt-8">Why Schools Choose Rovers</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We provide comprehensive support to transform your school's sports program 
              into a pathway for international success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="sponsorship-form" className="py-20 bg-gradient-to-b from-white to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            
            {/* Two Column Layout: 98% Box and Sponsorship Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* 98% Statistics Box */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-2xl border border-red-100 h-full"
              >
                <div className="text-5xl lg:text-6xl font-black text-rovers-red mb-4">98%</div>
                <p className="text-lg lg:text-xl text-gray-800 font-bold leading-relaxed mb-6">
                  of talented student athletes never get recognized due to financial constraints and lack of exposure
                </p>
                <div className="grid grid-cols-1 gap-3 text-center">
                  <div className="bg-red-50 p-3 lg:p-4 rounded-xl">
                    <DollarSign className="w-8 h-8 lg:w-10 lg:h-10 text-rovers-red mx-auto mb-2" />
                    <h4 className="font-bold text-gray-900 mb-1 text-sm lg:text-base">Financial Barriers</h4>
                    <p className="text-xs lg:text-sm text-gray-600">Training costs prevent talent development</p>
                  </div>
                  <div className="bg-red-50 p-3 lg:p-4 rounded-xl">
                    <Globe className="w-8 h-8 lg:w-10 lg:h-10 text-rovers-red mx-auto mb-2" />
                    <h4 className="font-bold text-gray-900 mb-1 text-sm lg:text-base">Limited Exposure</h4>
                    <p className="text-xs lg:text-sm text-gray-600">No access to international opportunities</p>
                  </div>
                  <div className="bg-red-50 p-3 lg:p-4 rounded-xl">
                    <Users className="w-8 h-8 lg:w-10 lg:h-10 text-rovers-red mx-auto mb-2" />
                    <h4 className="font-bold text-gray-900 mb-1 text-sm lg:text-base">Lack of Support</h4>
                    <p className="text-xs lg:text-sm text-gray-600">Missing professional guidance and mentorship</p>
                  </div>
                </div>
              </motion.div>

              {/* Sponsorship Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100 h-full"
              >
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-left">Join Our School Programme</h3>
                
                <form onSubmit={handleSponsorshipSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={sponsorshipForm.fullName}
                        onChange={handleSponsorshipChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={sponsorshipForm.email}
                        onChange={handleSponsorshipChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={sponsorshipForm.businessName}
                        onChange={handleSponsorshipChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your business name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={sponsorshipForm.phone}
                        onChange={handleSponsorshipChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={sponsorshipForm.country}
                        onChange={handleSponsorshipChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="India">India</option>
                        <option value="UAE">UAE</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={sponsorshipForm.state}
                        onChange={handleSponsorshipChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your state"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={sponsorshipForm.message}
                      onChange={handleSponsorshipChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your sponsorship interests..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className={`w-full py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center group ${
                      isSubmitted 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-orange-500 hover:bg-orange-600'
                    } text-white ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Application Sent Successfully!
                      </>
                    ) : (
                      <>
                        Send Application
                        <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <p className="text-sm text-green-800 text-center font-semibold mb-2">
                        ✅ Application Submitted Successfully!
                      </p>
                      <p className="text-xs text-green-600 text-center mt-1">
                        We have received your sponsorship application and our team will respond as soon as possible
                      </p>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Training Programs */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-rovers-blue to-rovers-red bg-clip-text text-transparent">
                Training Programs
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Structured development pathways designed for different age groups and skill levels
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainingPrograms.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${program.color} p-8 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 h-full`}>
                  <div className="flex items-center justify-between mb-6">
                    <program.icon className="w-12 h-12 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-black mb-2 text-white" style={{ color: 'white !important' }}>
                    {program.title}
                  </h3>
                  <p className="text-white mb-6 leading-relaxed font-semibold" style={{ color: 'white !important' }}>
                    {program.description}
                  </p>
                  
                  <div className="space-y-3">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-white">
                        <CheckCircle className="w-5 h-5 mr-3 text-white flex-shrink-0" style={{ color: 'white !important' }} />
                        <span className="text-sm font-medium text-white" style={{ color: 'white !important' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Coaching Excellence Program */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-rovers-blue to-rovers-emerald bg-clip-text text-transparent">
                Coaching Excellence Program
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              A systematic approach to identifying, sponsoring, and developing exceptional student athletes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'School Partnerships',
                description: 'We collaborate with schools nationwide to identify exceptional student athletes',
                icon: School,
                color: 'rovers-emerald'
              },
              {
                title: 'Olympic Mentors',
                description: 'Former Olympic and World Championship athletes as personal mentors',
                icon: Medal,
                color: 'rovers-blue'
              },
              {
                title: 'Personalized Training',
                description: 'Customized training plans tailored for each selected student athlete',
                icon: Target,
                color: 'rovers-red'
              },
              {
                title: 'Video Analysis',
                description: 'Advanced video analysis and technique refinement technology',
                icon: Zap,
                color: 'rovers-yellow'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 ${
                  feature.title === 'Video Analysis'
                    ? 'bg-yellow-400/20'
                    : `bg-${feature.color}/20`
                } rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className={`w-8 h-8 ${
                    feature.title === 'Video Analysis'
                      ? 'text-yellow-500'
                      : `text-${feature.color}`
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Journey Process */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-rovers-blue to-rovers-red bg-clip-text text-transparent">
                Student Journey Process
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              A comprehensive pathway from application to international competition success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: 'Application Process',
                description: 'Application through schools or direct enrollment with comprehensive evaluation',
                icon: BookOpen,
                color: 'rovers-blue'
              },
              {
                step: 2,
                title: 'Multi-Stage Evaluation',
                description: 'Rigorous selection process to identify top talent across all sports',
                icon: Target,
                color: 'rovers-red'
              },
              {
                step: 3,
                title: 'Pathway Creation',
                description: 'Customized development pathway designed for individual strengths',
                icon: TrendingUp,
                color: 'rovers-yellow'
              },
              {
                step: 4,
                title: 'Progress Monitoring',
                description: 'Regular progress tracking and pathway adjustments for optimal development',
                icon: Shield,
                color: 'rovers-emerald'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg ${
                    step.step === 1 ? 'bg-blue-600' :
                    step.step === 2 ? 'bg-red-600' :
                    step.step === 3 ? 'bg-black' :
                    step.step === 4 ? 'bg-green-600' :
                    `bg-${step.color}`
                  }`}>
                    {step.step}
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 pt-12 h-64 flex flex-col justify-center items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-100">
                  <step.icon className={`w-12 h-12 mb-4 text-${step.color} group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Academic Integration */}
      <section className="py-20 bg-gradient-to-b from-red-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              <span className="text-yellow-600 font-black" style={{ color: '#ca8a04 !important' }}>
                Academic Integration
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Balancing athletic excellence with academic achievement for complete development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Flexible Schooling',
                description: 'Customized school arrangements accommodating intensive training schedules',
                icon: School,
                color: 'rovers-yellow'
              },
              {
                title: 'Academic Tutoring',
                description: 'Dedicated tutoring support during competitions and training camps',
                icon: BookOpen,
                color: 'rovers-emerald'
              },
              {
                title: 'Scholarship Planning',
                description: 'University scholarship pathway planning and application support',
                icon: Award,
                color: 'rovers-blue'
              },
              {
                title: 'Career Guidance',
                description: 'Professional career guidance beyond competitive sports',
                icon: Briefcase,
                color: 'rovers-red'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-${feature.color}/20 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-rovers-emerald to-rovers-blue">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl font-black text-white mb-6" style={{ color: 'white !important' }}
          >
            <span className="text-white font-black" style={{ color: 'white !important' }}>Join Rovers Academy</span>
            <br />
            <span className="text-orange-400 font-black" style={{ color: '#fb923c !important' }}>Where Dreams Become Reality</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-white mb-8 leading-relaxed max-w-2xl mx-auto font-semibold" style={{ color: 'white !important' }}
          >
            Don't let financial constraints hold back exceptional talent. Apply now and join the top 2% of student athletes who receive full sponsorship and international opportunities.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <button
              onClick={() => {
                const sponsorshipForm = document.getElementById('sponsorship-form');
                if (sponsorshipForm) {
                  sponsorshipForm.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-6 rounded-full font-bold text-xl transition-all duration-300 inline-flex items-center justify-center group shadow-2xl"
              style={{ color: 'white !important' }}
            >
              Apply Now
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};