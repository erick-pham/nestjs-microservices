import { Injectable } from '@nestjs/common';
// import { AuthenticationService } from '../authentication/authentication.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  // constructor(private readonly authenticationService: AuthenticationService) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    console.log('cookie', cookie);
    console.log('socket.handshake.headers', socket.handshake.headers);
    // const { Authentication: authenticationToken } = parse(cookie);
    // const user = await this.authenticationService.getUserFromAuthenticationToken(authenticationToken);
    const user = {
      id: 1
    };
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}
