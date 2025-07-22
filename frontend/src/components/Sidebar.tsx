// src/components/Sidebar.tsx
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Plus,
  MoreHorizontal,
  Trash,
  Pencil,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  AlignJustify,
} from 'lucide-react';
import { useState } from 'react';

// Define the shape of a chat session for type safety
interface ChatSession {
  id: string;
  title: string;
}

// Define the props the Sidebar component will accept
interface SidebarProps {
  isCollapsed: boolean;
  activeChatId: string | null;
  chatHistory: ChatSession[];
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onToggleCollapse: () => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
}

function Sidebar({
  isCollapsed,
  activeChatId,
  chatHistory,
  onNewChat,
  onSelectChat,
  onToggleCollapse,
  onRenameChat,
  onDeleteChat,
}: SidebarProps) {
  const handleRename = (id: string) => {
    const newTitle = prompt('Enter new chat title:');
    if (newTitle) {
      onRenameChat(id, newTitle);
    }
  };

  const [hoverCollapse, setHoverCollapse] = useState(true);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        onMouseLeave={() => {
          setHoverCollapse(true);
        }}
        className={cn(
          'hidden md:flex flex-col bg-muted/50 transition-all duration-300 ease-in-out p-4',
          isCollapsed && hoverCollapse ? 'w-18' : 'w-64'
        )}>
        {/* Header with Search and Collapse Toggle */}
        <div className={cn('flex items-center py-4 gap-2 justify-between')}>
          <Button
            onClick={() => {
              if (isCollapsed) {
                setHoverCollapse(false);
              } else {
                setHoverCollapse(true);
              }
              onToggleCollapse();
            }}
            variant="ghost"
            size="icon">
            <AlignJustify className="h-5 w-5" />
          </Button>
          {(!isCollapsed || !hoverCollapse) && (
            <Search className=" h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div
          className=" h-full"
          onMouseEnter={() => {
            if (isCollapsed) {
              setHoverCollapse(false);
            }
          }}>
          {/* New Chat Button */}
          <Button onClick={onNewChat} className="w-full justify-start gap-2">
            <Plus className="h-5 w-5" />
            {(!isCollapsed || !hoverCollapse) && 'New Chat'}
          </Button>

          {/* Chat History */}
          {(!isCollapsed || !hoverCollapse) && (
            <div className="flex-grow mt-4">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Recent
              </h2>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-1">
                  {chatHistory.map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        'justify-start gap-2 truncate flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer',
                        activeChatId === session.id &&
                          'bg-accent text-accent-foreground'
                      )}
                      onClick={() => onSelectChat(session.id)}>
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate flex-grow ">
                        {session.title}
                      </span>

                      {/* More Options Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleRename(session.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteChat(session.id)}
                            className="text-red-500">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

export default Sidebar;
