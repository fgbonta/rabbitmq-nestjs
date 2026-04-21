import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  
  // no podés inyectarlo como en los módulos, tenés que obtenerlo desde la app.
  const configService = app.get(ConfigService);
  const rabbitUrl = configService.get<string>('RABBITMQ_URL')!;
  const rabbitQueue = configService.get<string>('RABBITMQ_QUEUE_NOTIFICATIONS')!;

  // CONSUMER -> levantar Nest como microservicio.
  // esta instrucción añade un canal de transporte a RabbitMQ
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      queue: rabbitQueue,
      queueOptions: {
        durable: true,
      },
      noAck: false, // con noAck: false, el consumidor debe enviar una confirmación de que el mensaje fue procesado correctamente. Si el consumidor falla antes de enviar esta confirmación, RabbitMQ reentregará el mensaje a otro consumidor disponible, asegurando que no se pierdan mensajes en caso de fallos. Esto es especialmente importante para garantizar la confiabilidad y la durabilidad de los mensajes en sistemas críticos.
    },
  });
  await app.startAllMicroservices();
  //

  await app.listen(process.env.PORT!);

  console.log(`HTTP API corriendo en el puerto: ${process.env.PORT}`);
  console.log(`Rabbit consumer escucha en la cola: ${rabbitQueue}`);

}
bootstrap();
