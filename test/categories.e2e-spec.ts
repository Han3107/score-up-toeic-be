import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { CategoriesModule } from '../src/categories/categories.module';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../src/roles/roles.guard';
import { RoleEnum } from '../src/roles/roles.enum';
import { getModelToken } from '@nestjs/mongoose';
import { CategorySchemaClass } from '../src/categories/infrastructure/persistence/document/entities/category.schema';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;

  // Mock Mongoose Model properly as a class constructor
  class MockCategoryModel {
    constructor(private data: any) {}
    save = jest.fn().mockResolvedValue({
      ...this.data,
      _id: 'mock-id-12345',
    });

    static find = jest.fn().mockReturnThis();
    static sort = jest.fn().mockReturnThis();
    static skip = jest.fn().mockReturnThis();
    static limit = jest.fn().mockResolvedValue([]);
    static findOne = jest.fn();
    static findOneAndUpdate = jest.fn();
    static deleteOne = jest.fn();
    static select = jest.fn().mockReturnThis();
    static exec = jest.fn();
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: any) => {
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
      .useValue(MockCategoryModel)
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
      .expect((res: any) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('hasNextPage');
      });
  });

  it('should sync predefined categories (POST) /categories/sync-defaults', () => {
    MockCategoryModel.find.mockResolvedValueOnce([]); // Nothing exists yet
    MockCategoryModel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({ sequence: 0 }),
        }),
      }),
    }); // Max sequence is 0

    return request(app.getHttpServer())
      .post('/categories/sync-defaults')
      .send({
        categories: [{ name: 'Word Form' }, { name: 'Grammar' }],
      })
      .expect(201) // 201 is standard for POST in NestJS
      .expect((res: any) => {
        expect(res.body.message).toBe('Sync completed successfully');
        expect(res.body.createdCount).toBe(2);
      });
  });
});
