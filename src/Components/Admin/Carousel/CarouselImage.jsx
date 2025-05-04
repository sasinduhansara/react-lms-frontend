import React from 'react';

const CarouselImage = ({ imageUrl, altText }) => {
  return (
    <div style={{ height: '500px', overflow: 'hidden' }}>
      <img 
        src={imageUrl} 
        alt={altText} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />
    </div>
  );
};

export default CarouselImage;
