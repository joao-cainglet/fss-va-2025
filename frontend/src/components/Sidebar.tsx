import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Plus,
  MoreHorizontal,
  Trash,
  Pencil,
  Search,
  AlignJustify,
} from 'lucide-react';
import { useState } from 'react';
import { sessionSelect, useAppDispatch, useAppSelector } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { setCurrentSession } from '../store/SessionSlice';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const handleRename = (id: string) => {};

  const [hoverCollapse, setHoverCollapse] = useState(true);
  const { sessions, activeSession } = useAppSelector(sessionSelect);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSelectChat = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.dataset.sessionid;
    if (id) {
      dispatch(setCurrentSession(id));
      navigate(`/app/${id}`);
    }
  };

  const onNewChat = () => {
    dispatch(setCurrentSession(''));
    navigate(`/app`);
  };

  const onDeleteChat = (id: string) => {};

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
            <Link to="/search">
              <Search className=" h-4 w-4 text-muted-foreground" />
            </Link>
          )}
        </div>

        <div
          className=" h-full"
          onMouseEnter={() => {
            if (isCollapsed) {
              setHoverCollapse(false);
            }
          }}>
          <Button onClick={onNewChat} className="w-full justify-start gap-2">
            <Plus className="h-5 w-5" />
            {(!isCollapsed || !hoverCollapse) && 'New Chat'}
          </Button>

          {(!isCollapsed || !hoverCollapse) && (
            <div className="flex-grow mt-4">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Recent
              </h2>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      data-sessionid={session.id}
                      className={cn(
                        'justify-start gap-2 truncate flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer',
                        activeSession === session.id &&
                          'bg-accent text-accent-foreground'
                      )}
                      onClick={onSelectChat}>
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate flex-grow ">
                        {session.title}
                      </span>

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
