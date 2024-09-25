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

  private formatResponse = (data: any, kafkaRequestId: string) => {
    return {
      ...data,
      requestId: kafkaRequestId
    };
    // return {
    //   value: data,
    //   headers: {
    //     kafkaRequestId: kafkaRequestId
    //   }
    // };
  };

  @MessagePattern(MS_AUTH_MESSAGE_PATTERN.Register)
  async Register(
    payload: RegisterRequestDto,
    @Ctx() context: KafkaContext
  ): Promise<RegisterResponse> {
    const kafkaRequestId = String(
      context.getMessage().headers['kafkaRequestId']
    );

    const registerRes = await this.service.register(payload);
    return this.formatResponse(registerRes, kafkaRequestId);
  }

  @MessagePattern(MS_AUTH_MESSAGE_PATTERN.Login)
  async login(
    @Payload() payload: LoginRequestDto,
    @Ctx() context: KafkaContext
  ): Promise<MyKafkaRes> {
    const kafkaRequestId = String(
      context.getMessage().headers['kafkaRequestId']
    );
    try {
      // Process the message
      const loginRes = await this.service.login(payload);
      return this.formatResponse(loginRes, kafkaRequestId);
    } catch (error) {
      console.log(error);
      // handle log error here
      return this.formatResponse(
        {
          error: true,
          status: 500,
          errorMessages: error.message
        },
        kafkaRequestId
      );
    }
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
