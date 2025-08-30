import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../projects/entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentEntity } from '../documents/schemas/document.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectModel(DocumentEntity.name)
    private documentModel: Model<DocumentEntity>,
  ) {}

  async getTopVendors() {
    // Get top 3 vendors per country based on avg match score in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topVendors = await this.matchRepository
      .createQueryBuilder('match')
      .innerJoin('match.project', 'project')
      .innerJoin('match.vendor', 'vendor')
      .select([
        'project.country AS country',
        'vendor.id AS vendor_id',
        'vendor.name AS vendor_name',
        'AVG(match.score) AS avg_score',
      ])
      .where('match.created_at >= :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy('project.country, vendor.id')
      .orderBy('project.country, avg_score', 'DESC')
      .getRawMany();

    // Get document count per country
    const documentCounts = await this.documentModel
      .aggregate([
        {
          $lookup: {
            from: 'projects',
            localField: 'projectId',
            foreignField: 'id',
            as: 'project',
          },
        },
        { $unwind: '$project' },
        {
          $group: {
            _id: '$project.country',
            document_count: { $sum: 1 },
          },
        },
      ])
      .exec();

    // Combine results
    const result = {};
    for (const row of topVendors) {
      const country = row.country;
      if (!result[country]) {
        result[country] = { vendors: [], document_count: 0 };
      }
      result[country].vendors.push({
        id: row.vendor_id,
        name: row.vendor_name,
        avg_score: parseFloat(row.avg_score),
      });
    }

    for (const doc of documentCounts) {
      const country = doc._id;
      if (result[country]) {
        result[country].document_count = doc.document_count;
      } else {
        result[country] = { vendors: [], document_count: doc.document_count };
      }
    }

    return result;
  }
}