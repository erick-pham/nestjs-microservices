import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ValidateRequest
} from '@app/ms-common/interface/auth.interface';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto implements LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    format: 'email',
    default: 'abc@example.com',
    description: 'Your email address'
  })
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    default: 'Aabc@123',
    description: 'your password',
    minLength: 8
  })
  public readonly password: string;
}

export class LoginResponseDto implements LoginResponse {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    default: 'eyJhbGciO...',
    description: 'Access token'
  })
  accessToken: string;
}

export class RegisterRequestDto implements RegisterRequest {
  @IsEmail()
  @ApiProperty({
    type: String,
    format: 'email',
    default: 'abc@example.com',
    description: 'Your email address'
  })
  public readonly email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    type: String,
    default: 'Aabc@123',
    description: 'your password',
    minLength: 8
  })
  public readonly password: string;
}

export class ValidateRequestDto implements ValidateRequest {
  @IsString()
  @ApiProperty({
    type: String,
    default: 'ejJh....',
    description: 'Your JWT'
  })
  public readonly accessToken: string;
}
