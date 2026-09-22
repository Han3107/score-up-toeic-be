import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CategoriesModule } from '../src/categories/categories.module';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../src/roles/roles.guard';
import { RoleEnum } from '../src/roles/roles.enum';
import { getModelToken } from '@nestjs/mongoose';
import { CategorySchemaClass } from '../src/categories/infrastructure/persistence/document/entities/category.schema';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;

  // Mock Mongoose Model
  const mockCategoryModel = {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    save: jest.fn(),
    select: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'test-user', role: { id: RoleEnum.admin } };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideProvider(getModelToken(CategorySchemaClass.name))
      .useValue(mockCategoryModel)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get all categories (GET) - Admin views all', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('meta');
      });
  });

  it('should sync predefined categories (POST) /categories/sync-defaults', () => {
    mockCategoryModel.find.mockResolvedValueOnce([]); // Nothing exists yet
    mockCategoryModel.findOne.mockReturnValueOnce({
      sort: jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          exec: jest.fn().mockResolvedValue({ sequence: 0 }),
        }),
      }),
    }); // Max sequence is 0

    return request(app.getHttpServer())
      .post('/categories/sync-defaults')
      .send({
        categories: [{ name: 'Word Form' }, { name: 'Grammar' }],
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Sync completed successfully');
        expect(res.body.createdCount).toBe(2);
      });
  });

  // More E2E scenarios can be added here matching quickstart.md
});
