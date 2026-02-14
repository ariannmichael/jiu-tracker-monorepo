import Api from "./api";
import { CreateUserDto, User } from "@jiu-tracker/shared";

export default class SignupService {
  static async signup(data: CreateUserDto): Promise<User> {
    const response = await fetch(`${Api.BASE_URL}/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return response.json();
  }
}