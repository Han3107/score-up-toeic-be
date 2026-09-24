import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type FolderSchemaDocument = HydratedDocument<FolderSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class FolderSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: Date,
  })
  deletedAt?: Date | null;

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
  })
  description?: string | null;

  @Prop({
    type: String,
    maxlength: 255,
    required: true,
  })
  title: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const FolderSchema = SchemaFactory.createForClass(FolderSchemaClass);
