import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from '../src/app.js';
import { Column } from '../src/models/Column.js';
import { createTestUser, getAuthToken, createTestColumn } from './helpers.js';
import './setup.js';

const app = createApp();

describe('Columns API', () => {
  let authToken: string;

  beforeEach(async () => {
    const user = await createTestUser(`columns-${Date.now()}@example.com`);
    authToken = getAuthToken(user);
  });

  describe('GET /api/columns', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app).get('/api/columns').expect(401);

      expect(response.body).toHaveProperty('error', 'No token provided');
    });

    it('should return columns ordered by position with valid response structure', async () => {
      await createTestColumn('Done', 2);
      await createTestColumn('To Do', 0);
      await createTestColumn('In Progress', 1);

      const response = await request(app)
        .get('/api/columns')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Columns retrieved successfully');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toMatchObject({
        name: 'To Do',
        position: 0,
      });
      expect(response.body.data[1]).toMatchObject({
        name: 'In Progress',
        position: 1,
      });
      expect(response.body.data[2]).toMatchObject({
        name: 'Done',
        position: 2,
      });
      expect(response.body.data[0]).toHaveProperty('_id');
      expect(response.body.data[0]).toHaveProperty('createdAt');
      expect(response.body.data[0]).toHaveProperty('updatedAt');
    });
  });

  describe('POST /api/columns', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .post('/api/columns')
        .send({ name: 'Blocked without token' })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'No token provided');
    });

    it('should create a column and persist it in database', async () => {
      const columnsBefore = await Column.countDocuments();

      const response = await request(app)
        .post('/api/columns')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Backlog' })
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Column created successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toMatchObject({
        name: 'Backlog',
        position: 0,
      });
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');

      const columnsAfter = await Column.countDocuments();
      expect(columnsAfter).toBe(columnsBefore + 1);

      const insertedColumn = await Column.findOne({ name: 'Backlog' });
      expect(insertedColumn).not.toBeNull();
      expect(insertedColumn?.position).toBe(0);
    });

    it('should return 400 for invalid payload and not insert in database', async () => {
      const columnsBefore = await Column.countDocuments();

      const response = await request(app)
        .post('/api/columns')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);

      const columnsAfter = await Column.countDocuments();
      expect(columnsAfter).toBe(columnsBefore);
    });
  });
});
