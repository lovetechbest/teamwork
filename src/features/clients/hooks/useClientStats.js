import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserId, getUserRole } from '../../../store/auth/authStorage';
import { fetchClients } from '../../../store/clients/clientActions';
import { isHighman } from '../../../utils/roles';

/**
 * Dashboard clients overview: Active now / Needs contract counts.
 * Developer: own clients only. Highman: all teammates' clients.
 */
export const useClientStats = () => {
  const { userId, role } = useSelector((state) => state.auth);
  const currentUserId = userId || getUserId();
  const userRole = role || getUserRole();
  const highman = isHighman(userRole);

  const [activeCount, setActiveCount] = useState(0);
  const [needsContractCount, setNeedsContractCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = highman ? {} : { userID: currentUserId };
        const data = await fetchClients(params);
        if (cancelled) return;

        const list = Array.isArray(data) ? data : [];
        let active = 0;
        let pending = 0;

        if (highman) {
          const byEmail = new Map();
          for (const c of list) {
            const email = (c.email || '').toLowerCase().trim();
            if (!email) continue;
            const status = (c.status || '').toLowerCase();
            const existing = byEmail.get(email);
            if (!existing) {
              byEmail.set(email, status === 'active' ? 'active' : 'pending');
            } else if (existing === 'pending' && status === 'active') {
              byEmail.set(email, 'active');
            }
          }
          byEmail.forEach((s) => (s === 'active' ? active++ : pending++));
        } else {
          active = list.filter((c) => (c.status || '').toLowerCase() === 'active').length;
          pending = list.filter((c) => (c.status || '').toLowerCase() === 'pending').length;
        }

        setActiveCount(active);
        setNeedsContractCount(pending);
      } catch (err) {
        if (!cancelled) {
          setActiveCount(0);
          setNeedsContractCount(0);
          setError(err?.message || 'Failed to load client stats');
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
  }, [highman, currentUserId]);

  return { activeCount, needsContractCount, loading, error };
};
