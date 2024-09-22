import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { RecipeDto } from 'src/modules/store/dto/order.dto';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListIngredients', () => {
    it('debe devolver una copia de los ingredientes actuales', () => {
      const ingredients = service.getListIngredients();
      expect(ingredients).toEqual({
        tomato: 5,
        lemon: 5,
        potato: 5,
        rice: 5,
        ketchup: 5,
        lettuce: 5,
        onion: 5,
        cheese: 5,
        meat: 5,
        chicken: 5,
      });
    });
  });

  describe('updateListIngredients', () => {
    it('debe actualizar los ingredientes con los valores proporcionados', () => {
      const updatedIngredients: RecipeDto = {
        tomato: 10,
        lemon: 3,
      };

      service.updateListIngredients(updatedIngredients);
      const ingredients = service.getListIngredients();
      expect(ingredients.tomato).toBe(10);
      expect(ingredients.lemon).toBe(3);
      expect(ingredients.potato).toBe(5); // No se actualizó, debe mantener el valor original
    });
  });

  describe('updateIngredients', () => {
    it('debe agregar las cantidades de ingredientes proporcionadas', () => {
      const update: RecipeDto = {
        tomato: 2,
        lemon: 1,
      };

      const updatedIngredients = service.updateIngredients(update);
      expect(updatedIngredients.tomato).toBe(7); // 5 + 2
      expect(updatedIngredients.lemon).toBe(6); // 5 + 1
      expect(updatedIngredients.potato).toBe(5); // Sin cambios
    });
  });

  describe('getVisitMarket', () => {
    it('debe devolver la lista de visitas al mercado', () => {
      const marketVisits = service.getVisitMarket();
      expect(marketVisits).toEqual([]);
    });
  });

  describe('addVisitMarket', () => {
    it('debe agregar una visita al mercado', () => {
      const product = 'tomato';
      const amount = 10;

      service.addVisitMarket(product, amount);
      const marketVisits = service.getVisitMarket();
      expect(marketVisits.length).toBe(1);
      expect(marketVisits[0]).toEqual({
        product: 'tomato',
        amount: 10,
        date: expect.any(Date), // Verifica que sea una fecha
      });
    });

    it('debe agregar múltiples visitas al mercado', () => {
      service.addVisitMarket('tomato', 10);
      service.addVisitMarket('lemon', 5);

      const marketVisits = service.getVisitMarket();
      expect(marketVisits.length).toBe(2);
      expect(marketVisits[0].product).toBe('tomato');
      expect(marketVisits[1].product).toBe('lemon');
    });
  });
});
