import { MessageSchemaClass } from '../../../../../messages/infrastructure/persistence/document/entities/message.schema';

import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';

import mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type ConversationSchemaDocument =
  HydratedDocument<ConversationSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class ConversationSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessageSchemaClass',
    autopopulate: true,
  })
  lastMessage?: MessageSchemaClass;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSchemaClass',
        autopopulate: true,
      },
    ],
    index: true,
  })
  participants?: UserSchemaClass[];

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(
  ConversationSchemaClass,
);
