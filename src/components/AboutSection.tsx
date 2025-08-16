import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [highlightedWords, setHighlightedWords] = useState<Set<number>>(new Set());

  const text1 = `For millions of visually impaired individuals, navigating the world is a daily challenge.`;
  const text2 = `AKSHI changes that — using advanced AI to see, understand, and speak back to you instantly. From reading a signboard to guiding you through crowded streets, AKSHI works anytime, anywhere, without depending on the internet.`;
  
  const words1 = text1.split(' ');
  const words2 = text2.split(' ');
  const totalWords = words1.length + words2.length;

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Calculate scroll progress through the section
      const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
      
      // Determine how many words should be highlighted based on scroll progress
      const wordsToHighlight = Math.floor(scrollProgress * totalWords);
      
      // Create set of highlighted word indices
      const newHighlightedWords = new Set<number>();
      for (let i = 0; i < wordsToHighlight; i++) {
        newHighlightedWords.add(i);
      }
      
      setHighlightedWords(newHighlightedWords);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalWords]);

  return (
    <section className="py-20" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="space-y-8">
            <div className="text-3xl md:text-4xl lg:text-5xl leading-relaxed space-y-6">
              <p>
                {words1.map((word, index) => (
                  <span
                    key={index}
                    className={`transition-all duration-300 ${
                      highlightedWords.has(index)
                        ? 'text-[#5988FF] font-semibold'
                        : 'text-white'
                    }`}
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>
              <p>
                {words2.map((word, index) => (
                  <span
                    key={index + words1.length}
                    className={`transition-all duration-300 ${
                      highlightedWords.has(index + words1.length)
                        ? 'text-[#5988FF] font-semibold'
                        : 'text-white'
                    }`}
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;