import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { ChatService } from './chat.service';
import { ChatDto } from './chat.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001', 'https://your-frontend-domain.com'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  // Se ejecuta cuando un cliente se conecta
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
    client.emit('receiveMessage', {
      user: 'AI',
      message:
        'Hi, I am your English teacher. What topic would you like to discuss today?',
    });
  }

  // Se ejecuta cuando un cliente se desconecta
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Escuchar mensajes desde el frontend
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() chatDto: ChatDto) {
    const response = await this.chatService.chat(chatDto);

    // Emitir el mensaje a todos los clientes conectados
    this.server.emit('receiveMessage', { user: 'AI', message: response });

    return response;
  }
}
