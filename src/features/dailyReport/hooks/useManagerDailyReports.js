import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllDailyReports } from '../../../store/reports/reportActions';

export const useManagerDailyReports = (dateRange = {}) => {
  const dispatch = useDispatch();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {};
        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;
        
        const data = await dispatch(fetchAllDailyReports(params));
        if (data && Array.isArray(data)) {
          setReports(data);
        } else if (data?.reports && Array.isArray(data.reports)) {
          setReports(data.reports);
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
  }, [dispatch, dateRange.startDate, dateRange.endDate]);

  const refreshReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      
      const data = await dispatch(fetchAllDailyReports(params));
      if (data && Array.isArray(data)) {
        setReports(data);
      } else if (data?.reports && Array.isArray(data.reports)) {
        setReports(data.reports);
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
