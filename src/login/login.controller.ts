
import { Body, Controller, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { LoginService } from './login.service';
import { SignupDto } from './dto/SignUp.dto';
import { IsPublic } from 'src/utils/decorators/Public.decorator';
import LoginDto from './dto/Login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Login")
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) { }

  @IsPublic()
  @Post()
  async login(@Body() loginDto: LoginDto) {

    console.log(loginDto.email, loginDto.password)
    const user = await this.loginService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.loginService.login(user);
  }

  @IsPublic()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const { name, email, password } = signupDto;
    const newUser = await this.loginService.signup(name, email, password);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      user: newUser,
    };
  }
}

