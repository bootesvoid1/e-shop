import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CategoryEntity } from './entities/product/category.entity';
import { ManufacturersEntity } from './entities/product/manufacturer.entity';
import { FeaturesEntity } from './entities/product/product-features.entity';
import { ProductsEntity } from './entities/product/product.entity';
import { ReviewsEntity } from './entities/product/review.entity';
import { TagsEntity } from './entities/product/tags.entity';
import { DocumentEntity } from './entities/document.entity';
import { VariantEntity } from './entities/product/_variant/variant.entity';
import { VariantValueEntity } from './entities/product/_variant/variant-value.entity';
import { ProductVariantEntity } from './entities/product/_variant/product-variant.entity';
import { SpecificationEntity } from './entities/product/specifications.entity';
import { SpecificationGroupEntity } from './entities/product/specifications-group.entity';

config();

const configService = new ConfigService();

export const productDBdataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_PRODUCT_NAME'),
  entities: [
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
  ],
  migrations: ['dist/common/database/migrations/*.js'],
  synchronize: true,
};

export const AppDataSource = new DataSource(productDBdataSourceOptions);
