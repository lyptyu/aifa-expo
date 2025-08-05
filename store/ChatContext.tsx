import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { initializeChat } from '@/utils/chat';

interface ChatContextType {
  unreadMessageCount: number;
  setUnreadMessageCount: (count: number) => void;
  resetUnreadMessageCount: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);

  // 初始化聊天功能，连接chat.ts和ChatContext
  useEffect(() => {
    initializeChat(setUnreadMessageCount);
  }, []);

  const resetUnreadMessageCount = () => {
    setUnreadMessageCount(0);
  };

  return (
    <ChatContext.Provider value={{
      unreadMessageCount,
      setUnreadMessageCount,
      resetUnreadMessageCount
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}