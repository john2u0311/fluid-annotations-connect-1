
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from './use-toast';

type RealtimeChannel = ReturnType<typeof supabase.channel>;
type RealtimeEventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeOptions<T> {
  table: string;
  schema?: string;
  event?: RealtimeEventType | RealtimeEventType[];
  filter?: string;
  callback?: (payload: { new: T; old: T }) => void;
}

/**
 * Hook for listening to Supabase Realtime changes
 */
export function useRealtime<T = any>({
  table,
  schema = 'public',
  event = '*',
  filter,
  callback
}: UseRealtimeOptions<T>) {
  const [isConnected, setIsConnected] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      setIsConnected(false);
      return;
    }

    const events = Array.isArray(event) ? event : [event];
    
    // Create a unique channel name
    const channelName = `${schema}:${table}:${events.join(',')}:${filter || 'all'}`;
    
    // Create the channel
    let channel = supabase.channel(channelName);
    
    // Build the channel with all the events
    let subscription = channel.on(
      'postgres_changes',
      {
        event: events.length === 1 && events[0] === '*' ? undefined : events as any,
        schema,
        table,
        filter,
      },
      (payload) => {
        console.log('Realtime event received:', payload);
        if (callback) {
          callback(payload as any);
        }
      }
    );

    // Subscribe to connection status changes
    subscription = subscription
      .on('system', { event: 'connected' }, () => {
        console.log('Realtime connected!');
        setIsConnected(true);
      })
      .on('system', { event: 'disconnected' }, () => {
        console.log('Realtime disconnected!');
        setIsConnected(false);
      });

    // Subscribe to the channel
    subscription.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to ${channelName}!`);
        setIsConnected(true);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Error subscribing to ${channelName}`);
        setIsConnected(false);
        toast({
          title: "Sync connection error",
          description: "Failed to establish realtime connection. Changes may not sync automatically.",
          variant: "destructive"
        });
      }
    });

    // Cleanup function
    return () => {
      console.log(`Unsubscribing from ${channelName}`);
      supabase.removeChannel(channel);
    };
  }, [table, schema, event, filter, callback, session]);

  return { isConnected };
}
