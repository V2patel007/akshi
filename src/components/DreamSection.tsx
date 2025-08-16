import React from 'react';
import { motion } from 'framer-motion';

const DreamSection: React.FC = () => {
  return (
    <section className="py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div 
            className="relative rounded-2xl p-16 md:p-20 text-center overflow-hidden min-h-[500px] flex items-center justify-center"
            style={{
              backgroundImage: 'url(https://res.cloudinary.com/dy9hjd10h/image/upload/v1754934065/Frame_95253_ny0ygu.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                Everyone has dreams, but imagine trying to dream without being able to see.
              </h2>
              
              <button className="bg-[#4169E1] hover:bg-[#3557c7] text-white px-8 py-3 rounded-md text-lg font-medium transition-all duration-300 hover:scale-105" style={{ marginTop: '48px' }}>
                Support us
              </button>
              
              <p className="text-white" style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', opacity: 0.5, marginTop: '10px' }}>
                Share our story
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DreamSection;