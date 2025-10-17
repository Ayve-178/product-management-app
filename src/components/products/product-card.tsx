import Image from 'next/image';
import React from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  // Function to truncate text with character limit
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className='shadow-md rounded-md w-[255px] h-[320px] flex flex-col bg-white'>
      {/* Fixed height image container */}
      <div className='relative w-full h-[200px] overflow-hidden rounded-t-md'>
        <Image 
          src={product.images[0]} 
          alt={product.name} 
          fill
          className='object-cover' 
          unoptimized
        />
      </div>
      
      {/* Content area with fixed structure */}
      <div className='p-4 flex flex-col flex-grow'>
        {/* Product name with max 30 characters */}
        <h2 className='text-lg font-semibold mb-2'>
          {truncateText(product.name, 20)}
        </h2>
        
        {/* Description with max 80 characters */}
        <p className='text-gray-600 mb-2 text-sm flex-grow'>
          {truncateText(product.description, 40)}
        </p>
        
        {/* Price and View Details row */}
        <div className='flex justify-between items-center mt-auto'>
          <div className='text-rich-black font-bold text-lg'>
            ${product.price.toFixed(2)}
          </div>
          <button 
            className='text-hookers-green text-sm font-medium hover:text-lion transition-colors cursor-pointer'
            onClick={() => console.log('View details for:', product.id)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;