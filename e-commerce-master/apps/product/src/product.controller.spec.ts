// apps/product/src/product.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { of, firstValueFrom } from 'rxjs'; 
import { CreateProductDto } from '../../../libs/shared/src/dtos/product/create-product.dto';
import { UpdateProductDto } from '../../../libs/shared/src/dtos/product/update-product.dto';
import { ProductController } from './product.controller';
import { ProductService } from './product.service'; 


const PRODUCT_SERVICE_CLIENT_NAME = 'PRODUCT_SERVICE_CLIENT';

describe('ProductController (Microservice Client Test)', () => {
  let client: ClientProxy;
  let app: TestingModule;

  // --- Mock data for tests ---
  const mockCreateProductDto: CreateProductDto = {
    name: 'Test Product',
    displayTitle: 'Test Product Display',
    SKU: 'TEST-001',
    description: 'Test product description',
    price: 100,
    stock: 10,
    userId: 'user-1',
    discount: 0,
    categoryId: 1,
  };

  const mockCreatedProduct = {
    id: 'product-1',
    ...mockCreateProductDto,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  const mockFindAllPayload = { page: 1, limit: 10, query: { searchTerm: 'test' } };
  const mockFindAllResult = { data: [mockCreatedProduct], count: 1 };

  const productId = 'product-1';
  const mockFoundProduct = mockCreatedProduct;

  const mockUpdateProductDto: UpdateProductDto = { name: 'Updated Product Name' };
  const mockUpdatePayload = { id: productId, updateProductDto: mockUpdateProductDto };
  const mockUpdatedProduct = { ...mockFoundProduct, name: 'Updated Product Name' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: PRODUCT_SERVICE_CLIENT_NAME,
            transport: Transport.TCP,
            options: {
              host: 'localhost',
              port: 4001,
            },
          },
        ]),
      ],
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCreatedProduct),
            findAll: jest.fn().mockResolvedValue(mockFindAllResult),
            findOne: jest.fn().mockResolvedValue(mockFoundProduct),
            update: jest.fn().mockResolvedValue(mockUpdatedProduct),
          },
        },
      ],
    }).compile();

    client = module.get(PRODUCT_SERVICE_CLIENT_NAME);
    app = module;

    // --- Mock client.send to return Observables ---
    jest.spyOn(client, 'send').mockImplementation((pattern, payload) => {
      if (pattern && typeof pattern === 'object' && 'cmd' in pattern) {
        switch (pattern.cmd) {
          case 'products_create':
            return of(mockCreatedProduct); // Return Observable
          case 'products_findAll':
            return of(mockFindAllResult);
          case 'products_findOne':
            return of(mockFoundProduct);
          case 'products_update':
            return of(mockUpdatedProduct);
          default:
            return of({ error: `Pattern '${pattern.cmd}' not mocked` });
        }
      }
      return of({ error: 'Invalid pattern format' });
    });
  });

  afterEach(async () => {
    if (client) {
      await client.close();
    }
    await app.close();
    jest.clearAllMocks();
  });

  // --- Test Cases for MessagePatterns ---
  // Convert Observables to Promises using firstValueFrom for assertion

  it('should call products_create and create a product', async () => {
    const resultObservable = client.send({ cmd: 'products_create' }, mockCreateProductDto);
    // Convert Observable to Promise
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockCreatedProduct);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'products_create' },
      mockCreateProductDto,
    );
  });

  it('should call products_findAll and get products', async () => {
    const resultObservable = client.send({ cmd: 'products_findAll' }, mockFindAllPayload);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockFindAllResult);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'products_findAll' },
      mockFindAllPayload,
    );
  });

  it('should call products_findOne and get a product', async () => {
    const resultObservable = client.send({ cmd: 'products_findOne' }, productId);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockFoundProduct);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'products_findOne' },
      productId,
    );
  });

  it('should call products_update and update a product', async () => {
    const resultObservable = client.send({ cmd: 'products_update' }, mockUpdatePayload);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockUpdatedProduct);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'products_update' },
      mockUpdatePayload,
    );
  });
});
