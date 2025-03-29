
import React from 'react';
import Header from '@/components/Header';
import DocumentSidebar from '@/components/DocumentSidebar';
import DocumentCanvas from '@/components/DocumentCanvas';
import AnnotationSidebar from '@/components/AnnotationSidebar';
import ToolbarPanel from '@/components/ToolbarPanel';

const Index = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <DocumentSidebar />
        <DocumentCanvas />
        <AnnotationSidebar />
      </main>
      
      <ToolbarPanel />
    </div>
  );
};

export default Index;
