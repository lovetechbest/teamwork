import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllDailyReports } from '../../../store/reports/reportActions';

export const useManagerDailyReports = () => {
  const dispatch = useDispatch();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await dispatch(fetchAllDailyReports());
        if (data) {
          setReports(Array.isArray(data) ? data : data.reports || []);
        } else {
          setReports([]);
        }
      } catch (err) {
        setError(err.message || "Failed to load reports");
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
    
    const interval = setInterval(loadReports, 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const refreshReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await dispatch(fetchAllDailyReports());
      if (data) {
        setReports(Array.isArray(data) ? data : data.reports || []);
      }
    } catch (err) {
      setError(err.message || "Failed to refresh reports");
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    loading,
    error,
    refreshReports,
  };
};
