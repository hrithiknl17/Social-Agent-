import React from 'react';
import flowDiagram from '../assets/flow-diagram.png';

interface DiagramProps {
  alt?: string;
  className?: string;
}

const Diagram: React.FC<DiagramProps> = ({ alt = 'Flow Diagram', className = '' }) => {
  return (
    <img
      src={flowDiagram}
      alt={alt}
      className={className}
    />
  );
};

export default Diagram;
