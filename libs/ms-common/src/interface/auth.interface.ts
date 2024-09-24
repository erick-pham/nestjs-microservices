import { IBaseResponse } from '../response/message-pattern-response';
export const MS_AUTH_SERVICE_NAME = 'MSAuthService';
export const MS_AUTH_PATTERN = {
  Register: { cmd: 'register' },
  Login: { cmd: 'login' }
};

// This section is only relevant if you use request-response message style (with the @MessagePattern decorator and the ClientKafka#send method).
// Subscribing to the response topic is not necessary for the event-based communication (@EventPattern decorator and ClientKafka#emit method).
export enum MS_AUTH_MESSAGE_PATTERN {
  Ping = 'ping',
  Register = 'register',
  Login = 'login'
}

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
