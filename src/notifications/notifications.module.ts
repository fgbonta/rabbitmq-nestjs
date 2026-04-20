import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATIONS_RABBIT_SERVICE',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const url = config.get<string>('RABBITMQ_URL')!;
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: 'notifications_queue',
              queueOptions: {
                durable: true, // La cola durable asegura que la cola sobreviva a reinicios del broker. Pero no es suficiente para garantizar la persistencia de los mensajes.
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule { }
