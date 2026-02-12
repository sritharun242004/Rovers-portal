import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Handshake, Award } from 'lucide-react';

const projects = [
  {
    title: 'CSR Sports Camps',
    description: 'Corporate Social Responsibility initiatives bringing sports training to underserved communities',
    image: 'https://images.pexels.com/photos/3621234/pexels-photo-3621234.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Users,
    stats: '5000+ Students Reached'
  },
  {
    title: 'Brand Launch Events',
    description: 'High-profile sports events and brand launches showcasing student athlete talent',
    image: 'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Award,
    stats: '25+ Major Events'
  },
  {
    title: 'MSME Minister Meetings',
    description: 'Strategic partnerships with government officials to promote sports education initiatives',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Handshake,
    stats: 'Government Recognition'
  },
  {
    title: 'International Partnerships',
    description: 'Building bridges with international sports organizations and educational institutions',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: Briefcase,
    stats: '15+ Global Partners'
  },
];

export const ProjectPortfolio: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-6">PROJECT PORTFOLIO</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover our impactful initiatives that extend beyond training to create 
            lasting change in the sports education landscape.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white mb-2">
                    <project.icon className="w-6 h-6 mr-2" />
                    <span className="font-semibold">{project.stats}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};