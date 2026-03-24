import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Resource } from './resource.entity';
import {
  CreateResourceDto,
  UpdateResourceDto,
  ResourceQueryDto,
} from './resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepo: Repository<Resource>,
  ) {}

  async findAll(query: ResourceQueryDto): Promise<Resource[]> {
    const options: FindManyOptions<Resource> = {
      relations: ['category'],
      order: { createdAt: 'DESC' },
    };

    // Build scalar filters (category + urgent)
    const baseWhere: Record<string, unknown> = {};

    if (query.category) {
      const catId = parseInt(query.category, 10);
      if (!isNaN(catId)) baseWhere.categoryId = catId;
    }

    if (query.urgent === 'true') {
      baseWhere.isUrgent = true;
    }

    if (query.search) {
      // Fan out search across three columns, each inheriting the scalar filters
      options.where = [
        { ...baseWhere, title: Like(`%${query.search}%`) },
        { ...baseWhere, description: Like(`%${query.search}%`) },
        { ...baseWhere, organization: Like(`%${query.search}%`) },
      ];
    } else {
      options.where = baseWhere;
    }

    return this.resourceRepo.find(options);
  }

  async findOne(id: number): Promise<Resource> {
    const resource = await this.resourceRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!resource) throw new NotFoundException(`Resource #${id} not found`);
    return resource;
  }

  async create(dto: CreateResourceDto): Promise<Resource> {
    const resource = this.resourceRepo.create(dto);
    return this.resourceRepo.save(resource);
  }

  async update(id: number, dto: UpdateResourceDto): Promise<Resource> {
    await this.findOne(id);
    await this.resourceRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.resourceRepo.delete(id);
  }
}
