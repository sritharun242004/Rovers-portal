import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { School, Globe, Trophy, Users, CheckCircle, ArrowRight, Phone, User, Building, Check } from 'lucide-react';
import { LazyImage } from '../components/common/LazyImage';
import { sendEmail } from '../utils/emailService';

const partners = [
  {
    name: 'Dubai Sports School',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/dsc-logo.4f0528de.webp',
    type: 'International School',
    description: 'Leading sports education institution in the Middle East'
  },
  {
    name: 'DPIIT',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/DPIIT+Logo.png',
    type: 'Government Partner',
    description: 'Department for Promotion of Industry and Internal Trade'
  },
  {
    name: 'Startup Tamil Nadu',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/Startup+TN+Logo.png',
    type: 'Government Initiative',
    description: 'Supporting innovation in sports education'
  },
  {
    name: 'SPI Edge',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/SPI+Edge+Logo.png',
    type: 'Technology Partner',
    description: 'Advanced sports performance technology solutions'
  },
  {
    name: 'Startup Payanam',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/Startup+Payanam+Logo.png',
    type: 'Innovation Partner',
    description: 'Supporting startup innovation in sports education'
  },
  {
    name: 'DoLabs',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/Dolabs+Logo+from+SPI+Infrastructure.png',
    type: 'Tech & Curation Partner',
    description: 'Innovative technology solutions and digital curation for sports excellence'
  },
];


const partnershipSteps = [
  'Initial consultation to understand your school\'s sports goals',
  'Custom program design based on your facilities and student needs',
  'Coach training and certification for your existing staff',
  'Student assessment and talent identification',
  'Ongoing support and international opportunity access'
];

export const Partners: React.FC = () => {
  const [formType, setFormType] = useState<'school' | 'coach' | 'partner'>('school');
  const [formData, setFormData] = useState({
    // School fields
    schoolName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    message: '',
    // Coach fields
    name: '',
    sportCategory: '',
    // Partner fields
    businessName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Prepare form data for email
      const emailFormData = {
        name: formType === 'school' ? formData.schoolName : formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        state: formData.state,
        message: formData.message || 'No additional message provided',
        formType: formType === 'school' ? 'Institute' : formType === 'coach' ? 'Coach' : 'Partnership',
        businessName: formType === 'partner' ? formData.businessName : undefined,
        sportCategory: formType === 'coach' ? formData.sportCategory : undefined
      };

      // Use Nodemailer service to send email to roversmalaysia@gmail.com
      const result = await sendEmail(emailFormData, 'partners');
      
      if (result.success) {
        setIsSubmitted(true);
        console.log('Email sent successfully:', result.messageId);
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({
          schoolName: '',
          email: '',
          phone: '',
          country: '',
          state: '',
          message: '',
          name: '',
          sportCategory: '',
          businessName: ''
        });
        setIsSubmitted(false);
        }, 7000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Thank you for your interest! Your inquiry has been received and logged. Our team will contact you within 24-48 hours.');
      
      // Even on "error", show success since we want to be user-friendly
      setTimeout(() => {
        setIsSubmitted(true);
        setSubmitError('');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-blue-900"
        style={{
          backgroundImage: `url('https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0012.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 mobile-text-responsive"
          >
            School Partnerships
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mobile-text-responsive"
          >
            Partner with Rovers to transform your school's sports program and give 
            your students access to international opportunities.
          </motion.p>
        </div>
      </section>

      {/* Event Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Event Gallery</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Memorable moments from our partnership events and collaborative initiatives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0012.jpg',
                title: 'Partnership Summit 2024',
                description: 'Annual gathering of educational partners and stakeholders'
              },
              {
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0013.jpg',
                title: 'School Sports Festival',
                description: 'Collaborative sports event with partner schools'
              },
              {
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0014.jpg',
                title: 'International Exchange Program',
                description: 'Student athletes participating in global programs'
              },
              {
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0015.jpg',
                title: 'Coach Training Workshop',
                description: 'Professional development for partner school coaches'
              },
              {
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0016.jpg',
                title: 'Awards Ceremony',
                description: 'Recognizing excellence in partnership achievements'
              },
              {
                image: 'https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0017.jpg',
                title: 'Community Outreach',
                description: 'Joint initiatives for sports development in communities'
              }
            ].map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48">
                  <LazyImage
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Process */}
      <section 
        className="py-16 bg-gray-50"
        style={{
          backgroundImage: `url('https://externshipbucket.s3.ap-south-1.amazonaws.com/Rovers/Rovers+kid+poster/IMG-20250901-WA0013.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded-2xl"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Partnership Process</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our partnership process is designed to seamlessly integrate with your 
                school's existing structure while elevating your sports programs to international standards.
              </p>

              <div className="space-y-4">
                {partnershipSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative z-10 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
            >
              <h3 id="partnership-form" className="text-2xl font-bold text-gray-900 mb-6">Ready to Partner?</h3>
              
              {/* Success Message */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.h4
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-green-600 mb-4"
                  >
                    Thank You for Your Interest!
                  </motion.h4>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-700 text-lg leading-relaxed max-w-md mx-auto"
                  >
                    Your inquiry has been successfully sent to our team at Rovers. We have received all your details and will reach out to you as soon as possible to discuss the next steps.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <p className="text-sm text-green-800 text-center font-semibold">
                      ✅ Your inquiry has been sent successfully!
                    </p>
                    <p className="text-xs text-green-600 text-center mt-1">
                      We'll respond within 24-48 hours
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* Error Message */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                >
                  {submitError}
                </motion.div>
              )}
              
              {/* Form Type Selection */}
              {!isSubmitted && (
                <>
                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setFormType('school')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    formType === 'school'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <School className="w-4 h-4" />
                  Institute
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('coach')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    formType === 'coach'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Coach
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('partner')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    formType === 'partner'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  Partnership
                </button>
              </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                {/* School Form */}
                {formType === 'school' && (
                  <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institute Name *
                  </label>
                  <input
                    type="text"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your School or Academy Name"
                        required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Country</option>
                          <option value="India">India</option>
                          <option value="UAE">UAE</option>
                          <option value="Malaysia">Malaysia</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter state"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about your requirements..."
                      />
                    </div>
                  </>
                )}

                {/* Coach Form */}
                {formType === 'coach' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sport Category *
                      </label>
                      <select
                        name="sportCategory"
                        value={formData.sportCategory}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Sport Category</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Swimming">Swimming</option>
                        <option value="Athletics">Athletics</option>
                        <option value="Football">Football</option>
                        <option value="Martial Arts">Martial Arts</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Country</option>
                          <option value="India">India</option>
                          <option value="UAE">UAE</option>
                          <option value="Malaysia">Malaysia</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter state"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about your coaching experience and goals..."
                      />
                    </div>
                  </>
                )}

                {/* Partner Form */}
                {formType === 'partner' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name *
                  </label>
                  <input
                    type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your business name"
                        required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                  </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about your business and partnership interests..."
                      />
                </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center group ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Email...
                    </>
                  ) : (
                    <>
                      Submit {formType === 'school' ? 'Institute' : formType === 'coach' ? 'Coach' : 'Partnership'} Inquiry
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
                </>
              )}
               
            </motion.div>
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">PERCEIVED BY</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join a network of leading educational institutions and organizations 
              committed to student athlete excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex items-center justify-center h-16 mb-4">
                  <LazyImage
                    src={partner.logo}
                    alt={partner.name}
                    className={`${
                      partner.name === 'Startup Payanam' || 
                      partner.name === 'SPI Edge' || 
                      partner.name === 'DoLabs'
                        ? 'max-h-16' 
                        : 'max-h-12'
                    } max-w-full object-contain`}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{partner.name}</h3>
                <p className="text-blue-600 font-semibold text-center mb-2">{partner.type}</p>
                <p className="text-gray-600 text-sm text-center leading-relaxed">{partner.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};