import React from 'react';

const GradientRating = ({ rating, personalityTypes, personality }) => {
  const gradientColors = {
    // Define your desired gradient colors here
    1: '#ff0000', // Red
    2: '#ff7300', // Orange
    3: '#ffa900', // Yellow
    4: '#ffeb00', // Light yellow
    5: '#fff200', // Yellowish white
    6: '#e9f200', // Light green
    7: '#b3f200', // Green
    8: '#7ff200', // Light blue
    9: '#3cf200', // Blue
    10: '#00f262', // Dark blue
  };

  const ratingColor = gradientColors[rating] || '#ccc'; // Default grey for unknown ratings

  // Optionally, map personality types to colors
  const personalityColor = personalityTypes[personality] || '#eee';

  const innerStyle = {
    width: `${rating * 10}%`,
    backgroundColor: ratingColor,
    transition: 'width 0.3s ease-in-out',
  };

  const outerStyle = {
    backgroundColor: personalityColor,
    borderRadius: '5px',
    overflow: 'hidden',
  };

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>{rating}</div>
    </div>
  );
};

export default GradientRating;
