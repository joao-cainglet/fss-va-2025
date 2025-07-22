// src/components/ChatPanel.tsx
import { useState } from 'react';
import ChatHistory from './ChatHistory';
import PromptInput from './PromptInput';
import type { Message } from '../types'; // We will create this type definition

function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate Gemini response
    setTimeout(() => {
      const botResponse = `Hello! You said: **${text}**. Here is an example of a feature you can build:

A code block:
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('Developer');
\`\`\`

And a list:
- First item
- Second item
- Third item
`;
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1500);
  };

  return (
    <div className="relative flex flex-col h-screen justify-between">
      <div className=" p-6 sticky top-0 bg-white shadow-md z-10 flex items-center justify-between">
        BSP AI
      </div>
      <ChatHistory messages={messages} />
      <PromptInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default ChatPanel;
