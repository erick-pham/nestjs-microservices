import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
  RegisterRequestDto,
  LoginRequestDto,
  ValidateRequestDto
} from './auth.dto';
import { AuthEntity } from './auth.entity';

import MessagePatternResponse from '@app/ms-common/response/message-pattern-response';
import { BCRYPT_SALT_ROUND } from '../common/constants';
import { AuthRepository } from './auth.repository';
import {
  LoginResponse,
  RegisterResponse,
  ValidateResponse
} from '@app/ms-common/interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: Jwt,
    private readonly repository: AuthRepository
  ) {}

  public async register({
    email,
    password
  }: RegisterRequestDto): Promise<RegisterResponse> {
    let auth: AuthEntity = await this.repository.findOne({ where: { email } });

    if (auth) {
      return new MessagePatternResponse()
        .setStatus(HttpStatus.CONFLICT)
        .sendErrors<RegisterResponse>(['E-Mail already exists']);
    }

    auth = new AuthEntity();

    auth.email = email;
    auth.password = this.hashPassword(password);

    await this.repository.save(auth);
    return new MessagePatternResponse()
      .setStatus(HttpStatus.CREATED)
      .send<RegisterResponse>({ id: auth.id });
  }

  public async login({
    email,
    password
  }: LoginRequestDto): Promise<LoginResponse> {
    const auth: AuthEntity = await this.repository.findOne({
      where: { email }
    });

    if (auth && this.isPasswordValid(password, auth.password)) {
      const token: string = this.generateToken(auth);
      return new MessagePatternResponse()
        .setStatus(HttpStatus.OK)
        .send<LoginResponse>({ accessToken: token });
    }

    return new MessagePatternResponse()
      .setStatus(HttpStatus.BAD_REQUEST)
      .sendErrors<LoginResponse>(['E-Mail or Password wrong']);
  }

  public async validate({
    accessToken
  }: ValidateRequestDto): Promise<ValidateResponse> {
    try {
      const decoded: AuthEntity = await this.jwt.verify(accessToken);

      if (!decoded) {
        return {
          status: HttpStatus.FORBIDDEN,
          errorMessages: ['Token is invalid'],
          userId: null
        };
      }

      const auth: AuthEntity = await this.repository.findOne({
        where: { id: decoded.id }
      });

      if (!auth) {
        return {
          status: HttpStatus.CONFLICT,
          errorMessages: ['User not found'],
          userId: null
        };
      }

      return { status: HttpStatus.OK, userId: auth.id };
    } catch (error) {
      return {
        status: HttpStatus.FORBIDDEN,
        errorMessages: ['Token is invalid'],
        userId: null
      };
    }
  }

  public hashPassword(password: string): string {
    return bcrypt.hashSync(password, BCRYPT_SALT_ROUND);
  }

  // Generate JWT Token
  public generateToken(auth: AuthEntity): string {
    return this.jwt.sign(
      {
        sub: auth.id,
        email: auth.email
      },
      {
        jwtid: uuidv4()
      }
    );
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }
}
