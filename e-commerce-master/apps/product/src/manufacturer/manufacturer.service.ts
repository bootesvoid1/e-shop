import { ManufacturersEntity } from '@app/shared/common/databases/entities/product/manufacturer.entity';
import { CreateManufacturorDto } from '@app/shared/dtos/product/manufacturor/create-manufacturor.dto';
import { UpdateManufacturorDto } from '@app/shared/dtos/product/manufacturor/update-manufacturor.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

@Injectable()
export class ManufacturorService {
  constructor(
    @InjectRepository(ManufacturersEntity)
    private readonly manufacturorRepository: Repository<ManufacturersEntity>,
  ) {}

  async create(payload: CreateManufacturorDto) {
    const { name, details } = payload;
    const featureNameExist = await this.manufacturorRepository.findOne({
      where: { name },
    });
    if (featureNameExist) {
      throw new ConflictException(
        `Manufacturor with name ${name} already exist`,
      );
    }

    const newFeature = this.manufacturorRepository.create({
      name,
      details,
    });
    return await this.manufacturorRepository.save(newFeature);
  }

  async findAll(payload: { page: number; limit: number; query: any }) {
    const { page, limit, query } = payload;
    const where = await this.formatFilter(query);

    const [data, count] = await this.manufacturorRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, count };
  }

  async findUnpaginated() {
    return await this.manufacturorRepository.find();
  }

  async findOne(id: string) {
    return await this.manufacturorRepository.findOne({ where: { id } });
  }

  async update(payload: {
    id: string;
    updateManufacturorDto: UpdateManufacturorDto;
  }) {
    const { id, updateManufacturorDto } = payload;
    const feature = await this.manufacturorRepository.findOne({
      where: { id },
    });
    if (!feature) {
      throw new NotFoundException(`Feature with id ${id} not found`);
    }
    return await this.manufacturorRepository.update(id, updateManufacturorDto);
  }

  async delete(id: string) {
    const feature = await this.manufacturorRepository.findOne({
      where: { id },
    });
    if (!feature) {
      throw new NotFoundException(`Feature with id ${id} not found`);
    }
    return await this.manufacturorRepository.delete(id);
  }

  private formatFilter(query: any): FindOptionsWhere<ManufacturersEntity> {
    const where: FindOptionsWhere<ManufacturersEntity> = {};
    where.deleted = false;

    // Process `label` if present
    if (query.searchTerm && query.searchTerm !== '') {
      // Case-insensitive exact match for `label`
      where.name = ILike(`%${query.searchTerm}%`);
    }

    return where;
  }
}
