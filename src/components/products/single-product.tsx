'use client';

import { useGetSingleProductQuery, useDeleteProductMutation, useUpdateProductMutation, type Product } from '@/redux/api/apiSlice';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ProductModal from '@/components/products/product-modal';
import DeleteConfirmModal from '@/components/products/delete-confirm-modal';
import { FaEdit, FaRegEdit } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';

export default function SingleProduct() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: product, isLoading, isError, error } = useGetSingleProductQuery({ slug: slug as string });
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const handleUpdate = async (formData: FormData) => {
    if (!product) return;

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!name || !description) {
      alert('Name and description are required');
      return;
    }

    try {
      await updateProduct({
        id: product.id,
        name,
        description,
      }).unwrap();
      setIsUpdateModalOpen(false);
      router.push(`/products`);
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    
    try {
      await deleteProduct({ id: product.id }).unwrap();
      router.push('/products');
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-chestnut">Error loading product: {error?.toString()}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Action Buttons */}
      <div className="flex justify-end gap-x-3 mb-6">
        <button
          onClick={() => setIsUpdateModalOpen(true)}
          className=" text-hookers-green cursor-pointer"
        >
          <FaRegEdit className='size-6' />
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className=" text-chestnut cursor-pointer"
        >
          <AiOutlineDelete className='size-6' />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-anti-flash-white">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-rich-black">
                No Image
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((image: string, index: number) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-anti-flash-white">
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 2}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-rich-black">{product.name}</h1>
          <p className="text-xl font-bold text-hookers-green">
            ৳ {product.price.toFixed(2)}
          </p>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Details</h2>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {product.category?.name || 'Unknown Category'}
                </dd>
              </div>
              {product.specifications?.map((spec: any) => (
                <div key={spec.name}>
                  <dt className="text-sm font-medium text-gray-500">{spec.name}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <ProductModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdate}
        product={product}
        mode="update"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        productName={product.name}
      />
    </div>
  );
}