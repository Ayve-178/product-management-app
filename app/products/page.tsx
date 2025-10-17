'use client';

import React, { useState } from 'react';
import { useGetProductsQuery, useSearchProductsbyNameQuery } from '@/redux/api/apiSlice';
import ProductCard from '@/components/products/product-card';

function Products() {
  const [page, setPage] = useState(1);
  const limit = 12;
  const offset = (page - 1) * limit;

  const { data: products, isLoading, isError, error } = useGetProductsQuery({
    offset,
    limit,
  });

  // Search / Add UI state
  const [searchQ, setSearchQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const { data: searchResults = [], isFetching: isSearching } = useSearchProductsbyNameQuery(
    { name: debounced },
    { skip: debounced.length < 1 }
  );

  // debounce input -> update debounced used by search query
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(searchQ.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQ]);

  const totalPages = 12;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

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
        <p className="text-red-500">Error loading products: {error?.toString()}</p>
      </div>
    );
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="mx-auto max-w-[1440px] min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              value={searchQ}
              onChange={(e) => {
                setSearchQ(e.target.value);
                setShowDropdown(true);
              }}
              placeholder="Search products..."
              className="border rounded px-3 py-2 w-64"
            />
          </div>

          <button
            // onClick={() => setIsModalOpen(true)}
            className="bg-rich-black text-anti-flash-white px-3 py-2 rounded"
          >
            Add New Product
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-6">
        {(debounced.length > 0 ? searchResults : products)?.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Styled Pagination Controls */}
      {debounced.length === 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
        {/* Previous Button */}
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
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

        {/* Page Numbers */}
        {pageNumbers.map((pageNum, index) => (
          <React.Fragment key={index}>
            {pageNum === '...' ? (
              <span className="w-10 h-10 flex items-center justify-center text-gray-400">
                ...
              </span>
            ) : (
              <button
                onClick={() => setPage(pageNum as number)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                  page === pageNum
                    ? 'bg-rich-black text-anti-flash-white shadow-md'
                    : 'bg-white text-rich-black shadow cursor-pointer'
                }`}
              >
                {pageNum}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || !products || products.length < limit}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
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