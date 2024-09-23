import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Res
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
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
export class AuthController implements OnModuleInit {
  constructor(
    @Inject(MS_AUTH_SERVICE_NAME) private readonly authClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf(AUTH_PATTERN.Login.cmd);
    await this.authClient.connect();
  }

  @Post('register')
  async register(
    @Body() body: RegisterRequestDto,
    @Res() response: ResponseExpress
  ): Promise<ResponseExpress> {
    const rs = await lastValueFrom(
      this.authClient.send<RegisterResponse>(AUTH_PATTERN.Register.cmd, body)
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
      this.authClient.send<LoginResponse>(
        AUTH_PATTERN.Login.cmd,
        JSON.stringify(body)
      )
    );

    return response.status(rs.status).json(rs);
  }
}
