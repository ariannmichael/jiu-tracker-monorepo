export default class Api {
  static BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3006/api';

  static authHeaders(token: string | null): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }
}
