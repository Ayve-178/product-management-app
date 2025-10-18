"use client";

import React, { useState, useOptimistic } from "react";
import {
  useGetProductsQuery,
  useSearchProductsbyNameQuery,
  useCreateProductMutation,
  useGetCategoriesQuery,
  useGetProductsbyCategoryQuery,
} from "@/redux/api/apiSlice";
import ProductCard from "@/components/products/product-card";
import ProductModal from "@/components/products/product-modal";

function Products() {
  const [page, setPage] = useState(1);
  const limit = 12;
  const offset = (page - 1) * limit;

  const [searchQ, setSearchQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [createProduct] = useCreateProductMutation();

  // Fetch categories on page load
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  // Fetch products based on category selection
  const { data: categoryProducts, isLoading: categoryProductsLoading } =
    useGetProductsbyCategoryQuery(
      { categoryId: selectedCategory },
      { skip: !selectedCategory }
    );

  // Fetch all products with pagination (when no category selected)
  const {
    data: allProducts,
    isLoading: allProductsLoading,
    isError,
    error,
  } = useGetProductsQuery({ offset, limit }, { skip: !!selectedCategory });

  // Determine which products to show
  const products = selectedCategory ? categoryProducts : allProducts;

  const [optimisticProducts, addOptimisticProduct] = useOptimistic(
    products || [],
    (state, newProduct: any) => [...state, newProduct]
  );

  const { data: searchResults = []  } =
    useSearchProductsbyNameQuery(
      { name: debounced },
      { skip: debounced.length < 1 }
    );

  // debounce input -> update debounced used by search query
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(searchQ.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQ]);

  async function createProductAction(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const categoryId = formData.get("categoryId") as string;

    if (!name || !price || !categoryId) return;

    const images = Array.from(formData.entries())
      .filter(([key, value]) => key.startsWith("imageUrl") && value)
      .map(([_, value]) => value as string);

    const newProduct = {
      name,
      description,
      images,
      price,
      categoryId,
    };

    try {
      const result = await createProduct(newProduct).unwrap();
      addOptimisticProduct(result);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  }

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset to first page when category changes
    setSearchQ(""); // Clear search when category changes
    setDebounced("");
  };

  const isLoading =
    allProductsLoading || categoryProductsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Error loading products: {error?.toString()}
        </p>
      </div>
    );
  }

  const displayProducts =
    debounced.length > 0 ? searchResults : optimisticProducts;

  // Check if there might be more products (Next button should be enabled)
  const hasMoreProducts = products && products.length === limit;

  return (
    <div className="mx-auto max-w-[1440px] min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <div className="flex items-center gap-3 ">
          {/* Category Dropdown */}
          <div className="relative inline-block">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="border rounded px-3 py-2 bg-white cursor-pointer appearance-none"
            >
              <option value="" disabled>
                All Categories
              </option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-[5px] top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              value={searchQ}
              onChange={(e) => {
                setSearchQ(e.target.value);
              }}
              placeholder="Search products..."
              className="border rounded px-3 py-2 w-64"
            />
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-rich-black text-anti-flash-white px-3 py-2 rounded hover:bg-hookers-green transition-colors"
          >
            Add New Product
          </button>
        </div>
      </div>

      {/* Add Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createProductAction}
      />

      {/* Products Grid */}
      <div className="flex flex-wrap gap-6">
        {displayProducts?.length > 0 ? (
          displayProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>

      {/* Simple Pagination - Only show when no category selected and no search */}
      {!selectedCategory && debounced.length === 0 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          {/* Previous Button */}
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            aria-label="Previous page"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Page Number Buttons - Always show 5 buttons */}
          {(() => {
            let startPage = Math.max(1, page - 2);
            // Ensure we always show 5 pages when possible
            if (page <= 3) {
              startPage = 1;
            }
            
            return [0, 1, 2, 3, 4].map((offset) => {
              const pageNum = startPage + offset;
              
              return (
                <button
                  key={offset}
                  onClick={() => setPage(pageNum)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full font-medium transition-colors ${
                    pageNum === page
                      ? "bg-rich-black text-white"
                      : "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            });
          })()}

          {/* Next Button */}
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasMoreProducts}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            aria-label="Next page"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;