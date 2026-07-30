// frontend/hooks/useProducts.js
import { useState, useCallback } from 'react';
import {
  getProducts as fetchProductsAPI,
  getProduct as fetchProductAPI,
  getHomeProducts,
} from '../lib/api';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductsAPI(params);
      const results = data.products || [];
      setProducts(results);

      if (params.featured === true) setFeaturedProducts(results);
      if (params.hotDeal === true) setHotDeals(results);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(err.message || 'Could not load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductAPI(id);
      setProduct(data.product || data);
    } catch (err) {
      console.error(`Failed to fetch product ${id}:`, err);
      setError(`Could not load product details for ID ${id}.`);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHomeProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHomeProducts();
      setFeaturedProducts(data.featured || []);
      setHotDeals(data.hotDeals || []);
      setProducts(data.latest || []);
    } catch (err) {
      console.error('Failed to fetch home products:', err);
      setError(err.message || 'Could not load home products.');
      setFeaturedProducts([]);
      setHotDeals([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    featuredProducts,
    hotDeals,
    product,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    fetchHomeProducts,
    setProduct, // Allow manual setting if needed (e.g., for product detail page updates)
  };
};

export default useProducts;