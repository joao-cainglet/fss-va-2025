// src/components/ChatHistory.tsx
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Code } from 'lucide-react';
import type { Message as MessageType } from '../types';
import ChatMessage from './ChatMessage';

interface ChatHistoryProps {
  messages: MessageType[];
}

function ChatHistory({ messages }: ChatHistoryProps) {
  const suggestionCards = [
    { icon: <Lightbulb />, text: 'Explain the latest AI trends' },
    { icon: <Code />, text: 'Generate a React component for a login form' },
  ];

  return (
    <ScrollArea className=" h-[70vh] flex-grow px-4 pt-4">
      <div className="max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Hello, User
            </h1>
            <p className="text-muted-foreground text-lg">
              How can I help you today?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
              {suggestionCards.map((card, i) => (
                <Card
                  key={i}
                  className="p-4 hover:bg-muted cursor-pointer transition-colors">
                  <CardContent className="flex items-center gap-4 p-0">
                    {card.icon}
                    <p>{card.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export default ChatHistory;
