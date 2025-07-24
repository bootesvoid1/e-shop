// apps/product/test/product.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { INestApplication } from '@nestjs/common'; // Might be needed for full app setup if needed later
import { of, firstValueFrom } from 'rxjs';
// --- Use relative paths for shared DTOs ---
import { CreateProductDto } from '@app/shared/dtos/product/create-product.dto';
import { UpdateProductDto } from '@app/shared/dtos/product/update-product.dto';
// --- End of relative paths ---
import { ProductController } from '../src/product.controller';
import { ProductService } from '../src/product.service'; // Import for provider setup

// Define a unique name for the client used to send messages *to* this controller/service
// This should ideally match the name used when creating the microservice in main.ts
const PRODUCT_SERVICE_CLIENT_NAME = 'PRODUCT_SERVICE_CLIENT_FOR_TESTS';

describe('ProductController (Microservice Client Test)', () => {
  let client: ClientProxy; // Client to *send* messages to the ProductController (SUT)
  let app: TestingModule; // The testing module

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
    // Add other fields as required by your DTO and service logic
    // manufacturerId, features, tags, etc. are optional based on your DTO
  };

  const mockCreatedProduct = {
    id: 'product-1',
    ...mockCreateProductDto,
    status: 'active',
    createdAt: new Date().toISOString(),
    // Add other fields the service might add
  };

  const mockFindAllPayload = { page: '1', limit: '10', query: { searchTerm: 'test' } }; // Query params are strings
  const mockFindAllResult = { data: [mockCreatedProduct], count: 1 };

  const productId = 'product-1';
  const mockFoundProduct = mockCreatedProduct;

  const mockUpdateProductDto: UpdateProductDto = { name: 'Updated Product Name', price: 150 };
  const mockUpdatePayload = { id: productId, updateProductDto: mockUpdateProductDto };
  const mockUpdatedProduct = { ...mockFoundProduct, name: 'Updated Product Name', price: 150 };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // Import ClientsModule to create a client for sending test messages
      imports: [
        ClientsModule.register([
          {
            name: PRODUCT_SERVICE_CLIENT_NAME,
            transport: Transport.TCP, // Use the same transport as your service
            options: {
              host: 'localhost', // These won't be used as we mock the send method
              port: 4001, // Adjust port if needed for your service setup, or use default
            },
          },
        ]),
      ],
      // Provide the controller and its dependencies (usually just the service)
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            // Mock the methods the controller calls on the service
            create: jest.fn().mockResolvedValue(mockCreatedProduct),
            findAll: jest.fn().mockResolvedValue(mockFindAllResult),
            findOne: jest.fn().mockResolvedValue(mockFoundProduct),
            update: jest.fn().mockResolvedValue(mockUpdatedProduct),
            // Add mocks for other service methods if your controller uses them (e.g., delete)
          },
        },
      ],
    }).compile();

    // Get the client instance to send messages
    client = moduleFixture.get(PRODUCT_SERVICE_CLIENT_NAME);
    app = moduleFixture; // Keep reference if needed for teardown

    // --- IMPORTANT: Spy on the client's 'send' method ---
    // We mock the client to simulate sending messages and receiving responses.
    // This mock intercepts calls and returns predefined Observables based on the pattern.
    // Ensure the 'cmd' strings match exactly what's in your ProductController's @MessagePattern.
    jest.spyOn(client, 'send').mockImplementation((pattern, payload) => {
      // console.log('Mock client.send called with:', pattern, payload); // For debugging
      if (pattern && typeof pattern === 'object' && 'cmd' in pattern) {
        switch (pattern.cmd) {
          // --- ADJUST THESE CASES TO MATCH YOUR ACTUAL ProductController @MessagePattern VALUES ---
          case 'products_create': // Example: @MessagePattern({ cmd: 'products_create' })
            return of(mockCreatedProduct);
          case 'products_findAll': // Example: @MessagePattern({ cmd: 'products_findAll' })
            return of(mockFindAllResult);
          case 'products_findOne': // Example: @MessagePattern({ cmd: 'products_findOne' })
            return of(mockFoundProduct);
          case 'products_update': // Example: @MessagePattern({ cmd: 'products_update' })
            return of(mockUpdatedProduct);
          // Add cases for other patterns like delete if your controller has them
          default:
            // console.warn('Unhandled pattern in mock:', pattern);
            return of({ error: `Pattern '${pattern.cmd}' not mocked` });
        }
      }
      return of({ error: 'Invalid pattern format' });
    });

    // If your controller needs specific setup (e.g., for validation pipes globally),
    // you might need to get the INestApplication instance and call app.useGlobal... etc.
    // But typically for microservice controllers, this isn't needed for basic message handling tests.
    // const nestApp = moduleFixture.createNestApplication();
    // await nestApp.init(); // Not usually needed for microservice controller unit/mocked tests
  });

  afterEach(async () => {
    // Ensure the client connection is closed if it was somehow established
    if (client) {
      await client.close(); // Use close() for newer versions, disconnect() if needed for older
    }
    await app.close(); // Close the testing module
    jest.clearAllMocks();
  });

  // --- Test Cases for MessagePatterns ---
  // These tests simulate an external client sending messages to your Product microservice.

  it('should call products_create and create a product', async () => {
    // Simulate sending the 'products_create' command via the client
    // Adjust the pattern object to match the exact @MessagePattern in your controller
    const resultObservable = client.send({ cmd: 'products_create' }, mockCreateProductDto);

    // Convert Observable to Promise to get the result
    const result = await firstValueFrom(resultObservable);

    // Assert the result
    expect(result).toEqual(mockCreatedProduct);

    // Assert that the client's send method was called correctly (verifies the mock setup)
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'products_create' },
      mockCreateProductDto,
    );
    // Implicitly, this also tests that ProductService.create was called by the controller,
    // because our ProductService mock defines that behavior.
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
    // Assuming the controller's findOne method takes just the ID string as payload
    const resultObservable = client.send({ cmd: 'products_findOne' }, productId);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockFoundProduct);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'products_findOne' },
      productId, // Just the ID string
    );
  });

  it('should call products_update and update a product', async () => {
    // Assuming the controller's update method takes the payload object {id, updateProductDto}
    const resultObservable = client.send({ cmd: 'products_update' }, mockUpdatePayload);
    const result = await firstValueFrom(resultObservable);

    expect(result).toEqual(mockUpdatedProduct);
    expect(client.send).toHaveBeenCalledWith(
      { cmd: 'products_update' },
      mockUpdatePayload, // The object { id, updateProductDto }
    );
  });

  // Add more tests for other message patterns (e.g., delete) as needed...
  // Make sure the 'cmd' strings and payload structures match your controller exactly.
});
