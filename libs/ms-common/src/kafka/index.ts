import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, KafkaOptions } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

export interface MyKafkaRes {
  value: any;
  headers: Record<string, string>;
}

export const getKafkaConfig = (
  options: KafkaOptions['options'] = {}
): KafkaOptions['options'] => {
  return Object.assign(
    {
      client: {
        clientId: 'auth', // auth-client
        // brokers: ['rw.kfchs00fl92sqk9k8laq.at.double.cloud:9091'],
        // ssl: true,
        // sasl: {
        //   mechanism: 'plain', // scram-sha-256 or scram-sha-512
        //   username: 'admin',
        //   password: 'rEsvMUAqYQQtQZP7'
        // }
        brokers: ['localhost:9094'],
        allowAutoTopicCreation: false
      },
      consumer: {
        groupId: 'auth-consumer', // auth-consumer-client
        metadataMaxAge: 3000,
        allowAutoTopicCreation: false
      }
    },
    options
  );
};

@Injectable()
export class MyClientKafka extends ClientKafka implements OnModuleInit {
  private cls: ClsService;
  subscribeToResponseOfPatterns: string[];

  constructor({
    options,
    clsService,
    subscribeToResponseOfPatterns
  }: {
    options: KafkaOptions['options'];
    clsService: ClsService;
    subscribeToResponseOfPatterns: string[];
  }) {
    // Pass options to the parent class constructor
    super(options);
    this.cls = clsService;
    this.subscribeToResponseOfPatterns = subscribeToResponseOfPatterns;
  }

  // subscribeToResponseOfPatterns(messagePatterns: string[]) {
  //   messagePatterns.forEach((messagePattern: string) => {
  //     this.subscribeToResponseOf(messagePattern);
  //   });
  // }

  async onModuleInit() {
    this.subscribeToResponseOfPatterns.forEach((messagePattern: string) => {
      this.subscribeToResponseOf(messagePattern);
    });
    await this.connect();
  }

  sendMessage<T>(topic: string, message: any): Observable<T> {
    const kafkaRequestId = this.cls.get('requestId') || randomUUID();
    console.log('Generated Kafka Request ID:', kafkaRequestId);

    return this.send<T>(topic, {
      value: JSON.stringify(message),
      headers: {
        kafkaRequestId: kafkaRequestId
      }
    });
  }
}
