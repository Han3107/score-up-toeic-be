import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from '../messages/messages.service';
import { FriendRequestsService } from '../friend-requests/friend-requests.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private connectedUsers = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
    private friendRequestsService: FriendRequestsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        throw new Error('Token not found');
      }
      const payload = await this.jwtService.verifyAsync(token);
      if (!client.data) {
        client.data = {};
      }
      client.data.user = payload;
      this.connectedUsers.set(payload.id, client.id);
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: { conversationId: string; content: string; receiverId: string },
  ) {
    const senderId = client.data.user.id;
    const areFriends = await this.friendRequestsService.areFriends(
      senderId,
      payload.receiverId,
    );
    if (!areFriends) throw new WsException('Not friends');

    const message = await this.messagesService.create({
      conversation: { id: payload.conversationId } as any,
      sender: { id: senderId } as any,
      content: payload.content,
      isRead: false,
    });

    const receiverSocketId = this.connectedUsers.get(payload.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receiveMessage', message);
    }
  }
}
