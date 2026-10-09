import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';

import mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type FriendRequestSchemaDocument =
  HydratedDocument<FriendRequestSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class FriendRequestSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
  })
  status?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchemaClass',
    autopopulate: true,
    index: true,
  })
  receiver?: UserSchemaClass;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchemaClass',
    autopopulate: true,
    index: true,
  })
  sender?: UserSchemaClass;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const FriendRequestSchema = SchemaFactory.createForClass(
  FriendRequestSchemaClass,
);
