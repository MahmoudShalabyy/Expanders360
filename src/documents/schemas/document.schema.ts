import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'documents' }) // تحديد اسم الـ Collection
export class DocumentEntity extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  file_path: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  projectId: number;

  @Prop({ default: Date.now })
  uploaded_at: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);