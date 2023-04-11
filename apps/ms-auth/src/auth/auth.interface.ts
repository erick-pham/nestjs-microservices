import { IBaseResponse } from '@app/ms-common/response/message-pattern-response';

export const AUTH_PATTERN = {
  Register: { cmd: 'register' },
  Login: { cmd: 'login' }
};

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse extends IBaseResponse {
  id?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends IBaseResponse {
  accessToken?: string;
}

export interface ValidateRequest {
  accessToken: string;
}

export interface ValidateResponse extends IBaseResponse {
  userId: number;
}
