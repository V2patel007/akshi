import React from 'react';
import { motion } from 'framer-motion';

const Section2: React.FC = () => {
  return (
    <section className="py-32 bg-[#070707] text-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9]"
              style={{ fontFamily: 'Lato, sans-serif', fontWeight: '700' }}
            >
              From waiting for help… to instant independence
            </h1>
            
            <h2 
              className="text-2xl md:text-3xl leading-relaxed text-white"
              style={{ fontFamily: 'Manrope, sans-serif', fontWeight: '600' }}
            >
              No more relying on someone to read signs, describe surroundings, or guide you. With AKSHI, real-time assistance is just a voice command away.
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <img 
              src="https://res.cloudinary.com/dy9hjd10h/image/upload/v1754862551/Frame_95232_oc3llt.png" 
              alt="AKSHI in action" 
              className="w-full max-w-2xl h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Section2;