import ProtectedRoute from '@/components/auth/protected-route'
import Products from '@/components/products/products'
import React from 'react'

function ProductsPage() {
  return (
    <ProtectedRoute>
      <Products />
    </ProtectedRoute>
  )
}

export default ProductsPage