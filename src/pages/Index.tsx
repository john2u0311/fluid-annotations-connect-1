
import React from 'react';
import Header from '@/components/Header';
import DocumentSidebar from '@/components/DocumentSidebar';
import DocumentCanvas from '@/components/DocumentCanvas';
import AnnotationSidebar from '@/components/AnnotationSidebar';
import ToolbarPanel from '@/components/ToolbarPanel';
import { UndoRedoProvider } from '@/contexts/UndoRedoContext';

// Initial state for annotations to ensure we always have a valid array
const initialAnnotations = [
  { 
    id: '1', 
    x: 550, 
    y: 120, 
    content: 'This is a key point - 42% reduction is significant and exceeds our target objective.',
    color: 'purple' 
  },
  { 
    id: '2', 
    x: 650, 
    y: 320, 
    content: 'Check if we can implement this in phases to minimize disruption.',
    color: 'blue' 
  }
];

const Index = () => {
  return (
    <UndoRedoProvider initialState={initialAnnotations}>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <Header />
        
        <main className="flex-1 flex overflow-hidden">
          <DocumentSidebar />
          <DocumentCanvas />
          <AnnotationSidebar />
        </main>
        
        <ToolbarPanel />
      </div>
    </UndoRedoProvider>
  );
};

export default Index;
