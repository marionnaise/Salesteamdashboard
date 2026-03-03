import { useEffect, useState } from 'react';
import { subscribeToSalesChanges, onSalesChange } from '../services/salesService';

//Custom hook for real-time data fetching with Supabase subscription
//Automatically refetches data when changes are detected
export function useRealtimeData(fetchFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial fetch
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction();
        setData(result || []);
      } catch (err) {
        setError(err);
        console.error('Error loading data:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time changes
    const channel = subscribeToSalesChanges(async () => {
      // Refetch data when changes are detected from Supabase
      try {
        const result = await fetchFunction();
        setData(result || []);
      } catch (err) {
        console.error('Error refetching data:', err);
      }
    });

    // also listen to manual notifications (e.g. after a successful form submit)
    const unsubscribeManual = onSalesChange(async () => {
      try {
        const result = await fetchFunction();
        setData(result || []);
      } catch (err) {
        console.error('Error refetching data (manual)', err);
      }
    });

    // Cleanup subscription
    return () => {
      if (channel) {
        channel.unsubscribe();
      }
      if (unsubscribeManual) {
        unsubscribeManual();
      }
    };
  }, [fetchFunction]);

  return { data, loading, error };
}
