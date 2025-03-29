
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, FolderOpen } from 'lucide-react';

interface WorkspaceCardProps {
  title: string;
  documentsCount: number;
  lastModified: string;
  onClick: () => void;
}

const WorkspaceCard = ({ title, documentsCount, lastModified, onClick }: WorkspaceCardProps) => (
  <Card 
    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <h3 className="font-medium text-lg mb-1">{title}</h3>
    <div className="flex items-center text-sm text-muted-foreground">
      <FileText className="h-4 w-4 mr-1" />
      <span>{documentsCount} documents</span>
    </div>
    <div className="mt-2 text-xs text-muted-foreground">
      Last modified: {lastModified}
    </div>
  </Card>
);

const Workspace = () => {
  const navigate = useNavigate();

  const goToDocument = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header />
      
      <main className="flex-1 overflow-hidden p-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Workspaces</h1>
              <p className="text-muted-foreground">
                Create and manage your document workspaces
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline">
                <FolderOpen className="h-4 w-4 mr-2" />
                Open Workspace
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Workspace
              </Button>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <WorkspaceCard
                title="Research Project"
                documentsCount={3}
                lastModified="Today at 10:23 AM"
                onClick={goToDocument}
              />
              <WorkspaceCard
                title="Product Design"
                documentsCount={5}
                lastModified="Yesterday at 4:15 PM"
                onClick={goToDocument}
              />
              <WorkspaceCard
                title="Meeting Notes"
                documentsCount={12}
                lastModified="Sep 15, 2023"
                onClick={goToDocument}
              />
              <WorkspaceCard
                title="Academic Papers"
                documentsCount={7}
                lastModified="Sep 12, 2023"
                onClick={goToDocument}
              />
              <WorkspaceCard
                title="Personal Projects"
                documentsCount={4}
                lastModified="Sep 8, 2023"
                onClick={goToDocument}
              />
              <WorkspaceCard
                title="Conference Materials"
                documentsCount={2}
                lastModified="Aug 29, 2023"
                onClick={goToDocument}
              />
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default Workspace;
