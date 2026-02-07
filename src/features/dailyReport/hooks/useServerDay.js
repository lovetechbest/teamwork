import { useState, useEffect } from 'react';
import { getServerDay } from '../../../store/reports/reportActions';

/**
 * Hook to get server's current day (YYYY-MM-DD).
 */
export const useServerDay = () => {
  const [serverToday, setServerToday] = useState(null);

  useEffect(() => {
    getServerDay().then(setServerToday);
  }, []);

  return { serverToday, loading: !serverToday };
};
