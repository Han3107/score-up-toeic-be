# TICKET-002: Community Real-time Chat (NestJS + MongoDB + WebSockets)

## Description

Implement real-time chat and friend management to replace the current Frontend Firebase `onSnapshot` implementation. The backend will adopt a standard real-time architecture using **MongoDB** for persistent storage and **WebSockets (Socket.io)** for real-time event broadcasting.

The system will store chat history, conversations, and friend relationships in MongoDB document collections. A NestJS WebSocket Gateway will be implemented to handle real-time bi-directional communication. When a user sends a message, the backend will first save the message to MongoDB, update the conversation's last message, and then immediately broadcast the new message payload to the recipient's active socket connection. 

## Functional Requirements

- **Database Schemas (MongoDB):**
  - `FriendRequest`: Tracks sender, receiver, and status (pending, accepted, declined).
  - `Conversation`: Tracks participants (array of user IDs), lastMessage reference, and updatedAt timestamp for sorting.
  - `Message`: Tracks conversationId, senderId, content, read status, and createdAt timestamp.
- **REST APIs (Fallback & Initial Load):**
  - Endpoints to send, accept, decline, and list friend requests.
  - Endpoints to fetch the user's friend list.
  - Endpoints to fetch the list of conversations (paginated).
  - Endpoints to fetch message history for a specific conversation (paginated).
- **WebSocket Gateway (Socket.io):**
  - Implement a WebSocket gateway that authenticates connections using the existing JWT mechanism.
  - Map connected sockets to User IDs to allow targeted message delivery.
  - Handle `sendMessage` events from clients: validate payload, save to MongoDB, and broadcast `receiveMessage` to the specific recipient(s).
  - Broadcast real-time events for friend requests (`friendRequestReceived`, `friendRequestAccepted`).
- **Data Integrity:**
  - Ensure users can only message users they are friends with (or based on allowed privacy settings).
  - Validate that users can only fetch conversations and messages they are a part of.

## Acceptance Criteria

- Mongoose schemas for `FriendRequest`, `Conversation`, and `Message` are created and registered in the database.
- REST API endpoints for managing friends and fetching chat history are implemented and secured with JWT.
- NestJS WebSocket Gateway is properly configured and rejects connections without a valid JWT token.
- Users can successfully establish a WebSocket connection and are mapped to their respective User IDs in the gateway's memory/Redis adapter.
- When a user sends a message, it is persistently saved in the MongoDB `Message` collection and the `Conversation` is updated.
- The recipient receives the `receiveMessage` WebSocket event immediately after the message is saved to the database.
- Real-time notifications for friend requests (sent/accepted) are broadcasted to the target user's active socket.
- Pagination works correctly when fetching older messages via REST API.