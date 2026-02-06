import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllProfits } from '../../../store/profit/profitActions';

export const useManagerProfits = (dateRange = {}) => {
  const dispatch = useDispatch();
  const [profits, setProfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const loadProfits = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await dispatch(fetchAllProfits(dateRange));
        if (data) {
          const profitsList = Array.isArray(data) ? data : data.profits || [];
          setProfits(profitsList);
          
          const total = profitsList.reduce((sum, profit) => {
            const amount = parseFloat(profit.amount || profit.profit || 0);
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0);
          setTotalProfit(total);
        } else {
          setProfits([]);
          setTotalProfit(0);
        }
      } catch (err) {
        setError(err.message || "Failed to load profits");
        setProfits([]);
        setTotalProfit(0);
      } finally {
        setLoading(false);
      }
    };

    loadProfits();
  }, [dispatch, dateRange]);

  const refreshProfits = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await dispatch(fetchAllProfits(dateRange));
      if (data) {
        const profitsList = Array.isArray(data) ? data : data.profits || [];
        setProfits(profitsList);
        
        const total = profitsList.reduce((sum, profit) => {
          const amount = parseFloat(profit.amount || profit.profit || 0);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        setTotalProfit(total);
      }
    } catch (err) {
      setError(err.message || "Failed to refresh profits");
    } finally {
      setLoading(false);
    }
  };

  const groupedByUser = profits.reduce((acc, profit) => {
    const userId = profit.userId || profit.user_id || profit.id;
    const userName = profit.userName || profit.user_name || `User ${userId}`;
    
    if (!acc[userId]) {
      acc[userId] = {
        userId,
        userName,
        profits: [],
        total: 0,
      };
    }
    
    const amount = parseFloat(profit.amount || profit.profit || 0);
    acc[userId].profits.push(profit);
    acc[userId].total += isNaN(amount) ? 0 : amount;
    
    return acc;
  }, {});

  return {
    profits,
    groupedByUser: Object.values(groupedByUser),
    totalProfit,
    loading,
    error,
    refreshProfits,
  };
};
