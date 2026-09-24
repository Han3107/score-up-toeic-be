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
          if (req.headers.authorization === 'Bearer ADMIN_TOKEN') {
            req.user = { id: 'test-admin', role: { id: RoleEnum.admin } };
            return true;
          }
          return false;
        },
      })
      .overrideGuard(AuthGuard(['jwt', 'anonymous']))
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          if (req.headers.authorization === 'Bearer ADMIN_TOKEN') {
            req.user = { id: 'test-admin', role: { id: RoleEnum.admin } };
          }
          return true; // anonymous always succeeds
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          return req.user?.role?.id === RoleEnum.admin;
        },
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
      .set('Authorization', 'Bearer ADMIN_TOKEN')
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
      .set('Authorization', 'Bearer ADMIN_TOKEN')
      .send({
        categories: [{ name: 'Word Form' }, { name: 'Grammar' }],
      })
      .expect(201) // 201 is standard for POST in NestJS
      .expect((res: any) => {
        expect(res.body.message).toBe('Sync completed successfully');
        expect(res.body.createdCount).toBe(2);
      });
  });

  it('should create a new category (POST) - Admin', () => {
    MockCategoryModel.findOne
      .mockReturnValueOnce({
        sort: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue({ sequence: 5 }),
          }),
        }),
      }) // Max sequence is 5
      .mockResolvedValueOnce(null); // Name doesn't exist

    return request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', 'Bearer ADMIN_TOKEN')
      .send({
        name: 'Listening Test',
        status: 'HIDDEN',
      })
      .expect(201)
      .expect((res: any) => {
        expect(res.body).toHaveProperty('name', 'Listening Test');
      });
  });

  it('should delete a category (DELETE) - Admin', () => {
    MockCategoryModel.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });
    return request(app.getHttpServer())
      .delete('/categories/mock-id-12345')
      .set('Authorization', 'Bearer ADMIN_TOKEN')
      .expect(200);
  });

  it('should get categories (GET) - Public User views only ACTIVE', () => {
    // Note: The actual status filtering logic is tested in unit tests for the service.
    // Here we ensure the endpoint succeeds without a token (anonymous access).
    return request(app.getHttpServer())
      .get('/categories?page=1&limit=5')
      .expect(200)
      .expect((res: any) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('hasNextPage');
      });
  });

  it('should reject unauthorized access (POST) - Public User', () => {
    return request(app.getHttpServer())
      .post('/categories')
      .send({
        name: 'Hacked Category',
      })
      .expect(403);
  });
});
