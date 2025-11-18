// Custom Tooltip Component

import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && wrapperRef.current && tooltipRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let newPosition = position;

      // Check vertical positioning
      if (position === 'bottom') {
        const spaceBelow = viewportHeight - wrapperRect.bottom;
        if (spaceBelow < tooltipRect.height + 20) {
          // Not enough space below, switch to top
          newPosition = 'top';
        }
      } else if (position === 'top') {
        const spaceAbove = wrapperRect.top;
        if (spaceAbove < tooltipRect.height + 20) {
          // Not enough space above, switch to bottom
          newPosition = 'bottom';
        }
      }

      // Check horizontal positioning
      if (position === 'right') {
        const spaceRight = viewportWidth - wrapperRect.right;
        if (spaceRight < tooltipRect.width + 20) {
          newPosition = 'left';
        }
      } else if (position === 'left') {
        const spaceLeft = wrapperRect.left;
        if (spaceLeft < tooltipRect.width + 20) {
          newPosition = 'right';
        }
      }

      setActualPosition(newPosition);
    }
  }, [isVisible, position]);

  return (
    <div
      ref={wrapperRef}
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div ref={tooltipRef} className={`tooltip-content tooltip-${actualPosition}`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
