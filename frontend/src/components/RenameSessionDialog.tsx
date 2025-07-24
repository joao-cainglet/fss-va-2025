import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ChatSession } from '../types'; // Assuming you have a Session type

interface RenameSessionDialogProps {
  session: ChatSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sessionId: string, newTitle: string) => void;
}

function RenameSessionDialog({
  session,
  isOpen,
  onClose,
  onSave,
}: RenameSessionDialogProps) {
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (session) {
      setNewTitle(session.title);
    }
  }, [session]);

  const handleSave = () => {
    if (session && newTitle.trim()) {
      onSave(session.id, newTitle.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Session</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={newTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTitle(e.target.value)
            }
            placeholder="Enter new session title"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && handleSave()
            }
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RenameSessionDialog;
