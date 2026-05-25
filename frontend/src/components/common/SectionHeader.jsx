import React from 'react';

const SectionHeader = ({ title, buttonText, onButtonClick }) => (
  <div className="section-header">
    <h3 className="section-title">{title}</h3>
    {buttonText && (
      <button className="btn btn-primary" onClick={onButtonClick}>
        {buttonText}
      </button>
    )}
  </div>
);

export default SectionHeader;
