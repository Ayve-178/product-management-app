'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useGetCategoriesQuery } from '@/redux/api/apiSlice';

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image URL is required")
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  product?: any;
  mode?: 'create' | 'update';
}

export default function ProductModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product, 
  mode = 'create' 
}: ProductModalProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  
  // Fetch categories
  const { data: categories = [] } = useGetCategoriesQuery();

  // Populate form when in update mode
  useEffect(() => {
    if (mode === 'update' && product) {
      setImageUrls(product.images?.length > 0 ? product.images : [""]);
    } else {
      setImageUrls([""]);
    }
    // Clear errors when modal opens/closes
    setErrors({});
  }, [mode, product, isOpen]);

  function addImageUrl() {
    setImageUrls(prev => [...prev, ""]);
  }

  function updateImageUrl(index: number, value: string) {
    setImageUrls(prev => prev.map((url, i) => i === index ? value : url));
  }

  function removeImageUrl(index: number) {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  }

  async function handleFormSubmit(formData: FormData) {
    if (!onSubmit) return;
    setErrors({});
    
    try {
      const validationData: ProductFormData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        categoryId: formData.get('categoryId') as string,
        images: imageUrls.filter(url => url.trim() !== "")
      };

      const result = productSchema.safeParse(validationData);

      if (!result.success) {
        const formattedErrors: Record<string, string> = {};
        result.error.issues.forEach(error => {
          const path = error.path[0].toString();
          formattedErrors[path] = error.message;
        });
        setErrors(formattedErrors);
        return;
      }

      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === 'update' ? 'Update Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form
          ref={formRef}
          action={handleFormSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              required
              defaultValue={mode === 'update' ? product?.name : ''}
              className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Product name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              required
              defaultValue={mode === 'update' ? product?.description : ''}
              className={`w-full border rounded px-3 py-2 h-24 ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Product description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={mode === 'update' ? product?.price : ''}
              readOnly={mode === 'update'}
              className={`w-full border rounded px-3 py-2 ${mode === 'update' ? 'bg-gray-100 cursor-not-allowed' : ''} ${errors.price ? 'border-red-500' : ''}`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="categoryId"
              required
              defaultValue={mode === 'update' ? product?.categoryId : ''}
              disabled={mode === 'update'}
              className={`w-full border rounded px-3 py-2 ${mode === 'update' ? 'bg-gray-100 cursor-not-allowed' : ''} ${errors.categoryId ? 'border-red-500' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Image URLs</label>
              {mode === 'create' && (
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add URL
                </button>
              )}
            </div>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  name={`imageUrl${index}`}
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  readOnly={mode === 'update'}
                  className={`flex-1 border rounded px-3 py-2 ${mode === 'update' ? 'bg-gray-100 cursor-not-allowed' : ''} ${errors.images ? 'border-red-500' : ''}`}
                  placeholder="Image URL"
                />
                {mode === 'create' && imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-rich-black text-anti-flash-white rounded hover:bg-opacity-90 disabled:opacity-50"
            >
              {mode === 'update' 
                ? (isSubmitting ? 'Updating...' : 'Update') 
                : (isSubmitting ? 'Creating...' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}