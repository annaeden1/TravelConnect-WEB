export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatStylingProps {
  userIcon?: React.ReactNode;
  assistantIcon?: React.ReactNode;
  userLabel?: string;
  assistantLabel?: string;
  userBgColor?: string;
  assistantBgColor?: string;
  userAvatarColor?: string;
  assistantAvatarColor?: string;
}
