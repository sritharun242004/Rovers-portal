import React from 'react';
import { motion } from 'framer-motion';

const partners = [
  {
    name: 'Dubai Sports School',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/dsc-logo.4f0528de.webp',
  },
  {
    name: 'DPIIT',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/DPIIT+Logo.png',
  },
  {
    name: 'Startup Tamil Nadu',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/Startup+TN+Logo.png',
  },
  {
    name: 'SPI Edge',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/SPI+Edge+Logo.png',
  },
  {
    name: 'Startup Payanam',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/Startup+Payanam+Logo.png',
  },
  {
    name: 'DoLabs',
    logo: 'https://inaibucket.s3.us-east-1.amazonaws.com/Rovers/patners/Dolabs+Logo+from+SPI+Infrastructure.png',
  },
];

export const Partners: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">PERCEIVED BY</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We collaborate with leading educational institutions and organizations 
            to provide the best opportunities for our student athletes.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 items-center">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors duration-300 w-full h-16 sm:h-20 md:h-24 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className={`${
                    partner.name === 'Startup Payanam' || 
                    partner.name === 'SPI Edge' || 
                    partner.name === 'DoLabs'
                      ? 'max-h-10 sm:max-h-14 md:max-h-16' 
                      : 'max-h-8 sm:max-h-10 md:max-h-12'
                  } max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};