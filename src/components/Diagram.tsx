import React from 'react';
import flowDiagram from '../assets/flow-diagram.png';

interface DiagramProps {
  alt?: string;
  className?: string;
  caption?: string;
}

const Diagram: React.FC<DiagramProps> = ({ alt = 'Flow diagram', className = '', caption }) => {
  return (
    <figure className={className}>
      <img src={flowDiagram} alt={alt} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};

export default Diagram;
