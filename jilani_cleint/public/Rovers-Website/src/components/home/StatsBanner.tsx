import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Globe, School } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Participants', value: '15K+' },
  { icon: Trophy, label: 'International Winners', value: '132+' },
  { icon: Globe, label: 'Countries', value: '6+' },
  { icon: School, label: 'Partnered Schools', value: '100+' },
];

export const StatsBanner: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};