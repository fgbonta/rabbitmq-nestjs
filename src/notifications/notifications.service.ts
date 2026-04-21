import { Inject, Injectable, InternalServerErrorException, OnModuleInit, Logger } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService implements OnModuleInit {

  // sirve para registrar mensajes de aplicación de forma estandarizada
  // todos los logs salen con el mismo formato y contexto 
  // tipos -> log, warn, error, debug
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject('NOTIFICATIONS_RABBIT_SERVICE')
    private readonly rabbitMQClient: ClientProxy // ClientProxy -> emit o send para enviar mensajes a RabbitMQ
  ) { }

  // se ejecuta después de que el módulo se ha inicializado
  async onModuleInit() {
    try {
      await this.rabbitMQClient.connect();
      this.logger.log('Rabbit conectado al iniciar');
    } catch (err: any) {
      this.logger.error('Error conectando a Rabbit al iniciar', err);
      throw new InternalServerErrorException('Error conectando a RabbitMQ');
    }
  }

  async create(createNotificationDto: CreateNotificationDto) {
    try {

      /* this.rabbitMQClient
        .emit('msg_to_process', createNotificationDto)
        .subscribe({
          next: () => this.logger.log('Mensaje enviado a la cola', createNotificationDto),
          error: (err) => this.logger.error('Error al enviar mensaje a la cola', err),
        });

        emit() es de tipo event-driven (fire-and-forget): 
        no espera una respuesta de negocio del consumidor, 
        devuelve un Observable de RxJS para representar el ciclo de envío/transporte.

        suscribe() al observable que devuelve emit() para manejar errores de conexión o envío.        
        Pero no es para recibir datos, es solo para:
        saber si hubo error ó cuándo terminó el envío.        
      */

      // mensaje persistente
      // Para que realmente sobreviva a reinicios el rabbit, necesitas las tres piezas juntas: 
      // cola durable, mensaje persistent y volumen de RabbitMQ conservado
      const record = new RmqRecordBuilder({...createNotificationDto, createdAt: new Date().toUTCString()})
        .setOptions({
          persistent: true,
        })
        .build();

      this.logger.debug('Enviando mensaje a RabbitMQ', record);

      // Conveierte el Observable a Promise:
      await lastValueFrom(
        this.rabbitMQClient.emit('msg_to_process', record)
      );

      return {
        status: 'ok',
        message: 'Mensaje enviado',
      };

    } catch (err: any) {

      this.logger.error('Error al enviar mensaje a RabbitMQ', err);
      throw new InternalServerErrorException('Error al enviar mensaje a RabbitMQ');
    }

  }
}
