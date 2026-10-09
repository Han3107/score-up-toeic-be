import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';

import mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type MessageSchemaDocument = HydratedDocument<MessageSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class MessageSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: Boolean,
    default: false,
  })
  isRead?: boolean;

  @Prop({
    type: String,
  })
  content?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchemaClass',
    autopopulate: true,
  })
  sender?: UserSchemaClass;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConversationSchemaClass',
    index: true,
  })
  conversation?: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(MessageSchemaClass);
