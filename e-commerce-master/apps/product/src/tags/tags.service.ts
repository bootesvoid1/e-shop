import { TagsEntity } from '@app/shared/common/databases/entities/product/tags.entity';
import { CreateTagDto } from '@app/shared/dtos/product/tags/create_tags.dto';
import { UpdateTagsDto } from '@app/shared/dtos/product/tags/update_tags.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagsEntity)
    private readonly tagsRepository: Repository<TagsEntity>,
  ) {}

  async create(payload: CreateTagDto) {
    const { name, description } = payload;

    const tagsWithSameName = await this.tagsRepository.findOne({
      where: { name },
    });

    if (tagsWithSameName) {
      throw new ConflictException(`Tag with name ${name} already exist`);
    }
    const newTag = this.tagsRepository.create({
      name,
      description,
    });
    return await this.tagsRepository.save(newTag);
  }

  async findAll(payload: { page: number; limit: number; query: any }) {
    const { page, limit, query } = payload;
    const where = await this.formatFilter(query);

    const [data, count] = await this.tagsRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, count };
  }

  async findUnpaginated() {
    return await this.tagsRepository.find();
  }

  async findOne(id: string) {
    return await this.tagsRepository.findOne({ where: { id } });
  }

  async update(payload: { id: string; payload: UpdateTagsDto }) {
    const { id, payload: updateFeatureDto } = payload;
    const tags = await this.tagsRepository.findOne({ where: { id } });
    if (!tags) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    return await this.tagsRepository.update(id, updateFeatureDto);
  }

  async delete(id: string) {
    const feature = await this.tagsRepository.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException(`Feature with id ${id} not found`);
    }
    return await this.tagsRepository.delete(id);
  }

  private formatFilter(query: any): FindOptionsWhere<TagsEntity> {
    const where: FindOptionsWhere<TagsEntity> = {};
    where.deleted = false;

    // Process `label` if present
    if (query.searchTerm && query.searchTerm !== '') {
      // Case-insensitive exact match for `label`
      where.name = ILike(`%${query.searchTerm}%`);
    }

    return where;
  }
}
