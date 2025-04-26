import { Test, TestingModule } from '@nestjs/testing';
import { ProductoImagenesService } from './producto-imagenes.service';

describe('ProductoImagenesService', () => {
  let service: ProductoImagenesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductoImagenesService],
    }).compile();

    service = module.get<ProductoImagenesService>(ProductoImagenesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
