
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, Bookmark, FileText, Link, Hand, Eraser,
  Plus, Minus, Circle, Square, ArrowRight
} from 'lucide-react';

const colorOptions = [
  { color: '#1EAEDB', name: 'blue' },
  { color: '#9b87f5', name: 'purple' },
  { color: '#F97316', name: 'orange' },
  { color: '#65A30D', name: 'green' },
  { color: '#EF4444', name: 'red' },
];

const ToolbarPanel = () => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-card rounded-full shadow-lg border px-4 py-1.5 flex items-center space-x-2">
        <Tabs defaultValue="annotate" className="mr-2">
          <TabsList className="bg-muted/70">
            <TabsTrigger value="select" className="px-3">
              <Hand className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="annotate" className="px-3">
              <Edit className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="highlight" className="px-3">
              <Bookmark className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="excerpt" className="px-3">
              <FileText className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="connect" className="px-3">
              <Link className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Separator orientation="vertical" className="h-8" />
        
        <div className="flex items-center space-x-1">
          {colorOptions.map((opt, i) => (
            <Button 
              key={i}
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              style={{ color: opt.color }}
            >
              <div 
                className="h-5 w-5 rounded-full border"
                style={{ backgroundColor: opt.color }}
              />
            </Button>
          ))}
        </div>
        
        <Separator orientation="vertical" className="h-8" />
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eraser className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Square className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Circle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolbarPanel;
