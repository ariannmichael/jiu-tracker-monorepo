import Api from './api';

export default class TechniquesService {
  static async getTechniquesList(token: string | null) {
    const response = await fetch(`${Api.BASE_URL}/techniques/list`, {
      headers: Api.authHeaders(token),
    });
    return response.json();
  }
}
