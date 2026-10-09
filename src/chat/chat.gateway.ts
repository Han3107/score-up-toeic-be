import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from '../messages/messages.service';
import { FriendRequestsService } from '../friend-requests/friend-requests.service';
import { ConversationsService } from '../conversations/conversations.service';
import { UserDto } from '../users/dto/user.dto';
import { ConversationDto } from '../conversations/dto/conversation.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private connectedUsers = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
    private friendRequestsService: FriendRequestsService,
    private conversationsService: ConversationsService,
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

  handleDisconnect(client: Socket) {
    if (client.data?.user?.id) {
      this.connectedUsers.delete(client.data.user.id);
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

    const conversation = await this.conversationsService.findById(
      payload.conversationId,
    );
    if (!conversation) {
      throw new WsException('Conversation not found');
    }

    const isSenderParticipant = conversation.participants?.some(
      (p) => p.id === senderId || p.id?.toString() === senderId,
    );
    const isReceiverParticipant = conversation.participants?.some(
      (p) =>
        p.id === payload.receiverId || p.id?.toString() === payload.receiverId,
    );

    if (!isSenderParticipant || !isReceiverParticipant) {
      throw new WsException('Users are not participants of the conversation');
    }

    const senderDto = new UserDto();
    senderDto.id = senderId;

    const conversationDto = new ConversationDto();
    conversationDto.id = payload.conversationId;

    const message = await this.messagesService.create({
      conversation: conversationDto,
      sender: senderDto,
      content: payload.content,
      isRead: false,
    });

    const receiverSocketId = this.connectedUsers.get(payload.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receiveMessage', message);
    }
  }
}
