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
  Trash,
  Pencil,
  Search,
  AlignJustify,
  MoreVertical,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { sessionSelect, useAppDispatch, useAppSelector } from '../store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  setCurrentSession,
  fetchAllSessionsThunk,
} from '../store/SessionSlice';
import RenameSessionDialog from './RenameSessionDialog';
import type { ChatSession } from '../types';
import client from '../api/client';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const [hoverCollapse, setHoverCollapse] = useState(true);
  const { sessions, activeSession } = useAppSelector(sessionSelect);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [sessionToRename, setSessionToRename] = useState<ChatSession | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDeleteId, setSessionToDeleteId] = useState<string | null>(
    null
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSelectChat = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.dataset.sessionid;
    if (id) {
      dispatch(setCurrentSession(id));
      navigate(`/app/${id}`);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSessionToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (sessionToDeleteId) {
      try {
        await client.delete(`/sessions/${sessionToDeleteId}`);
        const currentSessionId =
          window.location.pathname.split('/').pop() || '';
        dispatch(fetchAllSessionsThunk());
        if (sessionToDeleteId === currentSessionId) {
          navigate('/app');
        }
      } catch (error) {
        console.log('Error deleting session', error);
      }
    }
    setIsDeleteDialogOpen(false); // Close the dialog
  };

  const handleRenameClick = (session: ChatSession) => {
    setSessionToRename(session);
    setIsRenameDialogOpen(true);
  };

  const handleSaveRename = async (sessionId: string, newTitle: string) => {
    try {
      await client.patch(`/sessions/${sessionId}/rename`, { title: newTitle });
      dispatch(fetchAllSessionsThunk());
      setIsRenameDialogOpen(false);
    } catch (error) {
      console.error('Failed to rename session:', error);
    }
  };

  const onNewChat = () => {
    dispatch(setCurrentSession(''));
    navigate(`/app`);
  };

  useEffect(() => {
    dispatch(fetchAllSessionsThunk());
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        onMouseLeave={() => {
          setHoverCollapse(true);
        }}
        className={cn(
          'hidden md:flex flex-col bg-muted/50 transition-all duration-300 ease-in-out p-4',
          isCollapsed && hoverCollapse ? 'w-18' : 'w-72'
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
              <h2 className="text-sm mb-4 font-semibold text-muted-foreground">
                Recent
              </h2>
              <ScrollArea className="h-[calc(100vh-200px)] -mr-2 pr-2">
                <div className="space-y-1">
                  {sessions.slice(0, 20).map((session) => (
                    <Tooltip key={session.id}>
                      <TooltipTrigger asChild>
                        <div
                          data-sessionid={session.id}
                          className={cn(
                            'justify-start gap-2 group truncate flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer',
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
                                onClick={(e) => e.stopPropagation()}
                                className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRenameClick(session);
                                }}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(session.id);
                                }}
                                className="text-red-500">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{session.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </aside>
      <RenameSessionDialog
        session={sessionToRename}
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        onSave={handleSaveRename}
      />
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </TooltipProvider>
  );
}

export default Sidebar;
