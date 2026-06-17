import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type = 'text', width, height, count = 1 }) => {
  const elements = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {elements.map((i) => (
        <div
          key={i}
          className={`skeleton skeleton-${type}`}
          style={{ width: width, height: height }}
        ></div>
      ))}
    </>
  );
};

export default Skeleton;
