// src/components/PromptInput.tsx
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowUp, BookCheck, Building, MessageSquareQuote } from 'lucide-react';

const INTENTS = [
  { name: 'Regulatory', icon: <BookCheck className="mr-2 h-4 w-4" /> },
  { name: 'Internal', icon: <Building className="mr-2 h-4 w-4" /> },
  { name: 'Speech', icon: <MessageSquareQuote className="mr-2 h-4 w-4" /> },
];

interface PromptInputProps {
  onSendMessage: (text: string) => void;
  currentIntent: string;
  onIntentChange: (intent: string) => void;
  isLoading: boolean;
}
function PromptInput({
  onSendMessage,
  currentIntent,
  onIntentChange,
  isLoading,
}: PromptInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex justify-center p-4 md:p-6">
      <div className="relative w-full max-w-4xl">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a prompt here"
          className="rounded-2xl p-4 pb-18 pr-12 min-h-[56px] resize-none"
        />
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          {INTENTS.map((intent) => (
            <Button
              key={intent.name}
              variant={currentIntent === intent.name ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onIntentChange(intent.name)}
              className="rounded-full">
              {intent.icon}
              {intent.name}
            </Button>
          ))}
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSend}
                  disabled={!text || isLoading}>
                  <ArrowUp className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export default PromptInput;
