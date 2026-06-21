// frontend/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import { getProducts as fetchProductsAPI, getProduct as fetchProductAPI } from '../lib/api'; // Use your API functions

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
      setProducts(data.products || []); // Assuming API returns { products: [...] }

      // Filter products based on flags if backend doesn't handle it
      if (params.featured === true) setFeaturedProducts(data.products || []);
      if (params.hotDeal === true) setHotDeals(data.products || []);

      // If filtering by featured/hotdeal, set the main products list accordingly
      if (params.featured || params.hotDeal) {
         setProducts(data.products || []);
      }

    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message || 'Could not load products.');
      setProducts([]); // Clear products on error
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
      setProduct(data.product || data); // Assuming API returns { product: ... } or just ...
    } catch (err) {
      console.error(`Failed to fetch product ${id}:`, err);
      setError(`Could not load product details for ID ${id}.`);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch for homepage or shop page - adjust parameters as needed
  useEffect(() => {
    fetchProducts({ limit: 10 }); // Example: fetch first 10 products
    fetchProducts({ featured: true, limit: 5 }); // Fetch featured products
    fetchProducts({ hotDeal: true, limit: 3 }); // Fetch hot deals
  }, [fetchProducts]);

  return {
    products,
    featuredProducts,
    hotDeals,
    product,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    setProduct, // Allow manual setting if needed (e.g., for product detail page updates)
  };
};

export default useProducts;