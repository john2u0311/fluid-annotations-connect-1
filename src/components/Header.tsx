
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Book, Upload, Download, Settings, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Header = () => {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Book className="h-6 w-6 text-fluid-blue mr-2" />
            <h1 className="text-xl font-bold text-fluid-blue">FluidDocs</h1>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Workspaces
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Documents
          </Button>
        </div>
        
        <div className="flex items-center space-x-4 max-w-sm flex-1 mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="w-full pl-8 bg-muted/50"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Upload className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
