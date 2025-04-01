import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAi = message.sender === 'ai';
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isAi ? 'flex-start' : 'flex-end',
        mb: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          maxWidth: '80%',
          backgroundColor: isAi ? 'grey.100' : 'primary.main',
          color: isAi ? 'text.primary' : 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1, textAlign: isAi ? 'left' : 'right', opacity: 0.7 }}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage;