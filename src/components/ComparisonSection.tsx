import React from 'react';
import { motion } from 'framer-motion';

const ComparisonSection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-16"
        >
          <div className="space-y-6">
            <h2 className="text-6xl font-bold text-white leading-tight">
              From waiting for help... to<br />
              instant independence
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              No more relying on someone to read signs, describe<br />
              surroundings, or guide you.<br />
              With AKSHI, real-time assistance is just a voice command away.
            </p>
          </div>
          
          <div className="flex justify-center">
            <img 
              src="https://res.cloudinary.com/dy9hjd10h/image/upload/v1754862551/Frame_95232_oc3llt.png" 
              alt="Getting assistance comparison" 
              className="w-full h-auto"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;