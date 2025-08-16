import React from 'react';
import { motion } from 'framer-motion';

const Section3: React.FC = () => {
  return (
    <section className="py-32 bg-[#070707] text-white">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto space-y-16"
        >
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9]"
            style={{ fontFamily: 'Lato, sans-serif', fontWeight: '700' }}
          >
            Everyone has dreams, but imagine trying to dream without being able to see.
          </h1>
          
          <div className="flex flex-col items-center gap-6">
            <button 
              className="bg-[#316BFF] hover:bg-[#2557e6] text-white px-16 py-5 rounded-full text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#316BFF]/30"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Support Us
            </button>
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors duration-300 underline text-lg"
            >
              Share our story
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Section3;