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

export interface Position {
  x: number;
  y: number;
}

export interface DragOffset {
  x: number;
  y: number;
}