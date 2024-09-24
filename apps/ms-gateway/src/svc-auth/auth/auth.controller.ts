import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Response as ResponseExpress } from 'express';
import {
  RegisterResponse,
  LoginResponse,
  MS_AUTH_SERVICE_NAME,
  MS_AUTH_MESSAGE_PATTERN
} from '@app/ms-common/interface/auth.interface';
import {
  RegisterRequestDto,
  LoginRequestDto,
  LoginResponseDto
} from './auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MyClientKafka } from '@app/ms-common/kafka';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(MS_AUTH_SERVICE_NAME) private readonly authClient: MyClientKafka
  ) {}

  @Post('register')
  async register(
    @Body() body: RegisterRequestDto,
    @Res() response: ResponseExpress
  ): Promise<ResponseExpress> {
    const rs = await lastValueFrom(
      this.authClient.send<RegisterResponse>(
        MS_AUTH_MESSAGE_PATTERN.Register,
        body
      )
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
      this.authClient.sendMessage<LoginResponse>(
        MS_AUTH_MESSAGE_PATTERN.Login,
        body
      )
    );

    return response.status(rs.status).json(rs);
  }
}
