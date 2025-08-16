import React from 'react';
import { motion } from 'framer-motion';

const Section4: React.FC = () => {
  return (
    <section className="py-32 bg-[#070707] text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9]"
            style={{ fontFamily: 'Lato, sans-serif', fontWeight: '700' }}
          >
            For <span className="text-[#5988FF]">millions</span> of <span className="text-[#5988FF]">visually impaired</span> individuals, navigating the world is a <span className="text-[#5988FF]">daily challenge</span>.
          </motion.h1>
          
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9]"
            style={{ fontFamily: 'Lato, sans-serif', fontWeight: '700' }}
          >
            <span className="text-[#5988FF]">AKSHI</span> changes that — using <span className="text-[#5988FF]">advanced AI</span> to <span className="text-[#5988FF]">see</span>, <span className="text-[#5988FF]">understand</span>, and <span className="text-[#5988FF]">speak</span> back to you <span className="text-[#5988FF]">instantly</span>. From <span className="text-[#5988FF]">reading</span> a <span className="text-[#5988FF]">signboard</span> to <span className="text-[#5988FF]">guiding</span> you through <span className="text-[#5988FF]">crowded streets</span>, AKSHI works <span className="text-[#5988FF]">anytime</span>, <span className="text-[#5988FF]">anywhere</span>, without depending on the <span className="text-[#5988FF]">internet</span>.
          </motion.h1>
        </div>
      </div>
    </section>
  );
};

export default Section4;