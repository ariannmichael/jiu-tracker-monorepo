import Api from "./api";
import { CreateUserDto, User } from "@jiu-tracker/shared";

export default class SignupService {
  static async signup(data: CreateUserDto): Promise<User> {
    const response = await Api.request('/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }, {
      operation: 'signup.createUser',
    });

    const body = await response.json();
    if (!response.ok) {
      const message = body?.message ?? body?.error ?? 'Signup failed';
      throw new Error(Array.isArray(message) ? message.join(', ') : message);
    }

    return body;
  }
}
