import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Category } from '../categories/category.entity';
import { Resource } from '../resources/resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Resource])],
  providers: [SeedService],
})
export class SeedModule {}
