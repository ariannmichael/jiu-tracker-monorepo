import { TechniquesListResponse, AllTechniquesResponse } from '@jiu-tracker/shared';
import Api from './api';

export default class TechniquesService {
  static async getTechniquesList(token: string | null): Promise<TechniquesListResponse> {
    const response = await fetch(`${Api.BASE_URL}/techniques/list`, {
      headers: Api.authHeaders(token),
    });
    return response.json();
  }

  static async getAllTechniques(token: string | null): Promise<AllTechniquesResponse> {
    const response = await fetch(`${Api.BASE_URL}/techniques`, {
      headers: Api.authHeaders(token),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch techniques: ${response.status}`);
    }
    return response.json();
  }
}
