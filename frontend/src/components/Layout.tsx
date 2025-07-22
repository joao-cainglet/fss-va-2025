import { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

// Mock data for chat history
const initialChatHistory = [
  { id: '1', title: 'React component generation for a complex form' },
  { id: '2', title: 'Explain quantum computing in simple terms' },
  { id: '3', title: 'Dinner ideas for tonight: Italian cuisine' },
];

function Layout() {
  const [chatHistory, setChatHistory] = useState(initialChatHistory);
  const [activeChatId, setActiveChatId] = useState<string | null>('1');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat Session',
    };
    setChatHistory((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleDeleteChat = (id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id));
    // If the active chat is deleted, set active chat to null or the next one
    if (activeChatId === id) {
      setActiveChatId(null);
    }
    console.log('Deleted chat:', id);
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, title: newTitle } : chat))
    );
    console.log(`Renamed chat ${id} to "${newTitle}"`);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        isCollapsed={isCollapsed}
        activeChatId={activeChatId}
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onToggleCollapse={handleToggleCollapse}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      <main className="flex-1 flex flex-col">
        {/* The ChatPanel would also need the activeChatId to load messages */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
