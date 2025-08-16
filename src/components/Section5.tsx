import React from 'react';
import { motion } from 'framer-motion';

const Section5: React.FC = () => {
  return (
    <section className="py-32 bg-[#070707] text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-16"
        >
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold"
            style={{ fontFamily: 'Lato, sans-serif', fontWeight: '700' }}
          >
            Let's Connect
          </h1>
          
          <button 
            className="bg-[#316BFF] hover:bg-[#2557e6] text-white px-16 py-5 rounded-full text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#316BFF]/30"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Try for Free
          </button>
          
          <div className="grid md:grid-cols-2 gap-20 max-w-6xl mx-auto mt-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center space-y-8"
            >
              <h2 
                className="text-2xl md:text-3xl"
                style={{ fontFamily: 'Manrope, sans-serif', fontWeight: '600' }}
              >
                Supported by
              </h2>
              <img 
                src="https://res.cloudinary.com/dy9hjd10h/image/upload/v1754862630/Group_1321314954_n3exdm.svg" 
                alt="Supporter Logo" 
                className="h-20 w-auto mx-auto"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center space-y-8"
            >
              <h2 
                className="text-2xl md:text-3xl"
                style={{ fontFamily: 'Manrope, sans-serif', fontWeight: '600' }}
              >
                Incubated at
              </h2>
              <img 
                src="https://res.cloudinary.com/dy9hjd10h/image/upload/v1754862629/image_202_hd9ao9.png" 
                alt="Incubator Logo" 
                className="h-20 w-auto mx-auto"
              />
            </motion.div>
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-400 text-xl mt-16"
          >
            Mentor Dr. Saurabh Shah & Ms. Zalak Kansagra
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Section5;