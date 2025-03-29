
import React, { useState, useRef } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useDocumentUpload, UploadResult } from '@/hooks/useDocumentUpload';
import { bytesToSize } from '@/lib/utils';

interface DocumentUploaderProps {
  workspaceId?: string;
  onSuccess?: (data: UploadResult) => void;
  className?: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const DocumentUploader = ({
  workspaceId,
  onSuccess,
  className = '',
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  maxSizeMB = 10
}: DocumentUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument, isUploading, progress } = useDocumentUpload();
  
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const validateFile = (file: File): boolean => {
    setFileError(null);
    
    if (!allowedTypes.includes(file.type)) {
      setFileError(`Invalid file type. Please upload: ${allowedTypes.join(', ')}`);
      return false;
    }
    
    if (file.size > maxSize) {
      setFileError(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const result = await uploadDocument(selectedFile, {
        workspaceId,
        onSuccess,
        onError: (error) => {
          toast({
            title: "Upload failed",
            description: error.message,
            variant: "destructive"
          });
        }
      });
      
      if (result) {
        setSelectedFile(null);
        setFileError(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={allowedTypes.join(',')}
        onChange={handleFileInputChange}
      />
      
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer ${
            dragActive ? 'border-primary bg-muted/50' : 'border-muted'
          }`}
          onClick={triggerFileInput}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">
            Drag and drop your document here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: {allowedTypes.map(type => type.split('/')[1]).join(', ')}
            (Max size: {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-muted-foreground" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {bytesToSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            {!isUploading && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={clearSelectedFile}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {fileError && (
            <div className="bg-destructive/10 text-destructive text-sm p-2 rounded flex items-center space-x-2 mb-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{fileError}</span>
            </div>
          )}
          
          {isUploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                Uploading... {progress}%
              </p>
            </div>
          ) : (
            <Button
              onClick={handleUpload}
              className="w-full"
              disabled={!!fileError}
            >
              Upload Document
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
