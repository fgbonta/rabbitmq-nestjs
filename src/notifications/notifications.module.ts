import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';


/*
Registrar un cliente de microservicios significa 
“dar de alta” en Nest una conexión saliente hacia otro servicio (por ejemplo RabbitMQ) 
para poder enviarle mensajes o eventos desde tu módulo.
Cuando lo registrás:
Definís cómo conectarse (transporte, URL, cola/tópico, credenciales).
Nest crea un proveedor inyectable con un nombre/token (por ejemplo NOTIFICATIONS_RABBIT_SERVICE).
Luego podés inyectar ese cliente en tus servicios y usarlo para emit() (eventos) o send() (request/response).
*/

/*
ClientsModule.registerAsync
Registra cliente de microservicio de forma asíncrona dentro de un módulo
Se usa cuando la configuración del cliente no está fija y debe resolverse en tiempo de arranque.
La diferencia clave frente a register es que registerAsync permite construir la configuración 
con useFactory, useClass o useExisting, e inyectar dependencias como ConfigService.
*/

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATIONS_RABBIT_SERVICE',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const url = config.get<string>('RABBITMQ_URL')!;
          const queue = config.get<string>('RABBITMQ_QUEUE_NOTIFICATIONS')!;
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: queue,
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
