import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  AUTH_PATTERN,
  LoginResponse,
  RegisterResponse
} from './auth.interface';

import { LoginRequestDto, RegisterRequestDto } from './auth.dto';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @MessagePattern(AUTH_PATTERN.Register)
  Register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    return this.service.register(payload);
  }

  @MessagePattern(AUTH_PATTERN.Login)
  login(payload: LoginRequestDto): Promise<LoginResponse> {
    return this.service.login(payload);
  }

  // @Put('login')
  // restLogin(@Body() loginPayload: LoginRequestDto): Promise<LoginResponse> {
  //   return this.service.login(loginPayload);
  // }

  // @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  // validate(payload: ValidateRequestDto): Promise<ValidateResponse> {
  //   return this.service.validate(payload);
  // }
}
