import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsConsumerModule } from './notifications-consumer/notifications-consumer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // hace que el módulo de configuración esté disponible en toda la aplicación sin necesidad de importarlo en cada módulo
      expandVariables: true, // permite usar variables de entorno dentro del archivo .env
    }),
    NotificationsModule,
    NotificationsConsumerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
