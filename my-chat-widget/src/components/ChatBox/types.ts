export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }
  
  export interface ChatBoxProps {
    isOpen: boolean;
    onClose: () => void;
  }