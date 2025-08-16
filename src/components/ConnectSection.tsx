import React from 'react';
import { motion } from 'framer-motion';

const ConnectSection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Let's Connect
          </h2>
          
          <button className="bg-[#4169E1] hover:bg-[#3557c7] text-white px-8 py-3 rounded-md text-lg font-medium transition-all duration-300 hover:scale-105">
            Try for free
          </button>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto pt-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <p className="text-lg text-gray-300">Supported by</p>
              <div className="flex justify-center">
                <img 
                  src="https://res.cloudinary.com/dy9hjd10h/image/upload/v1754862630/Group_1321314954_n3exdm.svg" 
                  alt="Supporter Logo" 
                  className="h-12 w-auto"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <p className="text-lg text-gray-300">Incubated at</p>
              <div className="flex justify-center">
                <img 
                  src="https://res.cloudinary.com/dy9hjd10h/image/upload/v1754862629/image_202_hd9ao9.png" 
                  alt="Incubator Logo" 
                  className="h-12 w-auto"
                />
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="pt-8"
          >
            <p className="text-gray-400 text-lg">Mentor</p>
            <p className="text-white text-lg">Dr. Saurabh Shah</p>
            <p className="text-white text-lg">Ms. Zalak Kansagra</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConnectSection;