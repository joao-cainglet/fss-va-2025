// src/components/ChatMessage.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}
function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';

  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-8 w-8">
        {isBot ? (
          <Bot className="h-full w-full p-1" />
        ) : (
          <User className="h-full w-full p-1" />
        )}
      </Avatar>
      <div className="flex-1 space-y-2">
        <p className="font-bold">{isBot ? 'Gemini' : 'You'}</p>
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}>
            {message.text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
