import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

@Schema({ _id: true, timestamps: true })
export class VocabularyTermSchemaClass {
  @Prop({ type: String, required: true, maxlength: 255 })
  term: string;

  @Prop({ type: String, required: true })
  definition: string;
}
const VocabularyTermSchema = SchemaFactory.createForClass(
  VocabularyTermSchemaClass,
);

export type VocabularyModuleSchemaDocument =
  HydratedDocument<VocabularyModuleSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class VocabularyModuleSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: Date,
  })
  deletedAt?: Date | null;

  @Prop({
    type: String,
    index: true,
  })
  folderId?: string | null;

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

  @Prop({
    type: [VocabularyTermSchema],
    default: [],
    validate: [
      (val: any[]) => val.length <= 500,
      'Module cannot have more than 500 terms',
    ],
  })
  terms: VocabularyTermSchemaClass[];
}

export const VocabularyModuleSchema = SchemaFactory.createForClass(
  VocabularyModuleSchemaClass,
);
