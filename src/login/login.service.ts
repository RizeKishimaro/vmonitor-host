
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class LoginService {
  constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    return {
      statusCode: HttpStatus.OK,
      message: "Successfully Login",
      access_token: token,
    };
  }

  async signup(name: string, email: string, password: string) {
    console.log(name, email, password)
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        is_active: true, // Default to true
      },
    });

    // Optionally return user information (excluding password)
    const payload = { email: newUser.email, sub: newUser.id };
    const token = this.jwtService.sign(payload);
    return {
      statusCode: HttpStatus.OK,
      message: "Successfully Login",
      access_token: token,
    };

  }
}

