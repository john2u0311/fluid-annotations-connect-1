
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface UploadOptions {
  workspaceId?: string;
  onSuccess?: (data: UploadResult) => void;
  onError?: (error: Error) => void;
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

export function useDocumentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadDocument = async (file: File, options?: UploadOptions) => {
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

    try {
      setIsUploading(true);
      setProgress(0);

      // Create a unique file path using the user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (event) => {
            const percent = event.loaded / (event.total || 1) * 100;
            setProgress(Math.round(percent));
          }
        });

      if (uploadError) throw uploadError;

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
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive"
      });
      
      if (options?.onError && error instanceof Error) {
        options.onError(error);
      }
      
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadDocument,
    isUploading,
    progress
  };
}
