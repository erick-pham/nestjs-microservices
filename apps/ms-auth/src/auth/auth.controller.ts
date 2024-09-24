import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload
} from '@nestjs/microservices';

import { LoginRequestDto, RegisterRequestDto } from './auth.dto';

import { AuthService } from './auth.service';
import { MyKafkaRes } from '@app/ms-common/kafka';
import {
  MS_AUTH_MESSAGE_PATTERN,
  RegisterResponse
} from '@app/ms-common/interface/auth.interface';
@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @MessagePattern(MS_AUTH_MESSAGE_PATTERN.Register)
  Register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    return this.service.register(payload);
  }

  @MessagePattern(MS_AUTH_MESSAGE_PATTERN.Login)
  async login(
    @Payload() payload: LoginRequestDto,
    @Ctx() context: KafkaContext
  ): Promise<MyKafkaRes> {
    const loginRes = await this.service.login(payload);
    const kafkaRequestId = String(
      context.getMessage().headers['kafkaRequestId']
    );

    return {
      value: loginRes,
      headers: {
        kafkaRequestId: kafkaRequestId
      }
    };
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
