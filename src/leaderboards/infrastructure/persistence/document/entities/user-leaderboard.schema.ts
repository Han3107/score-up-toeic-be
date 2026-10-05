import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type UserLeaderboardSchemaDocument =
  HydratedDocument<UserLeaderboardSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserLeaderboardSchemaClass extends EntityDocumentHelper {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, unique: true })
  userId: string;

  @Prop({ type: Number, required: true, default: 0 })
  averageScore: number;

  @Prop({ type: Number, required: true, default: 0 })
  totalCompletedExams: number;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const UserLeaderboardSchema = SchemaFactory.createForClass(
  UserLeaderboardSchemaClass,
);
UserLeaderboardSchema.index({ averageScore: -1, totalCompletedExams: -1 });
