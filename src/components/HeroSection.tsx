import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
            See the World,<br />
            Differently
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            AKSHI turns any smart glasses into your personal AI-powered guide — reading, describing, and navigating in real time, even offline.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-4"
          >
            {/* The button has been replaced with a Link component */}
            <Link
              to="/visual-assistant" // This links to your new page
              className="bg-[#4169E1] hover:bg-[#3557c7] text-white px-8 py-3 rounded-md text-lg font-medium transition-all duration-300 hover:scale-105 inline-block"
            >
              Try Now
            </Link>
            
            <p className="text-white" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', opacity: 0.5, marginTop: '10px' }}>
              No card required.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;