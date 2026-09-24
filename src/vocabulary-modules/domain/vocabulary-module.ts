import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VocabularyTerm {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  term: string;

  @ApiProperty({ type: String })
  definition: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class VocabularyModule {
  @Exclude({ toPlainOnly: true })
  deletedAt?: Date | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  folderId?: string | null;

  @Exclude({ toPlainOnly: true })
  userId: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  title: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => [VocabularyTerm] })
  terms: VocabularyTerm[];
}
