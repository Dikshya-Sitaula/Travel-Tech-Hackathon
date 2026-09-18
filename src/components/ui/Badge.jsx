import React from 'react';
import './ui.css';

export const Badge = ({ children, variant = 'blue', className = '', icon }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
};
