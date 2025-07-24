import { FeaturesEntity } from '@app/shared/common/databases/entities/product/product-features.entity';
import { CreateFeatureDto } from '@app/shared/dtos/product/_features/create_feature.dto';
import { UpdateFeatureDto } from '@app/shared/dtos/product/_features/update_feature.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(FeaturesEntity)
    private readonly FeatureRepository: Repository<FeaturesEntity>,
  ) {}

  async create(payload: CreateFeatureDto) {
    const { name, description } = payload;
    const featureNameExist = await this.FeatureRepository.findOne({
      where: { name },
    });
    if (featureNameExist) {
      throw new ConflictException(`Feature with name ${name} already exist`);
    }

    const newFeature = this.FeatureRepository.create({
      name,
      description,
    });
    return await this.FeatureRepository.save(newFeature);
  }

  async findAll(payload: { page: number; limit: number; query: any }) {
    const { page, limit, query } = payload;
    const where = await this.formatFilter(query);

    const [data, count] = await this.FeatureRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, count };
  }
  async findUnpaginated() {
    return await this.FeatureRepository.find();
  }

  async findOne(id: string) {
    return await this.FeatureRepository.findOne({ where: { id } });
  }

  async update(payload: { id: string; payload: UpdateFeatureDto }) {
    const { id, payload: updateFeatureDto } = payload;
    const feature = await this.FeatureRepository.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException(`Feature with id ${id} not found`);
    }
    return await this.FeatureRepository.update(id, updateFeatureDto);
  }

  async delete(id: string) {
    const feature = await this.FeatureRepository.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException(`Feature with id ${id} not found`);
    }
    return await this.FeatureRepository.delete(id);
  }

  private formatFilter(query: any): FindOptionsWhere<FeaturesEntity> {
    const where: FindOptionsWhere<FeaturesEntity> = {};
    where.deleted = false;

    // Process `label` if present
    if (query.searchTerm && query.searchTerm !== '') {
      // Case-insensitive exact match for `label`
      where.name = ILike(`%${query.searchTerm}%`);
    }

    return where;
  }
}
