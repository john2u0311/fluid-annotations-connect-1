
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFileStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    path: string = '',
    bucket: string = 'documents'
  ) => {
    try {
      setIsLoading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) throw error;
      
      // Get the public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      toast({
        title: 'File uploaded',
        description: 'Your file has been uploaded successfully.',
      });
      
      return { path: data.path, publicUrl };
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'There was an error uploading your file.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async (
    path: string,
    bucket: string = 'documents'
  ) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Download failed',
        description: error.message || 'There was an error downloading your file.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (
    path: string,
    bucket: string = 'documents'
  ) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) throw error;
      
      toast({
        title: 'File deleted',
        description: 'Your file has been deleted successfully.',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message || 'There was an error deleting your file.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadFile,
    downloadFile,
    deleteFile,
    isLoading,
  };
};
