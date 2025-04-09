import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import ChatWidget from './components/ChatWidget/ChatWidget';

const App: React.FC = () => {
  const [count ,setCount] = useState<number>(0);
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <h1>My Application</h1>
        <p>This is a sample application with a chat widget in the top right corner.</p>
        <ChatWidget />
        <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
        </button>
      </Box>
    </Container>
  );
};

export default App;