import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {

  constructor(
    @Inject('NOTIFICATIONS_RABBIT_SERVICE') private readonly rabbitMQClient: ClientProxy
  ) { }

  async onModuleInit() {
    try {
      await this.rabbitMQClient.connect();
      console.log('🟢 Rabbit conectado al iniciar');
    } catch (err) {
      console.error('🔴 Error conectando a Rabbit:', err);
    }
  }

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      /*
      emit() = evento (fire-and-forget)
      NO devuelve respuesta del consumer
  
      Esperar respuesta (RPC con Rabbit)
      Tenés que usar send() en vez de emit()
      */

      /* this.rabbitMQClient
        .emit('msg_to_process', createNotificationDto)
        .subscribe({
          //next: () => console.log('Mensaje enviado a la cola', createNotificationDto),
          error: (err) => console.error('Error en el flujo', err),
        }); */

      /*
        suscribe al observable que devuelve emit() para manejar errores de conexión o envío.
        Aunque es un evento, Nest devuelve un Observable (RxJS)
        Pero no es para recibir datos, es solo para:
        saber si hubo error
        saber cuándo terminó el envío
        Sin .subscribe() → NO se ejecuta nada
      */

      //Convertí el Observable a Promise:
      await lastValueFrom(
        this.rabbitMQClient.emit('msg_to_process', createNotificationDto)
      );

      return {
        status: 'ok',
        message: 'Mensaje enviado',
      };

    } catch (err: any) {

      console.error('Error al enviar mensaje a RabbitMQ', err);
      throw new InternalServerErrorException('Error al enviar mensaje a RabbitMQ');
    }

  }
}
