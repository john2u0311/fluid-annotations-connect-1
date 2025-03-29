
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { bytesToSize } from '@/lib/utils';

interface UploadOptions {
  workspaceId?: string;
  onSuccess?: (data: UploadResult) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  id: string;
  name: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  thumbnailUrl?: string;
  workspaceId?: string;
}

// List of allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Maximum file size: 25MB
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export function useDocumentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  // Validate file before upload
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check if file type is allowed
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: PDF, JPEG, PNG, GIF, DOC, DOCX`
      };
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File is too large. Maximum size is ${bytesToSize(MAX_FILE_SIZE)}`
      };
    }
    
    return { valid: true };
  };

  const uploadDocument = useCallback(async (file: File, options?: UploadOptions) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload documents",
        variant: "destructive"
      });
      return null;
    }

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return null;
    }

    // Validate file before uploading
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive"
      });
      return null;
    }

    try {
      setIsUploading(true);
      setProgress(0);

      // Create a unique file path using the user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${user.id}/${fileName}`;

      // Track upload progress (manual simulation since Supabase storage doesn't support progress tracking yet)
      let uploadProgress = 0;
      const progressInterval = setInterval(() => {
        if (uploadProgress < 90) {
          uploadProgress += 5;
          setProgress(uploadProgress);
          options?.onProgress?.(uploadProgress);
        }
      }, 300);

      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      
      if (uploadError) throw uploadError;

      // Update progress after upload completes
      setProgress(100);
      options?.onProgress?.(100);

      // Get the public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Insert document record in the database
      const { error: dbError, data: documentData } = await supabase
        .from('documents')
        .insert({
          owner_id: user.id,
          workspace_id: options?.workspaceId || null,
          name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          thumbnail_url: null
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const result: UploadResult = {
        id: documentData.id,
        name: documentData.name,
        filePath: documentData.file_path,
        fileSize: documentData.file_size,
        fileType: documentData.file_type,
        thumbnailUrl: documentData.thumbnail_url,
        workspaceId: documentData.workspace_id
      };

      toast({
        title: "Document uploaded",
        description: `${file.name} has been uploaded successfully`,
      });

      if (options?.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      console.error('Upload error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to upload document";
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      if (options?.onError && error instanceof Error) {
        options.onError(error);
      }
      
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [user, toast]);

  return {
    uploadDocument,
    isUploading,
    progress,
    validateFile
  };
}
