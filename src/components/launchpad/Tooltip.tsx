// Custom Tooltip Component

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [actualPosition, setActualPosition] = useState(position);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && wrapperRef.current && tooltipRef.current) {
      const updatePosition = () => {
        if (!wrapperRef.current || !tooltipRef.current) return;

        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let top = 0;
        let left = 0;
        let newPosition = position;

        // Get header height to prevent tooltip overflow
        const header = document.querySelector('ion-header');
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const minTopPosition = headerHeight + 8; // Minimum top position to avoid header

        // Calculate position based on preferred position and available space
        if (position === 'top') {
          const spaceAbove = wrapperRect.top;
          if (spaceAbove < tooltipRect.height + 20 || wrapperRect.top < minTopPosition) {
            newPosition = 'bottom';
            top = wrapperRect.bottom + 16;
          } else {
            top = wrapperRect.top - tooltipRect.height - 16;
          }
          left = wrapperRect.left + wrapperRect.width / 2;
        } else if (position === 'bottom') {
          const spaceBelow = viewportHeight - wrapperRect.bottom;
          if (spaceBelow < tooltipRect.height + 20) {
            newPosition = 'top';
            // Ensure tooltip doesn't go above header
            const calculatedTop = wrapperRect.top - tooltipRect.height - 16;
            top = calculatedTop < minTopPosition ? wrapperRect.bottom + 16 : calculatedTop;
            if (calculatedTop < minTopPosition) {
              newPosition = 'bottom';
            }
          } else {
            top = wrapperRect.bottom + 16;
          }
          left = wrapperRect.left + wrapperRect.width / 2;
        } else if (position === 'left') {
          const spaceLeft = wrapperRect.left;
          if (spaceLeft < tooltipRect.width + 20) {
            newPosition = 'right';
            left = wrapperRect.right + 8;
          } else {
            left = wrapperRect.left - tooltipRect.width - 8;
          }
          top = wrapperRect.top + wrapperRect.height / 2;
        } else if (position === 'right') {
          const spaceRight = viewportWidth - wrapperRect.right;
          if (spaceRight < tooltipRect.width + 20) {
            newPosition = 'left';
            left = wrapperRect.left - tooltipRect.width - 8;
          } else {
            left = wrapperRect.right + 8;
          }
          top = wrapperRect.top + wrapperRect.height / 2;
        }

        // Ensure tooltip stays within viewport bounds
        // For top/bottom, account for transform translateX(-50%)
        if (newPosition === 'top' || newPosition === 'bottom') {
          const minLeft = tooltipRect.width / 2 + 8;
          const maxLeft = viewportWidth - tooltipRect.width / 2 - 8;
          left = Math.max(minLeft, Math.min(left, maxLeft));
        } else {
          // For left/right, account for transform translateY(-50%)
          const minTop = tooltipRect.height / 2 + 8;
          const maxTop = viewportHeight - tooltipRect.height / 2 - 8;
          top = Math.max(minTop, Math.min(top, maxTop));
        }

        // Additional bounds check - ensure tooltip doesn't go above header
        if (newPosition === 'left' || newPosition === 'right') {
          left = Math.max(8, Math.min(left, viewportWidth - tooltipRect.width - 8));
          top = Math.max(minTopPosition, Math.min(top, viewportHeight - tooltipRect.height - 8));
        }
        if (newPosition === 'top' || newPosition === 'bottom') {
          top = Math.max(minTopPosition, Math.min(top, viewportHeight - tooltipRect.height - 8));
        }

        setActualPosition(newPosition);
        setTooltipStyle({
          top: `${top}px`,
          left: `${left}px`,
        });
      };

      // Initial position calculation
      updatePosition();

      // Update on scroll/resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible, position]);

  const tooltipElement = isVisible ? (
    <div
      ref={tooltipRef}
      className={`tooltip-content tooltip-${actualPosition}`}
      style={tooltipStyle}
    >
      {content}
    </div>
  ) : null;

  return (
    <>
      <div
        ref={wrapperRef}
        className="tooltip-wrapper"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && typeof document !== 'undefined' && createPortal(tooltipElement, document.body)}
    </>
  );
};

export default Tooltip;
