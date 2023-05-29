import { Module } from '@nestjs/common';
import { EventsGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  providers: [EventsGateway, ChatService]
})
export class EventsModule {}
