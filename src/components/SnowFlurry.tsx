import React from 'react';

export const SnowFlurry: React.FC = () => {
  const snowflakes = React.useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 20 : 50;
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 6 + 4; // Slightly larger
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 10 + 10;
      const animationDelay = Math.random() * -20;
      const opacity = Math.random() * 0.6 + 0.4; // More opaque
      return { id: i, size, left, animationDuration, animationDelay, opacity };
    });
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" 
      aria-hidden="true"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0px, transparent 120px, black 200px, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, transparent 120px, black 200px, black 100%)'
      }}
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)] animate-snowfall"
          style={{
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            left: `${flake.left}%`,
            top: `-10vh`,
            opacity: flake.opacity,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
};
