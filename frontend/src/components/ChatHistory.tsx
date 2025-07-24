// src/components/ChatHistory.tsx
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import TypingLoader from './TypingLoader';
import type { Message as MessageType } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Code } from 'lucide-react';

interface ChatHistoryProps {
  messages: MessageType[];
  streamingResponse: string;
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

const suggestionCards = [
  {
    icon: <Lightbulb size={24} />,
    text: 'What are the current market trends in tech stocks?',
    intent: 'Regulatory',
  },

  {
    icon: <Lightbulb size={24} />,
    text: 'Explain recent developments in financial markets',
    intent: 'Regulatory',
  },
];

function ChatHistory({
  messages,
  streamingResponse,
  isLoading,
  onSuggestionClick,
}: ChatHistoryProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingResponse]);

  return (
    <ScrollArea className="h-[60vh] flex-grow px-4 pt-4">
      <div className="max-w-4xl mx-auto w-full">
        {messages.length === 0 && !isLoading ? (
          // --- Welcome Screen with Suggestions ---
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
                  className="p-4 hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => onSuggestionClick(card.text)} // Make cards clickable
                >
                  <CardContent className="flex items-center gap-4 p-0">
                    {card.icon}
                    <p className="font-medium">{card.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <ChatMessage key={`${msg.role}-${index}`} message={msg} />
            ))}

            {streamingResponse && (
              <ChatMessage
                key="streaming"
                message={{
                  role: 'assistant',
                  content: streamingResponse,
                }}
              />
            )}

            {isLoading && !streamingResponse && <TypingLoader />}
            <div ref={scrollAreaRef} />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export default ChatHistory;
