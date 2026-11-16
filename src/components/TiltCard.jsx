import React, { useState, useRef } from 'react';

export default function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
  onClick,
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(
      `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.35,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)`,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: transformStyle,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}

      {/* Holographic dynamic glare overlay */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-20 overflow-hidden"
          style={glareStyle}
        />
      )}
    </div>
  );
}
