import React, { useState, useRef, useEffect } from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBox from '../ChatBox/ChatBox';

const ChatWidget: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  

  const [position, setPosition] = useState({ x: window.innerWidth -75, y: 660 });
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  

  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragThreshold = 5; // pixels

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };


  const handleMouseDown = (e: React.MouseEvent) => {
    if (widgetRef.current) {
      const boundingRect = widgetRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - boundingRect.left,
        y: e.clientY - boundingRect.top,
      });
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
      
      setIsDragging(true);
      e.stopPropagation(); 
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
     
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
     
      const dragDistance = Math.sqrt(
        Math.pow(e.clientX - dragStart.x, 2) + 
        Math.pow(e.clientY - dragStart.y, 2)
      );
      
      
      
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <Box
        ref={widgetRef}
        sx={{
          position: 'fixed',
          top: `${position.y}px`,
          left: `${position.x}px`,
          zIndex: 1000,
          userSelect: 'none',
          transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Tooltip title={isDragging ? "Dragging.." : (isChatOpen ? "Close chat" : "Chat with AI")}>
          <Fab
            color="primary"
            aria-label="chat"
            sx={{
              backgroundImage: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: isDragging 
                ? '0px 8px 16px rgba(0,0,0,0.3)' 
                : '0px 6px 16px rgba(99, 102, 241, 0.4)',
              cursor: isDragging ? 'grabbing' : 'pointer',
              height: 60,
              width: 60,
              '&:hover': {
                boxShadow: '0px 8px 20px rgba(99, 102, 241, 0.5)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease',
            }}
            onClick={handleToggleChat}
            onMouseDown={handleMouseDown}
          >
            <ChatIcon sx={{ fontSize: 28 }} />
          </Fab>
        </Tooltip>
      </Box>
      {isChatOpen && <ChatBox isOpen={isChatOpen} onClose={handleCloseChat} position={position} />}
    </>
  );
};

export default ChatWidget;