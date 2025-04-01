import React, { useState } from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBox from '../ChatBox/ChatBox';

const ChatWidget: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Chat with AI">
          <Fab
            color="primary"
            aria-label="chat"
            onClick={handleToggleChat}
            sx={{
              boxShadow: 5,
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