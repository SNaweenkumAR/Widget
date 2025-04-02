import React, { useState, useRef, useEffect } from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBox from '../ChatBox/ChatBox';

const ChatWidget: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Position state for the widget
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Track drag distance to differentiate between drag and click
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragThreshold = 5; // pixels

  const handleToggleChat = () => {
    if (!isDragging) {
      setIsChatOpen(!isChatOpen);
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // Drag handlers for the widget
  const handleMouseDown = (e: React.MouseEvent) => {      
    if (widgetRef.current) {
      const boundingRect = widgetRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - boundingRect.left,
        y: e.clientY - boundingRect.top,
      });
      
      // Record start position to calculate drag distance
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
      
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep widget within viewport bounds
      const maxX = window.innerWidth - (widgetRef.current?.offsetWidth || 60);
      const maxY = window.innerHeight - (widgetRef.current?.offsetHeight || 60);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (isDragging) {
      // Calculate drag distance
      const dragDistance = Math.sqrt(
        Math.pow(e.clientX - dragStart.x, 2) + 
        Math.pow(e.clientY - dragStart.y, 2)
      );
      
      // If drag distance is small, treat as click
      if (dragDistance < dragThreshold) {
        setIsChatOpen(!isChatOpen);
      }
      
      setIsDragging(false);
    }
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isChatOpen]);

  return (
    <>
      <Box
        ref={widgetRef}
        sx={{
          position: 'fixed',
          top: `${position.y}px`,
          left: `${position.x}px`,
          zIndex: 1000,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          transition: isDragging ? 'none' : 'box-shadow 0.3s ease',
        }}
        onMouseDown={handleMouseDown}
      >
        <Tooltip title={isDragging ? "Dragging.." : (isChatOpen ? "Close chat" : "Chat with AI")}>
          <Fab
            color="primary"
            aria-label="chat"
            sx={{
              boxShadow: isDragging ? '0px 6px 12px rgba(0,0,0,0.3)' : 3,
            }}
          >
            <ChatIcon />
          </Fab>
        </Tooltip>
      </Box>
      <ChatBox isOpen={isChatOpen} onClose={handleCloseChat} />
    </>
  );
};

export default ChatWidget;