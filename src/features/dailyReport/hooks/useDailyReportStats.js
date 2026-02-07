import { useState, useEffect } from 'react';
import { getServerDay, fetchDailyReportStats } from '../../../store/reports/reportActions';

/**
 * Hook for highman dashboard: reported / not-reported counts for today.
 * Returns { reportedCount, notReportedCount, loading, error }.
 */
export const useDailyReportStats = () => {
  const [reportedCount, setReportedCount] = useState(0);
  const [notReportedCount, setNotReportedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = await getServerDay();
        if (cancelled) return;
        const stats = await fetchDailyReportStats(today);
        if (cancelled) return;
        setReportedCount(stats.reportedCount);
        setNotReportedCount(stats.notReportedCount);
      } catch (err) {
        if (!cancelled) {
          setReportedCount(0);
          setNotReportedCount(0);
          setError(err?.response?.data?.message || err?.message || "Unable to load report stats");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    const interval = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { reportedCount, notReportedCount, loading, error };
};
