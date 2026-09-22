import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type CategorySchemaDocument = HydratedDocument<CategorySchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class CategorySchemaClass extends EntityDocumentHelper {
  @Prop({
    type: Number,
  })
  sequence?: number;

  @Prop({
    type: String,
    enum: ['ACTIVE', 'HIDDEN'],
    default: 'ACTIVE',
  })
  status: string;

  @Prop({
    type: String,
  })
  description?: string;

  @Prop({
    type: String,
    unique: true,
    maxlength: 255,
  })
  name: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(CategorySchemaClass);
