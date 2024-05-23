/* eslint-disable prettier/prettier */
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() createMessageDto: CreateMessageDto): Promise<void> {
    const message = await this.chatService.create(createMessageDto);
    console.log(message);
    this.server.emit('message', message);
  }

  @SubscribeMessage('join')
  async handleJoin(@MessageBody() username: string, @ConnectedSocket() client: Socket): Promise<void> {
    client.broadcast.emit('userJoined', username);
    const messages = await this.chatService.findAll();
    client.emit('messages', messages);
  }
}
