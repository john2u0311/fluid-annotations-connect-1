
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { 
  ZoomIn, ZoomOut, Hand, Edit, Bookmark, 
  Link, ArrowLeft, ArrowRight, Plus, Minus 
} from 'lucide-react';

interface AnnotationProps {
  id: string;
  x: number;
  y: number;
  content: string;
  color?: string;
  isSelected?: boolean;
}

const Annotation = ({ content, x, y, color = 'purple', isSelected = false }: AnnotationProps) => (
  <div 
    className={`annotation cursor-move absolute animate-scale-in ${
      isSelected ? 'ring-2 ring-fluid-purple' : ''
    }`}
    style={{ 
      left: `${x}px`, 
      top: `${y}px`,
      maxWidth: '300px',
      borderLeftColor: color === 'purple' ? '#9b87f5' : '#1EAEDB',
      borderLeftWidth: '4px'
    }}
  >
    <div className="text-sm">{content}</div>
  </div>
);

interface DocumentHighlightProps {
  content: string;
  onClick: () => void;
}

const DocumentHighlight = ({ content, onClick }: DocumentHighlightProps) => (
  <span className="annotation-highlight" onClick={onClick}>
    {content}
  </span>
);

const DocumentPage = () => {
  return (
    <div className="bg-white rounded-md p-8 shadow-md text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Project Proposal</h1>
      <p className="mb-4">
        This document outlines the proposed implementation of a new system designed 
        to optimize processing efficiency within our organization. The following 
        sections detail the scope, timeline, and expected outcomes of this initiative.
      </p>
      <h2 className="text-xl font-semibold mb-2">Executive Summary</h2>
      <p className="mb-4">
        Our current processing system suffers from significant inefficiencies that 
        result in delayed outputs and increased operational costs. This proposal 
        presents a comprehensive solution that addresses these challenges through 
        a combination of technological upgrades and process refinements.
      </p>
      <p className="mb-4">
        Initial testing has demonstrated that <DocumentHighlight content="implementation of the new system reduced processing time by 42% on average" onClick={() => {}} /> 
        while maintaining or improving output quality. Additionally, the proposed 
        solution requires minimal disruption to existing workflows during the 
        transition period.
      </p>
      <h2 className="text-xl font-semibold mb-2">Objectives</h2>
      <p className="mb-4">
        The primary objectives of this project are to:
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li className="mb-1">Reduce processing time by at least 40%</li>
        <li className="mb-1">Decrease error rates by 25% or more</li>
        <li className="mb-1">Improve system reliability to achieve 99.9% uptime</li>
        <li className="mb-1">Enable seamless scaling to accommodate growth</li>
      </ul>
      <p className="mb-4">
        These objectives directly align with our organizational goals of 
        improving operational efficiency and enhancing customer satisfaction 
        through faster, more reliable service delivery.
      </p>
    </div>
  );
};

const DocumentCanvas = () => {
  const [annotations, setAnnotations] = useState<AnnotationProps[]>([
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
  ]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="bg-muted py-1 px-3 border-b flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground mx-2">Page 1 of 12</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-8">
            <Hand className="h-4 w-4 mr-2" />
            Pan
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            <Edit className="h-4 w-4 mr-2" />
            Annotate
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            <Bookmark className="h-4 w-4 mr-2" />
            Highlight
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            <Link className="h-4 w-4 mr-2" />
            Connect
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-1">100%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full">
          <div className="min-h-full w-full p-8 canvas-grid">
            <div className="mx-auto max-w-3xl">
              <DocumentPage />
            </div>
            
            {annotations.map((annotation) => (
              <Annotation key={annotation.id} {...annotation} />
            ))}
            
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
              <path 
                d="M580,160 C600,180 620,280 650,320" 
                className="connection-line" 
                fill="none" 
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DocumentCanvas;
