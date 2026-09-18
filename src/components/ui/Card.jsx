import React from 'react';

export const Card = ({ children, className = '', hoverable = false, onClick, ...props }) => {
  const hoverClass = hoverable || onClick ? 'card-hoverable' : '';
  return (
    <div 
      className={`card ${hoverClass} ${className}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
