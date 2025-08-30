import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentEntity } from './schemas/document.schema';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentEntity.name)
    private documentModel: Model<DocumentEntity>,
  ) {}

  async createDocument(title: string, file_path: string, tags: string[], projectId: number) {
    const document = new this.documentModel({ title, file_path, tags, projectId });
    return document.save();
  }

  async findDocumentsByProject(projectId: number) {
    return this.documentModel.find({ projectId }).exec();
  }

  async searchDocuments(query: string) {
    return this.documentModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }
}