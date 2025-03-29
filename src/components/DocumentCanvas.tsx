
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ZoomIn, ZoomOut, Hand, Edit, Bookmark, 
  Link as LinkIcon, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnnotationProps {
  id: string;
  x: number;
  y: number;
  content: string;
  color?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onMove?: (id: string, newX: number, newY: number) => void;
}

const Annotation = ({ 
  id, 
  content, 
  x, 
  y, 
  color = 'purple', 
  isSelected = false,
  onSelect,
  onMove
}: AnnotationProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x, y });
  const annotationRef = useRef<HTMLDivElement>(null);

  // Update position when props change
  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onSelect) onSelect(id);
    
    if (onMove) {
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX - position.x, 
        y: e.clientY - position.y 
      });
      e.stopPropagation();
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && onMove) {
      onMove(id, position.x, position.y);
      setIsDragging(false);
    }
  }, [id, isDragging, onMove, position]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={annotationRef}
      className={`absolute cursor-move p-3 bg-card border rounded-md shadow-md max-w-[300px] ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        borderLeftColor: color === 'purple' ? '#9b87f5' : '#1EAEDB',
        borderLeftWidth: '4px',
        zIndex: isSelected ? 50 : 10
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="text-sm">{content}</div>
    </div>
  );
};

interface DocumentHighlightProps {
  content: string;
  onClick: () => void;
}

const DocumentHighlight = ({ content, onClick }: DocumentHighlightProps) => (
  <span 
    className="bg-yellow-200 cursor-pointer hover:bg-yellow-300 transition-colors" 
    onClick={onClick}
  >
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
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [tool, setTool] = useState<'pan' | 'annotate' | 'highlight' | 'link'>('pan');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 12;
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleAnnotationSelect = (id: string) => {
    setSelectedAnnotation(id);
  };

  const handleAnnotationMove = (id: string, newX: number, newY: number) => {
    setAnnotations(prevAnnotations => 
      prevAnnotations.map(anno => 
        anno.id === id ? { ...anno, x: newX, y: newY } : anno
      )
    );
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (tool === 'annotate' && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newAnnotation: AnnotationProps = {
        id: `anno-${Date.now()}`,
        x,
        y,
        content: 'New annotation',
        color: 'purple'
      };
      
      setAnnotations(prev => [...prev, newAnnotation]);
      setSelectedAnnotation(newAnnotation.id);
      
      toast({
        title: "Annotation added",
        description: "Click to edit the annotation content",
      });
    }
  };

  const changePage = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const zoomIn = () => {
    if (zoom < 200) {
      setZoom(prev => prev + 10);
    }
  };

  const zoomOut = () => {
    if (zoom > 50) {
      setZoom(prev => prev - 10);
    }
  };

  useEffect(() => {
    // Reset selected annotation when tool changes
    if (tool !== 'annotate') {
      setSelectedAnnotation(null);
    }
  }, [tool]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="bg-muted py-1 px-3 border-b flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => changePage('prev')}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => changePage('next')}
            disabled={currentPage === totalPages}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground mx-2">Page {currentPage} of {totalPages}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant={tool === 'pan' ? "secondary" : "ghost"} 
            size="sm" 
            className="h-8"
            onClick={() => setTool('pan')}
          >
            <Hand className="h-4 w-4 mr-2" />
            Pan
          </Button>
          <Button 
            variant={tool === 'annotate' ? "secondary" : "ghost"} 
            size="sm" 
            className="h-8"
            onClick={() => setTool('annotate')}
          >
            <Edit className="h-4 w-4 mr-2" />
            Annotate
          </Button>
          <Button 
            variant={tool === 'highlight' ? "secondary" : "ghost"} 
            size="sm" 
            className="h-8"
            onClick={() => setTool('highlight')}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Highlight
          </Button>
          <Button 
            variant={tool === 'link' ? "secondary" : "ghost"} 
            size="sm" 
            className="h-8"
            onClick={() => setTool('link')}
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Connect
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={zoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-1">{zoom}%</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={zoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full">
          <div 
            ref={canvasRef}
            className="min-h-full w-full p-8 relative"
            onClick={handleCanvasClick}
            style={{ 
              cursor: tool === 'annotate' ? 'crosshair' : tool === 'pan' ? 'grab' : 'default',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              transition: 'transform 0.2s ease-out'
            }}
          >
            <div className="mx-auto max-w-3xl">
              <DocumentPage />
            </div>
            
            {annotations.map((annotation) => (
              <Annotation 
                key={annotation.id} 
                {...annotation} 
                isSelected={selectedAnnotation === annotation.id}
                onSelect={handleAnnotationSelect}
                onMove={handleAnnotationMove}
              />
            ))}
            
            <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
              <path 
                d="M580,160 C600,180 620,280 650,320" 
                fill="none"
                stroke="rgba(155, 135, 245, 0.6)"
                strokeWidth="2"
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
