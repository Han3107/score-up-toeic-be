import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type ExamResultSchemaDocument = HydratedDocument<ExamResultSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class ExamResultSchemaClass extends EntityDocumentHelper {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  examId: string;

  @Prop({ type: Number, required: true })
  score: number;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const ExamResultSchema = SchemaFactory.createForClass(
  ExamResultSchemaClass,
);
