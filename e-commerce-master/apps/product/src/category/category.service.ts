import { DocumentEntity } from '@app/shared/common/databases/entities/document.entity';
import { CategoryEntity } from '@app/shared/common/databases/entities/product/category.entity';
import { CreateCategoryDto } from '@app/shared/dtos/product/category/create-category.dto';
import { UpdateCategoryDto } from '@app/shared/dtos/product/category/update-category.dto';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
  ) {}

  async create(payload: CreateCategoryDto) {
    const { name, description, slug, document } = payload;

    const categoryNameExist = await this.categoryRepository.findOne({
      where: { name },
    });

    if (categoryNameExist) {
      throw new ConflictException(`Category with name ${name} already exists`);
    }

    const newCategory = this.categoryRepository.create({
      name,
      description,
      slug,
    });

    try {
      const savedCategory = await this.categoryRepository.save(newCategory);

      if (document && savedCategory) {
        const newDocument = this.documentRepository.create({
          label: document.label,
          url: document.url,
          category: savedCategory, // establish the link here
        });

        await this.documentRepository.save(newDocument);
      }

      return await this.categoryRepository.findOne({
        where: { id: savedCategory.id },
        relations: ['document'],
      });
    } catch (error: any) {
      console.error('[CategoryService][Create] Error:', error);
      throw new InternalServerErrorException(
        `Failed to create category: ${error?.message ?? 'Unknown error'}`,
      );
    }
  }

  async findAll(payload: { page: number; limit: number; query: any }) {
    const { page, limit, query } = payload;
    const where = await this.formatFilter(query);
    const [data, count] = await this.categoryRepository.findAndCount({
      where,
      take: limit,

      skip: (page - 1) * limit,
      // order: { createdAt: sort },
    });
    return { data, count };
  }

  async findUnpaginated() {
    return await this.categoryRepository.find({ relations: ['document'] });
  }
  async findOne(id: string) {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async update(payload: { id: string; updateCategoryDto: UpdateCategoryDto }) {
    const { id, updateCategoryDto } = payload;
    const selectedCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!selectedCategory) {
      throw new ConflictException(`Category with ID ${id} not found`);
    }
    Object.assign(selectedCategory, updateCategoryDto);
    return await this.categoryRepository.save(selectedCategory);
  }

  async delete(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new ConflictException(`Category with ID ${id} not found`);
    }

    category.deleted = !category.deleted; // Toggle the boolean
    await this.categoryRepository.save(category);

    return {
      message: `Category with ID ${id} is now marked as ${category.deleted ? 'deleted' : 'active'}`,
    };
  }

  private formatFilter(query: any): FindOptionsWhere<CategoryEntity> {
    const where: FindOptionsWhere<CategoryEntity> = {};
    where.deleted = false;

    // Process `label` if present
    if (query.searchTerm && query.searchTerm !== '') {
      // Case-insensitive exact match for `label`
      where.name = ILike(`%${query.searchTerm}%`);
    }

    return where;
  }
}
