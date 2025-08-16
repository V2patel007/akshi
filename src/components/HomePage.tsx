// src/components/HomePage.tsx
import React from 'react';
import HeroSection from './HeroSection';
import ComparisonSection from './ComparisonSection';
import DreamSection from './DreamSection';
import AboutSection from './AboutSection';
import ConnectSection from './ConnectSection';

function HomePage() {
  return (
    <>
      <HeroSection />
      <ComparisonSection />
      <DreamSection />
      <AboutSection />
      <ConnectSection />
    </>
  );
}

export default HomePage;