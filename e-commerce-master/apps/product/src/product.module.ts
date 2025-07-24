import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.broker';
import { FeatureBroker } from './feature/feature.broker';
import { FeatureService } from './feature/feature.service';
import { TagsBroker } from './tags/tags.broker';
import { TagsService } from './tags/tags.service';

import { ManufacturorBroker } from './manufacturer/manufacturer.broker';
import { ManufacturorService } from './manufacturer/manufacturer.service';

import { VariantsBroker } from './variants/variants.broker';
import { VariantsService } from './variants/variants.service';
import { productDBdataSourceOptions } from '@app/shared/common/databases/product_db.config';
import { CategoryEntity } from '@app/shared/common/databases/entities/product/category.entity';
import { ManufacturersEntity } from '@app/shared/common/databases/entities/product/manufacturer.entity';
import { FeaturesEntity } from '@app/shared/common/databases/entities/product/product-features.entity';
import { ProductsEntity } from '@app/shared/common/databases/entities/product/product.entity';
import { ReviewsEntity } from '@app/shared/common/databases/entities/product/review.entity';
import { TagsEntity } from '@app/shared/common/databases/entities/product/tags.entity';
import { DocumentEntity } from '@app/shared/common/databases/entities/document.entity';
import { VariantEntity } from '@app/shared/common/databases/entities/product/_variant/variant.entity';
import { VariantValueEntity } from '@app/shared/common/databases/entities/product/_variant/variant-value.entity';
import { ProductVariantEntity } from '@app/shared/common/databases/entities/product/_variant/product-variant.entity';
import { SpecificationEntity } from '@app/shared/common/databases/entities/product/specifications.entity';
import { SpecificationGroupEntity } from '@app/shared/common/databases/entities/product/specifications-group.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(productDBdataSourceOptions),
    TypeOrmModule.forFeature([
      CategoryEntity,
      ManufacturersEntity,
      FeaturesEntity,
      ProductsEntity,
      ReviewsEntity,
      TagsEntity,
      DocumentEntity,
      VariantEntity,
      VariantValueEntity,
      ProductVariantEntity,
      SpecificationEntity,
      SpecificationGroupEntity,
    ]),
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [
    ProductController,
    CategoryController,
    FeatureBroker,
    TagsBroker,
    ProductController,
    ManufacturorBroker,
    VariantsBroker,
  ],
  providers: [
    ProductService,
    CategoryService,
    FeatureService,
    TagsService,
    ProductService,
    ManufacturorService,
    VariantsService,
  ],
})
export class ProductModule {}
