import React from 'react';

export default function SkeletonLoader({ width, height, className = '' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`skeleton ${className}`}
      style={{ width: width || 'auto', height: height || 'auto' }}
    />
  );
}