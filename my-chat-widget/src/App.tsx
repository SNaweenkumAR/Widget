import React from 'react';
import { Container, Box } from '@mui/material';
import ChatWidget from './components/ChatWidget/ChatWidget';

const App: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <h1>My Application</h1>
        <p>This is a sample application with a chat widget in the top right corner.</p>
        <ChatWidget />
      </Box>
    </Container>
  );
};

export default App;