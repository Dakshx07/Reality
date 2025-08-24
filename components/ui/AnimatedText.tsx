
import React from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  return (
    <p className={`text-gray-300 leading-relaxed ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 15}ms`, animationFillMode: 'backwards' }}
        >
          {char}
        </span>
      ))}
    </p>
  );
};

export default AnimatedText;