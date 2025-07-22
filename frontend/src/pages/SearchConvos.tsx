import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { useState } from 'react';

const recentSearches = [
  { id: '1', title: 'Initial Greeting and Assistance Offered', date: 'Today' },
  { id: '2', title: 'Simple Greeting and Response', date: 'Today' },
  {
    id: '3',
    title: 'FastAPI and Azure Cosmos DB Integration',
    date: 'Yesterday',
  },
  { id: '4', title: 'React Code Generation Agent Methods', date: 'Jul 16' },
];

function SearchConvos() {
  const [searchQuery, setSearchQuery] = useState('');
  console.log('Search query:', searchQuery);
  return (
    <div className="flex-1 bg-background text-foreground p-6 md:p-8 lg:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search</h1>

        <div className="relative mb-10">
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
          <ScrollArea className=" h-[50vh] pr-2">
            <div className="space-y-2">
              {recentSearches
                .filter((item) =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
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
