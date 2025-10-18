import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  slug: string;
  category: any;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  
  // Function to truncate text with character limit
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className='shadow-md rounded-md flex flex-col bg-white h-full'>
      <div className='relative w-full aspect-square overflow-hidden rounded-t-md'>
        {product.images && (<Image 
          src={product.images[0]} 
          alt={product.name} 
          fill
          className='object-cover' 
          unoptimized
        />)}
      </div>
      
      <div className='p-4 flex flex-col flex-1'>
        <h2 className='text-lg font-semibold mb-2'>
          {truncateText(product.name, 20)}
        </h2>
        
        <p className='text-gray-600 mb-2 text-sm flex-grow'>
          {truncateText(product.description, 40)}
        </p>
        
        <div className='flex justify-between items-center mt-auto'>
          <div className='text-rich-black font-bold text-lg'>
            ৳ {product.price.toFixed(2)}
          </div>
          <button 
            className='text-hookers-green underline text-sm font-medium hover:text-lion transition-colors cursor-pointer'
            onClick={() => router.push(`/product/${product.slug}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;