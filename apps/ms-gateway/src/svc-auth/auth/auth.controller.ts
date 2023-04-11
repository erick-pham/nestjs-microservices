import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Response as ResponseExpress } from 'express';
import {
  AUTH_PATTERN,
  RegisterResponse,
  LoginResponse
} from 'apps/ms-auth/src/auth/auth.interface';
import {
  RegisterRequestDto,
  LoginRequestDto,
  LoginResponseDto
} from './auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MS_AUTH_SERVICE_NAME } from '../../common/constants';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(@Inject(MS_AUTH_SERVICE_NAME) private client: ClientProxy) {}

  @Post('register')
  async register(
    @Body() body: RegisterRequestDto,
    @Res() response: ResponseExpress
  ): Promise<ResponseExpress> {
    const rs = await lastValueFrom(
      this.client.send<RegisterResponse>(AUTH_PATTERN.Register, body)
    );

    return response.status(rs.status).json(rs);
  }

  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: LoginResponseDto
  })
  @Post('login')
  async login(
    @Body() body: LoginRequestDto,
    @Res() response: ResponseExpress
  ): Promise<ResponseExpress> {
    const rs = await lastValueFrom(
      this.client.send<LoginResponse>(AUTH_PATTERN.Login, body)
    );

    return response.status(rs.status).json(rs);
  }
}
