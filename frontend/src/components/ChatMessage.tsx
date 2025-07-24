import { Avatar } from '@/components/ui/avatar';
import type { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatMessageProps {
  message: Message;
}
function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'assistant';
  return (
    <div className={cn('flex items-start gap-4', !isBot && 'justify-end')}>
      {isBot && (
        <Avatar className="h-8 w-8">
          <Bot className="h-5 w-5" />
        </Avatar>
      )}

      <div
        className={cn(
          'max-w-[75%] rounded-lg px-4 py-2 text-sm',
          isBot ? 'bg-muted' : 'bg-primary text-primary-foreground'
        )}>
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>

      {!isBot && (
        <Avatar className="h-8 w-8">
          <User className="h-5 w-5" />
        </Avatar>
      )}
    </div>
  );
}

export default ChatMessage;
