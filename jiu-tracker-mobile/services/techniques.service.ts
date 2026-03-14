import { TechniquesListResponse, AllTechniquesResponse } from '@jiu-tracker/shared';
import Api from './api';

export default class TechniquesService {
  static async getTechniquesList(token: string | null): Promise<TechniquesListResponse> {
    const response = await Api.request('/techniques/list', {
      headers: Api.authHeaders(token),
    }, {
      operation: 'techniques.list',
    });
    return response.json();
  }

  static async getAllTechniques(token: string | null): Promise<AllTechniquesResponse> {
    const response = await Api.request('/techniques', {
      headers: Api.authHeaders(token),
    }, {
      operation: 'techniques.getAll',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch techniques: ${response.status}`);
    }
    return response.json();
  }
}
