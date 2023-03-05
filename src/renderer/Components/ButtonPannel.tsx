import React, { useState } from 'react';
import "../CSS/styles.css"

const ButtonPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleButtonText = isOpen ? 'X' : '⟵';

  return (
    <div className="button-panel-container">
      <div className={`button-panel${isOpen ? ' open' : ''}`}>
      <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>{toggleButtonText}</button>
        <div className="action-buttons">
          <button className="action-button">Button 1</button>
          <button className="action-button">Button 2</button>
          <button className="action-button">Button 3</button>
        </div>
      </div>
    </div>
  );
}

export default ButtonPanel;


