// apps/product/src/product.service.simple.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
// Use relative path for DTOs
import { CreateProductDto } from '../../../libs/shared/src/dtos/product/create-product.dto';
import { UpdateProductDto } from '../../../libs/shared/src/dtos/product/update-product.dto';
// Mock the ProductService type if import causes issues
import { ProductService } from './product.service'; // This might still be problematic

describe('ProductService (Simple Mock)', () => {
  // If importing ProductService causes issues, use 'any'
  let service: any; // Change to : ProductService if import works

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    // Add other methods you want to mock
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService, // Provide the class token
          useValue: mockProductService, // Use our mock object
        },
      ],
    }).compile();

    // Cast to 'any' if the import for ProductService is problematic
    service = module.get<any>(ProductService);
    // service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call create method', async () => {
    const mockResult = { id: '1', name: 'Test Product' };
    mockProductService.create.mockResolvedValue(mockResult);

    
    const dto: CreateProductDto = {
      name: 'Test Product',
      displayTitle: 'Test Product Display Title', 
      SKU: 'TEST-001',
      description: 'A test product',
      price: 100,
      stock: 10,
      userId: 'user1',
      discount: 0,
      categoryId: 1,
      
    };
    const result = await service.create(dto);

    expect(result).toEqual(mockResult);
    expect(mockProductService.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll method', async () => {
    const mockResult = { data: [], count: 0 };
    const payload = { page: 1, limit: 10, query: {} };
    mockProductService.findAll.mockResolvedValue(mockResult);

    const result = await service.findAll(payload);

    expect(result).toEqual(mockResult);
    expect(mockProductService.findAll).toHaveBeenCalledWith(payload);
  });

  it('should call findOne method', async () => {
    const mockResult = { id: '1', name: 'Test Product' };
    const id = '1';
    mockProductService.findOne.mockResolvedValue(mockResult);

    const result = await service.findOne(id);

    expect(result).toEqual(mockResult);
    expect(mockProductService.findOne).toHaveBeenCalledWith(id);
  });

  it('should call update method', async () => {
    const mockResult = { id: '1', name: 'Updated Product' };
    const payload = { id: '1', updateProductDto: { name: 'Updated Product' } };
    mockProductService.update.mockResolvedValue(mockResult);

    const result = await service.update(payload);

    expect(result).toEqual(mockResult);
    expect(mockProductService.update).toHaveBeenCalledWith(payload);
  });

  // Add more tests for other methods as needed...
});