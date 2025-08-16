import React from 'react';
import Lottie from 'lottie-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [animationData, setAnimationData] = React.useState(null);

  React.useEffect(() => {
    // Load the Lottie animation
    fetch('/Hi.mp4.lottie.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error));

    // Auto-complete after 5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!animationData) {
    return (
      <div className="fixed inset-0 bg-[#000000] flex items-center justify-center z-50">
        <div className="w-32 h-32 border-4 border-[#316BFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#000000] flex items-center justify-center z-50">
      <div className="w-64 h-64">
        <Lottie 
          animationData={animationData} 
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;