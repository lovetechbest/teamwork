import { useState, useEffect } from 'react';
import { fetchUsers } from '../../../store/users/userActions';
import { isHighman } from '../../../utils/roles';

/**
 * Lightweight hook for dashboard: total users and leader count.
 */
export const useUserCount = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [leaderCount, setLeaderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUsers();
        if (cancelled) return;
        const users = Array.isArray(data) ? data : data?.users || [];
        setTotalUsers(users.length);
        setLeaderCount(users.filter((u) => isHighman(u.role || u.userRole)).length);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load');
          setTotalUsers(0);
          setLeaderCount(0);
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

  return { totalUsers, leaderCount, loading, error };
};
