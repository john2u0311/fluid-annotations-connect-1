
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Folder, FileText, Plus } from 'lucide-react';

const DocumentItem = ({ title, isActive = false }: { title: string; isActive?: boolean }) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    className={`w-full justify-start mb-1 ${isActive ? 'bg-accent/30' : ''}`}
  >
    <FileText className="mr-2 h-4 w-4" />
    <span className="truncate">{title}</span>
  </Button>
);

const FolderItem = ({ name, isOpen = false }: { name: string; isOpen?: boolean }) => (
  <div className="mb-2">
    <Button variant="ghost" className="w-full justify-start font-semibold">
      <Folder className="mr-2 h-4 w-4" />
      <span>{name}</span>
    </Button>
    {isOpen && (
      <div className="ml-4 mt-1 border-l pl-3">
        <DocumentItem title="Research Paper.pdf" />
        <DocumentItem title="Meeting Notes.pdf" />
        <DocumentItem title="Project Proposal.pdf" isActive />
      </div>
    )}
  </div>
);

const DocumentSidebar = () => {
  return (
    <div className="w-[250px] border-r bg-card h-full flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-semibold">Documents</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="pb-4">
          <Card className="p-3 mb-4 bg-accent/10 border border-accent/20">
            <h3 className="text-sm font-medium mb-2">Recent Documents</h3>
            <DocumentItem title="Research Paper.pdf" />
            <DocumentItem title="Design Specs.pdf" />
            <DocumentItem title="Annual Report.pdf" />
          </Card>
          
          <div className="space-y-1">
            <FolderItem name="Research" isOpen={true} />
            <FolderItem name="Work" />
            <FolderItem name="Personal" />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentSidebar;
