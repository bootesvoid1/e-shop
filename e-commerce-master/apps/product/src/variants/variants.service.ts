import { VariantValueEntity } from '@app/shared/common/databases/entities/product/_variant/variant-value.entity';
import { VariantEntity } from '@app/shared/common/databases/entities/product/_variant/variant.entity';
import { CreateVariantDto } from '@app/shared/dtos/product/variants/create-variant.dto';
import { UpdateVariantsDto } from '@app/shared/dtos/product/variants/update-variant.dto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(VariantEntity)
    private readonly variantsRepository: Repository<VariantEntity>,

    @InjectRepository(VariantValueEntity)
    private readonly variantValueRepository: Repository<VariantValueEntity>,
  ) {}

  async create(payload: CreateVariantDto) {
    const { values, ...rest } = payload;

    // Step 1: Create and save the variant entity
    const variant = this.variantsRepository.create(rest);
    const savedVariant = await this.variantsRepository.save(variant);

    // Step 2: Assign the saved variant to each value
    const variantValues = (values ?? []).map((value) =>
      this.variantValueRepository.create({
        ...value,
        variant: savedVariant,
      }),
    );

    // Step 3: Save values
    const savedValues = await this.variantValueRepository.save(variantValues);

    // Step 4: Return variant with values (optional)
    return {
      ...savedVariant,
      values: savedValues,
    };
  }

  async createValues(payload: Partial<VariantValueEntity>[]) {
    return await this.variantValueRepository.save(payload);
  }

  async findAll(payload: { page: number; limit: number; query: any }) {
    const { page, limit, query } = payload;
    const where = await this.formatFilter(query);
    const [data, count] = await this.variantsRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      // order: { createdAt: sort },
    });
    return { data, count };
  }

  async findUnpaginated() {
    return await this.variantsRepository.find({ relations: ['values'] });
  }

  async findOne(id: string) {
    return await this.variantsRepository.findOne({
      where: { id },
      relations: ['values'],
    });
  }

  async update(payload: { id: string; updateVariantsDto: UpdateVariantsDto }) {
    const { id, updateVariantsDto } = payload;

    const variant = await this.findOne(id);
    if (!variant) throw new NotFoundException('Variant not found');

    // Optional: delete old values before adding new ones
    await this.variantValueRepository.delete({ variant: { id } });

    // Prepare new values with proper foreign key
    const newValues = (updateVariantsDto.values ?? []).map((v) =>
      this.variantValueRepository.create({
        ...v,
        variant: variant, // explicitly link
      }),
    );

    // Save new values
    const savedValues = await this.variantValueRepository.save(newValues);

    // Update other fields
    delete updateVariantsDto.values;
    await this.variantsRepository.update(id, updateVariantsDto);

    // Return updated variant with values (optional)
    return {
      ...variant,
      ...updateVariantsDto,
      values: savedValues,
    };
  }
  async delete(id: string) {
    try {
      await this.variantsRepository.delete(id);
    } catch (e: any) {
      throw new BadRequestException("Can't delete this Variant");
    }
  }

  private formatFilter(query: any): FindOptionsWhere<VariantEntity> {
    const where: FindOptionsWhere<VariantEntity> = {};
    where.deleted = false;

    // Process `label` if present
    if (query.searchTerm && query.searchTerm !== '') {
      // Case-insensitive exact match for `label`
      where.name = ILike(`%${query.searchTerm}%`);
    }

    return where;
  }
}
