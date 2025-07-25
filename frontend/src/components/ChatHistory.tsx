// src/components/ChatHistory.tsx
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import TypingLoader from './TypingLoader';
import type { Message as MessageType } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Code, Mic, BookText, Building } from 'lucide-react';
import { CardHeader, CardTitle } from './ui/card';

interface ChatHistoryProps {
  messages: MessageType[];
  streamingResponse: string;
  isLoading: boolean;
  onSuggestionClick: (suggestion: string, intent: string) => void;
}

const suggestionCards = [
  {
    icon: <BookText className="h-6 w-6 text-primary" />,
    title: 'Regulatory Search',
    text: 'Summarize the key changes in the latest circular on digital banking.',
    intent: 'Regulatory',
  },
  {
    icon: <Mic className="h-6 w-6 text-primary" />,
    title: 'Speechwriting Support',
    text: 'Draft opening remarks for a speech on financial stability.',
    intent: 'Speech',
  },
  {
    icon: <Building className="h-6 w-6 text-primary" />,
    title: 'Internal Knowledge',
    text: 'What are the guidelines for conducting a risk assessment?',
    intent: 'Internal',
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
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-3">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 36C17.38 36 12 30.62 12 24S17.38 12 24 12C30.62 12 36 17.38 36 24S30.62 36 24 36Z"
                  fill="hsl(var(--primary))"
                />
              </svg>
              <h1 className="text-3xl font-bold">FSS Virtual Assistant</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Your AI-powered assistant for regulatory insights, speechwriting,
              and internal knowledge.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-6">
              {suggestionCards.map((card) => (
                <Card
                  key={card.title}
                  className="p-4 hover:bg-muted cursor-pointer transition-colors text-left"
                  onClick={() => onSuggestionClick(card.text, card.intent)}>
                  <CardHeader className="p-2">
                    <div className="flex items-center gap-3">
                      {card.icon}
                      <CardTitle className="text-base font-semibold">
                        {card.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2">
                    <p className="text-sm text-muted-foreground">{card.text}</p>
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
