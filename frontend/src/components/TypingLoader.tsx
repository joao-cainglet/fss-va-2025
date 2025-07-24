// src/components/TypingLoader.tsx
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function TypingLoader() {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2 h-10">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

export default TypingLoader;
