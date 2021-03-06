import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserObject, UserObjectInput } from './gql-dtos';

@Injectable()
export class AppService {
  private users = new Map<string, UserObject>();

  createUser(userDto: UserObjectInput): string {
    const id = randomUUID();
    this.users.set(id, { ...userDto, id });
    return id;
  }

  updateUser(userId: string, userDto: Partial<UserObjectInput>): string {
    const user = this.users.get(userId);
    this.users.set(userId, { ...user, ...userDto });
    return userId;
  }

  deleteUser(userId: string): string {
    this.users.delete(userId);
    return userId;
  }

  listUsers(): UserObject[] {
    return [...this.users.values()];
  }
}
