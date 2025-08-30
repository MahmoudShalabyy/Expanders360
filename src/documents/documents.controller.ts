import { Controller, Post, Get, Query, Body, UseGuards, ParseIntPipe, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentsService } from './documents.service';
import { CustomJwtGuard } from '../auth/custom-jwt.guard';

@Controller('documents')
@UseGuards(CustomJwtGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
        },
      }),
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('tags') tags: string, // يقبل String خام زي "contract,UAE"
    @Body('projectId', new ParseIntPipe({ errorHttpStatusCode: 400 })) projectId: number,
  ) {
    // تحويل tags من String لـ Array
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const file_path = `/uploads/${file.filename}`;
    return this.documentsService.createDocument(title, file_path, tagsArray, projectId);
  }

  @Get('project/:projectId')
  async getDocumentsByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.documentsService.findDocumentsByProject(projectId);
  }

  @Get('search')
  async searchDocuments(@Query('query') query: string) {
    return this.documentsService.searchDocuments(query);
  }
}