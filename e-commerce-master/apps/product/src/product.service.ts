import { DocumentEntity } from '@app/shared/common/databases/entities/document.entity';
import { ProductVariantEntity } from '@app/shared/common/databases/entities/product/_variant/product-variant.entity';
import { VariantValueEntity } from '@app/shared/common/databases/entities/product/_variant/variant-value.entity';
import { VariantEntity } from '@app/shared/common/databases/entities/product/_variant/variant.entity';
import { CategoryEntity } from '@app/shared/common/databases/entities/product/category.entity';
import { ManufacturersEntity } from '@app/shared/common/databases/entities/product/manufacturer.entity';
import { FeaturesEntity } from '@app/shared/common/databases/entities/product/product-features.entity';
import { ProductsEntity } from '@app/shared/common/databases/entities/product/product.entity';
import { SpecificationGroupEntity } from '@app/shared/common/databases/entities/product/specifications-group.entity';
import { SpecificationEntity } from '@app/shared/common/databases/entities/product/specifications.entity';
import { TagsEntity } from '@app/shared/common/databases/entities/product/tags.entity';
import { CreateProductDto } from '@app/shared/dtos/product/create-product.dto';
import { UpdateProductDto } from '@app/shared/dtos/product/update-product.dto';

import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productRepository: Repository<ProductsEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(FeaturesEntity)
    private readonly featuresRepository: Repository<FeaturesEntity>,
    @InjectRepository(ManufacturersEntity)
    private readonly manufacturerRepository: Repository<ManufacturersEntity>,

    @InjectRepository(TagsEntity)
    private readonly tagsRepository: Repository<TagsEntity>,
    @InjectRepository(VariantEntity)
    private readonly variantRepository: Repository<VariantEntity>,

    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,

    @InjectRepository(ProductVariantEntity)
    private readonly productVariantRepository: Repository<ProductVariantEntity>,

    @InjectRepository(VariantValueEntity)
    private readonly variantValueRepository: Repository<VariantValueEntity>,

    @InjectRepository(SpecificationGroupEntity)
    private readonly specificationGroupRepository: Repository<SpecificationGroupEntity>,

    @InjectRepository(SpecificationEntity)
    private readonly specificationRepository: Repository<SpecificationEntity>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductsEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId.toString() },
    });
    if (!category) throw new NotFoundException('Category not found');

    const manufacturer = dto.manufacturerId
      ? await this.manufacturerRepository.findOne({
          where: { id: dto.manufacturerId.toString() },
        })
      : undefined;

    if (dto.manufacturerId && !manufacturer)
      throw new NotFoundException('Manufacturer not found');

    const features =
      dto.features?.map((f) => this.featuresRepository.create(f)) ?? [];

    const product = this.productRepository.create({
      name: dto.name,
      displayTitle: dto.displayTitle,
      SKU: dto.SKU,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      userId: dto.userId,
      discount: dto.discount,
      status: dto.status ?? 'active',
      category,
      manufacturer: manufacturer ?? undefined,
      features,
    });

    const savedProduct = await this.productRepository.save(product);

    if (dto.features?.length) {
      const features = dto.features.map((f) =>
        this.featuresRepository.create(f),
      );
      await this.featuresRepository.save(features); // Save new features first

      savedProduct.features = features;
      await this.productRepository.save(savedProduct); // Save the relation
    }

    let tags: TagsEntity[] = [];

    if (dto.tags?.length) {
      tags = await Promise.all(
        dto.tags.map(async (tagDto) => {
          const existing = await this.tagsRepository.findOne({
            where: { name: tagDto.name },
          });
          return existing ?? this.tagsRepository.create(tagDto);
        }),
      );

      // Save only the new ones (those without `id`)
      const newTags = tags.filter((tag) => !tag.id);
      if (newTags.length) await this.tagsRepository.save(newTags);

      savedProduct.tags = tags;
      await this.productRepository.save(savedProduct);
    }

    if (dto.variants?.length) {
      const productVariants: ProductVariantEntity[] = [];

      for (const variantDto of dto.variants) {
        const variant = this.variantRepository.create({
          name: variantDto.name,
          label: variantDto.label,
          type: variantDto.type || 'text',
          values: variantDto.values.map((v) =>
            this.variantValueRepository.create({ label: v.label }),
          ),
        });

        const savedVariant = await this.variantRepository.save(variant);

        const productVariant = this.productVariantRepository.create({
          product: savedProduct,
          variant: savedVariant,
        });

        productVariants.push(
          await this.productVariantRepository.save(productVariant),
        );
      }

      savedProduct.variants = productVariants;
    }

    if (dto.documents?.length) {
      const docs = dto.documents.map((doc) =>
        this.documentRepository.create({ ...doc, product: savedProduct }),
      );
      await this.documentRepository.save(docs);
      savedProduct.documents = docs;
    }

    if (dto.specificationGroups?.length) {
      const groups = dto.specificationGroups.map((groupDto) =>
        this.specificationGroupRepository.create({
          name: groupDto.name,
          product: savedProduct,
          specifications: groupDto.specifications.map((s) =>
            this.specificationRepository.create(s),
          ),
        }),
      );

      await this.specificationGroupRepository.save(groups);
      savedProduct.specificationGroups = groups;
    }

    return savedProduct;
  }

  async findAll(payload: { page: number; limit: number; query: any }) {
    const { page, limit, query } = payload;
    const where = await this.formatFilter(query);

    const [data, count] = await this.productRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: this.getSortOption(query.sort),
      relations: ['documents'],
    });

    return { data, count };
  }

  async findOne(id: string) {
    return await this.productRepository.findOne({
      where: { id },
      relations: [
        'documents',
        'tags',
        'features',
        'category',
        'manufacturer',
        'variants',
        'variants.variant',
        'variants.variant.values',
        'specificationGroups',
      ],
    });
  }

  private formatFilter(query: any): FindOptionsWhere<ProductsEntity> {
    const where: FindOptionsWhere<ProductsEntity> = {};
    where.deleted = false;

    // Process `label` if present
    if (query.searchTerm && query.searchTerm !== '') {
      // Case-insensitive exact match for `label`
      where.name = ILike(`%${query.searchTerm}%`);
    }

    return where;
  }
  private getSortOption(
    sort?: string,
  ): Record<string, 'ASC' | 'DESC'> | undefined {
    switch (sort) {
      case 'price_to_high':
        return { price: 'ASC' };
      case 'price_to_low':
        return { price: 'DESC' };
      case 'createdAt':
      default:
        return { createdAt: 'DESC' };
    }
  }
  async update(payload: {
    id: string;
    updateProductDto: UpdateProductDto;
  }): Promise<ProductsEntity> {
    const { id, updateProductDto: dto } = payload;

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['tags', 'features', 'documents', 'manufacturer', 'category'],
    });

    if (!product) throw new NotFoundException('Product not found');

    // === Update category if changed ===
    if (dto.categoryId && product.category?.id !== dto.categoryId.toString()) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId.toString() },
      });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    // === Update manufacturer if changed ===
    if (
      dto.manufacturerId &&
      product.manufacturer?.id !== dto.manufacturerId.toString()
    ) {
      const manufacturer = await this.manufacturerRepository.findOne({
        where: { id: dto.manufacturerId.toString() },
      });
      if (!manufacturer) throw new NotFoundException('Manufacturer not found');
      product.manufacturer = manufacturer;
    }

    // === Update Features (create new if needed) ===
    if (dto.features?.length) {
      const featureEntities = await Promise.all(
        dto.features.map(async (f) => {
          if (typeof f === 'string') {
            const existing = await this.featuresRepository.findOne({
              where: { id: f },
            });
            return existing;
          } else {
            const created = this.featuresRepository.create(f);
            return this.featuresRepository.save(created);
          }
        }),
      );
      product.features = featureEntities.filter((f): f is FeaturesEntity => f !== null);
    }

    // === Update Tags (create new if needed) ===
    if (dto.tags?.length) {
      const tagEntities = await Promise.all(
        dto.tags.map(async (t) => {
          if (typeof t === 'string') {
            const existing = await this.tagsRepository.findOne({
              where: { id: t },
            });
            return existing;
          } else {
            const existing = await this.tagsRepository.findOne({
              where: { name: t.name },
            });
            return (
              existing ??
              this.tagsRepository.save(this.tagsRepository.create(t))
            );
          }
        }),
      );
      product.tags = tagEntities.filter((t): t is TagsEntity => t !== null);
    }

    // === Update base fields if changed ===
    const baseFields: Partial<ProductsEntity> = {
      name: dto.name,
      SKU: dto.SKU,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      userId: dto.userId,
      discount: dto.discount,
      status: dto.status,
    };

    for (const key of Object.keys(baseFields)) {
      if (dto[key] !== undefined && product[key] !== dto[key]) {
        product[key] = dto[key];
      }
    }

    // === Save the updated product ===
    const updated = await this.productRepository.save(product);

    // === Append new documents if provided ===
    if (dto.documents?.length) {
      const newDocs = dto.documents.map((doc) =>
        this.documentRepository.create({ ...doc, product: updated }),
      );
      await this.documentRepository.save(newDocs);
      updated.documents = [...(updated.documents || []), ...newDocs];
    }

    return updated;
  }
}
