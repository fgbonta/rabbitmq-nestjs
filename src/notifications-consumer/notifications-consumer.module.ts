import { Module } from '@nestjs/common';
import { NotificationsConsumerService } from './notifications-consumer.service';
import { NotificationsConsumerController } from './notifications-consumer.controller';

@Module({
  controllers: [NotificationsConsumerController],
  providers: [NotificationsConsumerService],
})
export class NotificationsConsumerModule {}
