import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { sessionSelect, useAppSelector } from '../store';
import { useNavigate } from 'react-router-dom';

function SearchConvos() {
  const [searchQuery, setSearchQuery] = useState('');
  const { sessions } = useAppSelector(sessionSelect);
  const navigate = useNavigate();
  return (
    <div className="flex-1 bg-background text-foreground p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search</h1>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search for chats"
            className="w-full rounded-full bg-muted py-6 pl-12 pr-4 text-base"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Recent</h2>
          <ScrollArea className=" h-[45vh] pr-2">
            <div className="space-y-2">
              {sessions
                .filter((item) =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => navigate(`/app/${item.id}`)}>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default SearchConvos;
