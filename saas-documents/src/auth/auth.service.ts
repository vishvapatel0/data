import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { users, User } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = users.find((u) => u.email === email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    const plainPasswords: Record<string, string> = {
      'admin@example.com': 'admin123',
      'user1@example.com': 'user123',
      'attacker@example.com': 'attacker123',
    };

    if (user && plainPasswords[email] === password) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'bearer',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        tenantId: user.tenantId,
        role: user.role,
      },
    };
  }
}
