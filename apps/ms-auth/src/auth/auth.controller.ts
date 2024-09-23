import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import {
  ClientKafka,
  Ctx,
  EventPattern,
  KafkaContext,
  MessagePattern,
  Payload
} from '@nestjs/microservices';
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

  @MessagePattern(AUTH_PATTERN.Register.cmd)
  Register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    return this.service.register(payload);
  }

  @MessagePattern('login')
  login(
    @Payload() payload: LoginRequestDto,
    @Ctx() context: KafkaContext
  ): Promise<LoginResponse> {
    console.log(`Topic: ${context.getTopic()}`, payload);
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
