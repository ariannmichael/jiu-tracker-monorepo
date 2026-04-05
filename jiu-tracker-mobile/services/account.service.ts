import Api from '@/services/api';

export default class AccountService {
  static async deleteAccount(token: string): Promise<void> {
    const response = await Api.request(
      '/user',
      {
        method: 'DELETE',
        headers: Api.authHeaders(token),
      },
      {
        operation: 'account.deleteUser',
      },
    );

    let body: { success?: boolean; error?: string; message?: string } = {};
    try {
      body = await response.json();
    } catch {
      // non-JSON body
    }

    if (!response.ok) {
      const message = body?.message ?? body?.error ?? 'Account deletion failed';
      throw new Error(Array.isArray(message) ? message.join(', ') : message);
    }

    if (body.success === false) {
      throw new Error(body.error ?? 'Account deletion failed');
    }
  }
}
