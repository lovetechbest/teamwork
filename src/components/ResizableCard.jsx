import React, { useState, useEffect, useRef } from 'react';
import './ResizableCard.css';

const ResizableCard = ({ children, cardId, defaultHeight = null, minHeight = 100 }) => {
  const [height, setHeight] = useState(defaultHeight);
  const [isResizing, setIsResizing] = useState(false);
  const cardRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // Load saved height from localStorage on mount
  useEffect(() => {
    const savedHeight = localStorage.getItem(`card-height-${cardId}`);
    if (savedHeight) {
      const parsedHeight = parseInt(savedHeight, 10);
      if (parsedHeight >= minHeight) {
        setHeight(parsedHeight);
      }
    }
  }, [cardId, minHeight]);

  // Save height to localStorage whenever it changes
  useEffect(() => {
    if (height >= minHeight) {
      localStorage.setItem(`card-height-${cardId}`, height.toString());
    }
  }, [height, cardId, minHeight]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startYRef.current;
      const newHeight = Math.max(minHeight, startHeightRef.current + deltaY);
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minHeight]);

  const style = height !== null 
    ? { height: `${height}px`, minHeight: `${minHeight}px` }
    : { minHeight: `${minHeight}px` };

  return (
    <div 
      ref={cardRef}
      className={`resizable-card ${isResizing ? 'resizing' : ''}`}
      style={style}
    >
      {children}
      <div 
        className="resize-handle"
        onMouseDown={handleMouseDown}
        title="Drag to resize"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13 13L3 3M3 13L13 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
};

export default ResizableCard;
