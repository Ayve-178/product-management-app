import ProtectedRoute from '@/components/auth/protected-route'
import SingleProduct from '@/components/products/single-product'
import React from 'react'

function SingleProductPage() {
  return (
    <ProtectedRoute>
      <SingleProduct />
    </ProtectedRoute>
  )
}

export default SingleProductPage