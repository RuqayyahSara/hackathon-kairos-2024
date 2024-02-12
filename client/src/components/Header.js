import React from 'react';

const Header = () => {
  const style = {
    "height": "50px",
    color: "white",
    "background-color": "#141717",
    fontSize: "25px",
    marginTop: "10px",
    fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
    "text-align": "center",
    "vertical-align": "middle"
  }

  return (
    <div  style={style}>
      <div className="cta">
        <div>Kairos Exam Platform</div>
      </div>
    </div>
  );
};

export default Header;
