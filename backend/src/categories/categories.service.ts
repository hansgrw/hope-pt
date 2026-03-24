import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepo.find({ order: { order: 'ASC' } });
  }

  findBySlug(slug: string): Promise<Category | null> {
    return this.categoryRepo.findOne({
      where: { slug },
      relations: ['resources'],
    });
  }
}
