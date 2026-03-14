import type { AnalyticsResponse, AnalyticsApiResponse } from '@jiu-tracker/shared';
import Api from './api';

export default class AnalyticsService {
  static async getAnalytics(token: string | null): Promise<AnalyticsResponse | null> {
    if (!token) return null;
    const response = await Api.request('/analytics', {
      method: 'GET',
      headers: Api.authHeaders(token),
    }, {
      operation: 'analytics.get',
    });
    if (!response.ok) {
      if (response.status === 401) return null;
      throw new Error(`Analytics request failed: ${response.status}`);
    }
    const data: AnalyticsApiResponse = await response.json();
    return data.analytics ?? null;
  }

  static async recomputeAnalytics(token: string | null): Promise<AnalyticsResponse | null> {
    if (!token) return null;
    const response = await Api.request('/analytics/recompute', {
      method: 'POST',
      headers: Api.authHeaders(token),
    }, {
      operation: 'analytics.recompute',
    });
    if (!response.ok) throw new Error(`Recompute failed: ${response.status}`);
    const data: AnalyticsApiResponse = await response.json();
    return data.analytics ?? null;
  }
}
