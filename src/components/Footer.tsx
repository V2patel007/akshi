import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="py-20 bg-gradient-to-t from-[#000000] to-transparent">
      {/* Section divider line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-20"></div>
      
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Ready to revolutionize how you see?
            </h2>
            <button className="bg-[#4169E1] hover:bg-[#3557c7] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-md text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap">
              Try for free
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;