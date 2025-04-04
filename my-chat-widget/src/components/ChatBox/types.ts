export interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  position: {
    x: number;
    y: number;
  };
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  files?: File[];
}