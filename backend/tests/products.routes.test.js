const request = require('supertest');
const express = require('express');

jest.mock('../controllers/productController', () => ({
  getProducts: jest.fn((req, res) => res.status(200).json({ route: 'getProducts' })),
  getHomeFeed: jest.fn((req, res) => res.status(200).json({ route: 'getHomeFeed' })),
  getStats: jest.fn((req, res) => res.status(200).json({ route: 'getStats' })),
  getProductBySlug: jest.fn((req, res) => res.status(200).json({ route: 'getProductBySlug' })),
  getProduct: jest.fn((req, res) => res.status(200).json({ route: 'getProduct' })),
  createProduct: jest.fn((req, res) => res.status(201).json({ route: 'createProduct' })),
  updateProduct: jest.fn((req, res) => res.status(200).json({ route: 'updateProduct' })),
  deleteProduct: jest.fn((req, res) => res.status(200).json({ route: 'deleteProduct' })),
  addReview: jest.fn((req, res) => res.status(201).json({ route: 'addReview' })),
}));

describe('Products route ordering', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use('/api/products', require('../routes/products'));
  });

  test('GET /api/products/homefeed should route to getHomeFeed', async () => {
    const response = await request(app).get('/api/products/homefeed');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ route: 'getHomeFeed' });
  });

  test('GET /api/products/stats should route to getStats', async () => {
    const response = await request(app).get('/api/products/stats');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ route: 'getStats' });
  });

  test('GET /api/products/slug/some-slug should route to getProductBySlug', async () => {
    const response = await request(app).get('/api/products/slug/some-slug');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ route: 'getProductBySlug' });
  });

  test('GET /api/products/12345 should route to getProduct', async () => {
    const response = await request(app).get('/api/products/12345');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ route: 'getProduct' });
  });
});
