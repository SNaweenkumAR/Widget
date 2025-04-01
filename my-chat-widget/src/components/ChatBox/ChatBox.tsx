import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Drawer,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatMessage from './ChatMessage';
import { ChatBoxProps } from './types';
import useChatMessages from '../../hooks/useChatMessages';
  
const ChatBox: React.FC<ChatBoxProps> = ({ isOpen, onClose }) => {
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

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
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
        }}
      >
        <Typography variant="h6">AI Assistant</Typography>
        <Box>
          <IconButton onClick={clearMessages} color="primary" size="small" sx={{ mr: 1 }}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={onClose} color="default" size="small">
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
    </Drawer>
  );
};

export default ChatBox;