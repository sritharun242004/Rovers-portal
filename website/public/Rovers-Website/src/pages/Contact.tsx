import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, Send, Globe } from 'lucide-react';
import { sendEmail } from '../utils/emailService';

// Simple CountUp component
const CountUp: React.FC<{ end: number; duration: number; suffix?: string }> = ({ end, duration, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  React.useEffect(() => {
    if (!hasStarted) return;
    
    const increment = end / (duration * 60); // 60fps
    const timer = setInterval(() => {
      setCount(prev => {
        const next = prev + increment;
        if (next >= end) {
          clearInterval(timer);
          return end;
        }
        return next;
      });
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [hasStarted, end, duration]);

  React.useEffect(() => {
    const timer = setTimeout(() => setHasStarted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return <span>{Math.floor(count)}{suffix}</span>;
};

const contactInfo = [
  {
    country: 'Global',
    icon: Mail,
    title: 'Email',
    details: ['jeelu@rovers.life'],
  },
  {
    country: 'India',
    icon: MapPin,
    title: 'Headquarters',
    details: ['Rovers Sports Institute', 'Chennai, Tamil Nadu 600001'],
  },
  {
    country: 'UAE',
    icon: MapPin,
    title: 'Dubai Office',
    details: ['Dubai Sports City', 'Dubai, United Arab Emirates'],
  },
  {
    country: 'Global',
    icon: Clock,
    title: 'Office Hours',
    details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM'],
  },
];

export const Contact: React.FC = () => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'India',
    state: '',
    userType: 'student',
    sport: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Use Nodemailer service to send email to roversmalaysia@gmail.com
      const result = await sendEmail(formData, 'contact');
      
      if (result.success) {
        setIsSubmitted(true);
        console.log('Email sent successfully:', result.messageId);
        
        // Reset form after 7 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            country: 'India',
            state: '',
            userType: 'student',
            sport: '',
            message: ''
          });
          setIsSubmitted(false);
        }, 7000);
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-32 bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white max-w-3xl mx-auto leading-relaxed"
          >
            Ready to start your journey to international sports excellence? 
            Get in touch with our global team today.
          </motion.p>
        </div>
      </section>

      {/* Global Presence */}
      <section 
        className="py-16 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Global Presence</h2>
            <p className="text-2xl font-semibold text-rovers-emerald mb-4">INDIA / UAE / MALAYSIA / SINGAPORE / OMAN / QATAR</p>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Rovers operates across multiple countries, bringing international sports 
              opportunities directly to student athletes worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { country: 'India', city: 'Chennai', description: 'Headquarters and main training facility' },
              { country: 'UAE', city: 'Dubai', description: 'Regional training and development center' },
              { country: 'Malaysia', city: 'Kuala Lumpur', description: 'International competitions and finals venue' },
              { country: 'Singapore', city: 'Singapore', description: 'Southeast Asia training hub' },
              { country: 'Oman', city: 'Muscat', description: 'Gulf region sports center' },
              { country: 'Qatar', city: 'Doha', description: 'Middle East training facility' },
            ].map((location, index) => (
              <motion.div
                key={location.country}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300"
              >
                <Globe className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">{location.country}</h3>
                <p className="text-lg font-semibold mb-2 text-blue-600">{location.city}</p>
                <p className="text-sm text-gray-600">{location.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={`${info.country}-${info.title}`} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{info.title}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{info.country}</span>
                      </div>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Visit Our Campus</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Schedule a visit to see our world-class facilities and meet our coaching staff. 
                  Experience firsthand what makes Rovers the premier choice for student athlete development.
                </p>
                <a
                  href="https://rovers.life/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 inline-block"
                >
                  Schedule a Visit
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="India">India</option>
                      <option value="UAE">UAE</option>
                      <option value="Malaysia">Malaysia</option>
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
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your state"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I am a...
                    </label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                      <option value="school">School Representative</option>
                      <option value="coach">Coach</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sport of Interest
                    </label>
                    <select
                      name="sport"
                      value={formData.sport}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a sport</option>
                      <option value="swimming">Swimming</option>
                      <option value="badminton">Badminton</option>
                      <option value="athletics">Athletics</option>
                      <option value="football">Football</option>
                      <option value="karate">Karate</option>
                      <option value="cricket">Cricket</option>
                      <option value="basketball">Basketball</option>
                      <option value="chess">Chess</option>
                      <option value="silambam">Silambam</option>
                      <option value="multiple">Multiple Sports</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your goals and how we can help..."
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
                      Message Sent Successfully!
                    </>
                  ) : (
                    <>
                      Send Message
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
                      ✅ Form Submitted Successfully!
                    </p>
                    <p className="text-xs text-green-600 text-center mt-1">
                      We have received your inquiry and our team will respond as soon as possible
                    </p>
                  </motion.div>
                )}
                
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-sm text-red-800 text-center font-semibold">
                      ❌ {submitError}
                    </p>
                  </motion.div>
                )}
              </form>
              <div className="mt-4 text-center">
                <a
                  href="https://rovers.life/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Or register directly here
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Map Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Global Campuses</h2>
            <p className="text-lg text-gray-600">
              Experience our world-class facilities across multiple countries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* India - Chennai */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.8862435263!2d80.06892495!3d13.047984249999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu%2C%20India!5e0!3m2!1sen!2sus!4v1635789012345!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Chennai, India Location"
                ></iframe>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-rovers-emerald mr-2" />
                  <p className="text-lg font-bold text-gray-900">INDIA</p>
                </div>
                <p className="text-sm text-gray-600">Chennai, Tamil Nadu</p>
              </div>
            </motion.div>

            {/* UAE - Dubai */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.68285082463!2d54.947942299999996!3d25.0762865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dubai, UAE Location"
                ></iframe>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-rovers-emerald mr-2" />
                  <p className="text-lg font-bold text-gray-900">UAE</p>
                </div>
                <p className="text-sm text-gray-600">Dubai Sports City</p>
              </div>
            </motion.div>

            {/* Malaysia - Kuala Lumpur */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.3153252698!2d101.5216598!3d3.1385036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd08e7d3%3A0x232e1ff540d86c99!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur%2C%20Malaysia!5e0!3m2!1sen!2sus!4v1635789234567!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kuala Lumpur, Malaysia Location"
                ></iframe>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-rovers-emerald mr-2" />
                  <p className="text-lg font-bold text-gray-900">MALAYSIA</p>
                </div>
                <p className="text-sm text-gray-600">Kuala Lumpur</p>
              </div>
            </motion.div>

            {/* Singapore */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.19036981457!2d103.70474335!3d1.3143394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da11238a8b9375%3A0x887869cf52abf5c4!2sSingapore!5e0!3m2!1sen!2sus!4v1635789345678!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Singapore Location"
                ></iframe>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-rovers-emerald mr-2" />
                  <p className="text-lg font-bold text-gray-900">SINGAPORE</p>
                </div>
                <p className="text-sm text-gray-600">Singapore</p>
              </div>
            </motion.div>

            {/* Oman - Muscat */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233584.01045779053!2d58.31507245!3d23.5880307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8dfefa68e6f0d7%3A0x4e5c75bb8bf84a86!2sMuscat%2C%20Oman!5e0!3m2!1sen!2sus!4v1635789456789!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Muscat, Oman Location"
                ></iframe>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-rovers-emerald mr-2" />
                  <p className="text-lg font-bold text-gray-900">OMAN</p>
                </div>
                <p className="text-sm text-gray-600">Muscat</p>
              </div>
            </motion.div>

            {/* Qatar - Doha */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233095.99755179195!2d51.352485!3d25.2854473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45c534ffdce87f%3A0x1cfa88cf812b4032!2sDoha%2C%20Qatar!5e0!3m2!1sen!2sus!4v1635789567890!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Doha, Qatar Location"
                ></iframe>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-rovers-emerald mr-2" />
                  <p className="text-lg font-bold text-gray-900">QATAR</p>
                </div>
                <p className="text-sm text-gray-600">Doha</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};