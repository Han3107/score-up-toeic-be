import { ToeicTestSchemaClass } from '../../../../../toeic-tests/infrastructure/persistence/document/entities/toeic-test.schema';

import mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type QuestionGroupSchemaDocument =
  HydratedDocument<QuestionGroupSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class QuestionGroupSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: Number,
  })
  orderIndex?: number | null;

  @Prop({
    type: String,
  })
  imageUrl?: string | null;

  @Prop({
    type: String,
  })
  audioUrl?: string | null;

  @Prop({
    type: String,
  })
  passageText?: string | null;

  @Prop({
    type: String,
  })
  title?: string | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ToeicTestSchemaClass',
    autopopulate: true,
  })
  toeicTest: ToeicTestSchemaClass;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const QuestionGroupSchema = SchemaFactory.createForClass(
  QuestionGroupSchemaClass,
);
