import { ConfigService } from '@nestjs/config';
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


export const productDBdataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_PRODUCT_NAME || 'ecommerce_products', 
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
  migrations: ['dist/apps/product/database/migrations/*.js'], // Adjust path to match project structure
  synchronize: process.env.NODE_ENV !== 'production', // Disable synchronize in production
  logging: process.env.NODE_ENV !== 'production', // Enable logging in non-production for debugging
};

// Optionally export DataSource for manual initialization (if needed)
export const ProductAppDataSource = new DataSource(productDBdataSourceOptions);