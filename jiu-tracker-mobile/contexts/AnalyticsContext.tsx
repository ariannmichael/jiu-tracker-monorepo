import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import AnalyticsService from '@/services/analytics.service';
import type { AnalyticsResponse } from '@jiu-tracker/shared';

interface AnalyticsContextType {
  analytics: AnalyticsResponse | null;
  refreshAnalytics: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsContextProvider({ children }: { children: React.ReactNode }) {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const refreshAnalytics = useCallback(async () => {
    if (!token) {
      setAnalytics(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let data = await AnalyticsService.getAnalytics(token);
      if (data === null) {
        await AnalyticsService.recomputeAnalytics(token);
        data = await AnalyticsService.getAnalytics(token);
      }
      setAnalytics(data);
    } catch (e) {
      setError((e as Error).message);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  return (
    <AnalyticsContext.Provider value={{ analytics, refreshAnalytics, loading, error }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsContextProvider');
  }
  return context;
}
