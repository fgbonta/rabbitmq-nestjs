import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

import { NotificationConsumer } from './interfaces/notification-consumer.interface';

@Injectable()
export class NotificationsConsumerService {

  private readonly logger = new Logger(NotificationsConsumerService.name);

  handleMessage(data: NotificationConsumer, context: RmqContext) {

    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {      
      // confirmar
      channel.ack(message);
      this.logger.debug('Mensaje procesado', data);

    } catch (err) {

      this.logger.error('Error procesando mensaje', err);
      // rechazar
      channel.nack(message);
    }

  }
}
