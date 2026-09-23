import { QuestionGroupSchemaClass } from '../../../../../question-groups/infrastructure/persistence/document/entities/question-group.schema';

import { ToeicTestSchemaClass } from '../../../../../toeic-tests/infrastructure/persistence/document/entities/toeic-test.schema';

import mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type QuestionSchemaDocument = HydratedDocument<QuestionSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class QuestionSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: Number,
  })
  orderIndex?: number | null;

  @Prop({
    type: String,
  })
  explanation?: string | null;

  @Prop({
    type: String,
  })
  correctAnswer: string;

  @Prop({
    type: [String],
  })
  options: string[];

  @Prop({
    type: String,
  })
  prompt: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionGroupSchemaClass',
    autopopulate: true,
  })
  questionGroup?: QuestionGroupSchemaClass | null;

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

export const QuestionSchema = SchemaFactory.createForClass(QuestionSchemaClass);
