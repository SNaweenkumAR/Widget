import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Badge,
  Chip,
  alpha,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatMessage from './ChatMessage';
import { ChatBoxProps } from './types';
import useChatMessages from '../../hooks/useChatMessages';

const ChatBox: React.FC<ChatBoxProps> = ({ isOpen, onClose, position }) => {
  const [inputValue, setInputValue] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const { messages, isLoading, addMessage, addMessageWithFiles, clearMessages } = useChatMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if ((inputValue.trim() || attachedFiles.length > 0) && !isLoading) {
      if (attachedFiles.length > 0) {
        addMessageWithFiles(inputValue, attachedFiles);
      } else {
        addMessage(inputValue);
      }
      setInputValue('');
      setAttachedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachedFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setAttachedFiles(prevFiles => 
      prevFiles.filter(file => file !== fileToRemove)
    );
  };

  if (!isOpen) return null;

  // Calculate the position of the chat box based on widget position
  let chatBoxStyle = {};
  const chatBoxWidth = 350;
  const chatBoxHeight = 500;
  
  // Check if widget is near the bottom of the screen
  const bottomThreshold = window.innerHeight - 250; // Consider bottom 200px as "bottom of screen"
  
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
        boxShadow: '0px 12px 28px rgba(0, 0, 0, 0.25)',
        zIndex: 1100,
        bgcolor: 'background.paper',
        borderRadius: 3,
        overflow: 'hidden',
        animation: 'fadeIn 0.3s ease',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 0,
          backgroundImage: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>AI Assistant</Typography>
        <Box>
          <IconButton 
            onClick={clearMessages} 
            color="inherit" 
            size="small" 
            sx={{ 
              mr: 1, 
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton 
            onClick={onClose} 
            color="inherit" 
            size="small"
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
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
          backgroundColor: alpha('#f8fafc', 0.7),
          backgroundImage: 'radial-gradient(circle at 25px 25px, #f0f4f8 2%, transparent 0%), radial-gradient(circle at 75px 75px, #f0f4f8 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Attached Files Preview */}
      {attachedFiles.length > 0 && (
        <Box
          sx={{
            p: 1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            maxHeight: '80px',
            overflowY: 'auto',
          }}
        >
          {attachedFiles.map((file, index) => (
            <Chip
              key={index}
              label={file.name.length > 15 ? `${file.name.substring(0, 12)}...` : file.name}
              onDelete={() => handleRemoveFile(file)}
              size="small"
              sx={{ 
                maxWidth: '100%',
                borderRadius: '4px',
                backgroundColor: alpha('#6366F1', 0.1),
                '& .MuiChip-deleteIcon': {
                  color: '#6366F1'
                }
              }}
            />
          ))}
        </Box>
      )}
      
      {/* Input Area */}
      <Paper
        elevation={0}
        component="form"
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: alpha('#f8fafc', 0.9),
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          multiple
        />
        
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Badge badgeContent={attachedFiles.length} color="primary" invisible={attachedFiles.length === 0}>
                  <IconButton 
                    edge="start" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    sx={{ 
                      p: 0.5,
                      color: '#6366F1',
                      '&:hover': {
                        backgroundColor: alpha('#6366F1', 0.1)
                      }
                    }}
                  >
                    <AttachFileIcon fontSize="small" />
                  </IconButton>
                </Badge>
              </InputAdornment>
            )
          }}
          sx={{ 
            mr: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8B5CF6',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366F1',
                borderWidth: 2
              }
            }
          }}
        />
        
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: '#8B5CF6' }} />
        ) : (
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && attachedFiles.length === 0}
            sx={{ 
              backgroundColor: '#6366F1',
              color: 'white',
              '&:hover': {
                backgroundColor: '#8B5CF6',
              },
              '&.Mui-disabled': {
                backgroundColor: alpha('#6366F1', 0.3),
                color: 'white'
              }
            }}
          >
            <SendIcon />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
};

export default ChatBox;