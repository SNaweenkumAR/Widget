import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatMessage from './ChatMessage';
import { ChatBoxProps } from './types';
import useChatMessages from '../../hooks/useChatMessages';

const ChatBox: React.FC<ChatBoxProps> = ({ isOpen, onClose, position }) => {
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, addMessage, clearMessages } = useChatMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      addMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  // Calculate the position of the chat box based on widget position
  let chatBoxStyle = {};
  const chatBoxWidth = 350;
  const chatBoxHeight = 500;
  
  // Check if widget is near the bottom of the screen
  const bottomThreshold = window.innerHeight - 200; // Consider bottom 200px as "bottom of screen"
  
  if (position.y > bottomThreshold) {
    // Widget is at bottom - open chat above the widget
    chatBoxStyle = {
      bottom: window.innerHeight - position.y + 20,
      left: position.x - chatBoxWidth / 2
    };
  } else if (position.x < window.innerWidth / 2) {
    // Widget is on left side (and not at bottom) - open chat to the right
    chatBoxStyle = {
      left: position.x + 70,
      top: position.y
    };
  } else {
    // Widget is on right side (and not at bottom) - open chat to the left
    chatBoxStyle = {
      right: window.innerWidth - position.x + 20,
      top: position.y
    };
  }
  
  // Safety check to ensure chatbox is always visible
  // If chatbox would go off-screen to the left
  if (position.x - chatBoxWidth / 2 < 0 && position.y > bottomThreshold) {
    chatBoxStyle = {
      bottom: window.innerHeight - position.y + 20,
      left: 10
    };
  }
  
  // If chatbox would go off-screen to the right
  if (position.x + chatBoxWidth / 2 > window.innerWidth && position.y > bottomThreshold) {
    chatBoxStyle = {
      bottom: window.innerHeight - position.y + 20,
      right: 10
    };
  }
  
  return (
    <Box
      sx={{
        position: 'fixed',
        ...chatBoxStyle,
        width: chatBoxWidth,
        height: chatBoxHeight,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 6,
        zIndex: 1100,
        bgcolor: 'background.paper',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 0,
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Typography variant="h6">AI Assistant</Typography>
        <Box>
          <IconButton onClick={clearMessages} color="inherit" size="small" sx={{ mr: 1 }}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={onClose} color="inherit" size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Paper>
      
      {/* Messages Container */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
          backgroundColor: 'background.default',
        }}
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Input Area */}
      <Paper
        elevation={3}
        component="form"
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 0,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          disabled={isLoading}
          autoFocus
          multiline
          maxRows={4}
          sx={{ mr: 1 }}
        />
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <SendIcon />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
};

export default ChatBox;