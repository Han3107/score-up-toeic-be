import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type ToeicTestSchemaDocument = HydratedDocument<ToeicTestSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class ToeicTestSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: Date,
  })
  deletedAt?: Date | null;

  @Prop({
    type: String,
  })
  status: string;

  @Prop({
    type: String,
  })
  category?: string | null;

  @Prop({
    type: String,
  })
  description?: string | null;

  @Prop({
    type: String,
  })
  title: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const ToeicTestSchema =
  SchemaFactory.createForClass(ToeicTestSchemaClass);
