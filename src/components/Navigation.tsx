import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
      {/* This parent div uses flexbox to center its content.
        'justify-center' aligns items horizontally in the center.
        'items-center' aligns items vertically in the center.
      */}
      <nav className="flex justify-center items-center py-4">
        {/* Logo */}
        <Link to="/">
          <img 
            src="https://res.cloudinary.com/dy9hjd10h/image/upload/v1754862550/Hi_1_hgycbl.svg" 
            alt="AKSHI Logo" 
            className="h-24 w-auto"
          />
        </Link>
        
        {/*
          If you add more links later, you may need to adjust this.
          For now, 'justify-center' works perfectly for a single centered item.
        */}
      </nav>
    </header>
  );
};

export default Navigation;
