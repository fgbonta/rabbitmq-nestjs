import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext, } from '@nestjs/microservices';

import { NotificationsConsumerService } from './notifications-consumer.service';
import type { NotificationConsumer } from './interfaces/notification-consumer.interface';

@Controller()
export class NotificationsConsumerController {

  constructor(private readonly notificationsConsumerService: NotificationsConsumerService) { }

  @EventPattern('msg_to_process')
  handleMessage(
    @Payload() data: NotificationConsumer,
    @Ctx() context: RmqContext
  ) {
    return this.notificationsConsumerService.handleMessage(data, context);
  }
}
