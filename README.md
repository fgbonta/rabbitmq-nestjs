# Arquitectura de Mensajería
1. Emisor (Producer): Un API Gateway que recibe la petición y publica un mensaje en RabbitMQ.
2. Receptor (Consumer): Un Microservicio que escucha la cola y "procesa" la notificación.

## Stack Usado
* RabbitMQ
* Nest

## Ejecutar en desarrollo

1. Clonar el repositorio

2. Ejecutar
```
npm install
```

3. Clonar el archivo __.env.template__ y renombrar __.env__

4. Llenar las variables de entorno definidas en el __.env__

5. Levantar rabbitmq
```
docker compose up -d
```

6. Ejecutar la aplicación en dev:
```
npm run start:dev
```

7. Interfaz de administración RabbitMQ.
```
http://localhost:15672
```