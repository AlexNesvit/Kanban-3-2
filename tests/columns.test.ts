
/* Écrire des tests avec Vitest et Supertest pour :
  * GET /api/columns
  * POST /api/columns
*/

import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import { createApp } from '../src/app.js';
import type { Express } from 'express';

let app: Express;

beforeAll(() => {
app = createApp()
});

describe('Columns API', () => {

it('GET /api/columns should return 401 without token', async () => {
  const res = await request(app).get('/api/columns')

  expect(res.status).toBe(401)
})

it('POST /api/columns should return 401 without token', async () => {
const res = await request(app)
.post('/api/columns')
.send({ name: 'Test Column' })
expect(res.status).toBe(401)
});

});