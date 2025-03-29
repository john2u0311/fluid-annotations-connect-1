
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, FileText, Bookmark, List } from 'lucide-react';

const ExcerptItem = ({ text, source }: { text: string; source: string }) => (
  <Card className="p-3 mb-3 hover:shadow-md transition-shadow border border-border/60">
    <div className="text-sm">{text}</div>
    <div className="text-xs text-muted-foreground mt-1 flex items-center">
      <FileText className="h-3 w-3 inline mr-1" />
      {source}
    </div>
  </Card>
);

const NoteItem = ({ text, timestamp }: { text: string; timestamp: string }) => (
  <Card className="p-3 mb-3 hover:shadow-md transition-shadow border-l-4 border-l-fluid-purple border">
    <div className="text-sm">{text}</div>
    <div className="text-xs text-muted-foreground mt-1">{timestamp}</div>
  </Card>
);

const AnnotationSidebar = () => {
  return (
    <div className="w-[300px] border-l bg-card h-full flex flex-col">
      <Tabs defaultValue="excerpts" className="flex flex-col h-full">
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="excerpts" className="flex-1">
              <BookOpen className="h-4 w-4 mr-2" />
              Excerpts
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1">
              <List className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="excerpts" className="flex-1 px-4 pt-2">
          <ScrollArea className="h-full pr-4">
            <ExcerptItem 
              text="The results indicate a significant correlation between the variables (p < 0.001)."
              source="Research Paper.pdf, p.12"
            />
            <ExcerptItem 
              text="Implementation of the new system reduced processing time by 42% on average."
              source="Project Proposal.pdf, p.8"
            />
            <ExcerptItem 
              text="Further studies are needed to confirm these preliminary findings."
              source="Research Paper.pdf, p.15"
            />
            <ExcerptItem 
              text="The budget allocation for Q3 should prioritize research and development initiatives."
              source="Meeting Notes.pdf, p.3"
            />
            <ExcerptItem 
              text="User testing revealed that 78% of participants preferred the new interface design."
              source="Design Specs.pdf, p.22"
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="notes" className="flex-1 px-4 pt-2">
          <ScrollArea className="h-full pr-4">
            <NoteItem 
              text="Follow up on the correlation analysis and check methodology"
              timestamp="Today, 10:23 AM"
            />
            <NoteItem 
              text="Ask team about the implementation timeline for the new processing system"
              timestamp="Yesterday, 4:15 PM"
            />
            <NoteItem 
              text="Important point for the meeting - discuss the budget allocation priorities"
              timestamp="Sep 15, 2023"
            />
            <NoteItem 
              text="Consider running additional user tests with different demographic groups"
              timestamp="Sep 12, 2023"
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnnotationSidebar;
