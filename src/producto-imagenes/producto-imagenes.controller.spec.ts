import { Test, TestingModule } from '@nestjs/testing';
import { ProductoImagenesController } from './producto-imagenes.controller';

describe('ProductoImagenesController', () => {
  let controller: ProductoImagenesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoImagenesController],
    }).compile();

    controller = module.get<ProductoImagenesController>(ProductoImagenesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
