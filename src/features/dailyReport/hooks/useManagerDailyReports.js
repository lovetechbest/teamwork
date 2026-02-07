import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllDailyReports } from '../../../store/reports/reportActions';

export const useManagerDailyReports = (filters = {}) => {
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
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.date) params.date = filters.date;
        if (filters.filter_userUniqueID) params.filter_userUniqueID = filters.filter_userUniqueID;
        
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
  }, [dispatch, filters.startDate, filters.endDate, filters.date, filters.filter_userUniqueID]);

  const refreshReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.date) params.date = filters.date;
      if (filters.filter_userUniqueID) params.filter_userUniqueID = filters.filter_userUniqueID;
      
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
