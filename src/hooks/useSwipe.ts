import { useState, useRef, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 100 }: SwipeHandlers) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    startPosition.current = { x: clientX, y: clientY };
    setDragPosition({ x: 0, y: 0 });
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - startPosition.current.x;
    const deltaY = clientY - startPosition.current.y;
    setDragPosition({ x: deltaX, y: deltaY });
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;

    const { x } = dragPosition;
    
    if (Math.abs(x) > threshold) {
      if (x > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    setIsDragging(false);
    setDragPosition({ x: 0, y: 0 });
  }, [isDragging, dragPosition, threshold, onSwipeLeft, onSwipeRight]);

  const handlers = {
    onMouseDown: (e: React.MouseEvent) => handleStart(e.clientX, e.clientY),
    onMouseMove: (e: React.MouseEvent) => handleMove(e.clientX, e.clientY),
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
    onTouchMove: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    onTouchEnd: handleEnd,
  };

  const getTransform = () => {
    const rotation = dragPosition.x * 0.1;
    return `translate(${dragPosition.x}px, ${dragPosition.y}px) rotate(${rotation}deg)`;
  };

  const getOpacity = () => {
    const maxDistance = 150;
    const distance = Math.abs(dragPosition.x);
    return Math.max(0.3, 1 - (distance / maxDistance));
  };

  return {
    handlers,
    isDragging,
    dragPosition,
    elementRef,
    getTransform,
    getOpacity,
  };
}