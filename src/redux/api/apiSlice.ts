import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  specifications?: Array<{
    name: string;
    value: string;
  }>;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.bitechx.com",
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as RootState).auth.token ||
        localStorage.getItem("jwtToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, { email: string }>({
      query: (body) => ({
        url: "/auth",
        method: "POST",
        body,
      }),
    }),
    getCategories: builder.query<any[], void>({
        query: () => ({
        url: `/categories`,
        method: "GET",
      }),
    }),
    getProducts: builder.query<any[], { offset?: number; limit?: number }>({
      query: ({ offset = 0, limit = 10 }) => ({
        url: `/products?offset=${offset}&limit=${limit}`,
        method: "GET",
      }),
    }),
    searchProductsbyName: builder.query<any[], { name: string }>({
      query: ({ name }) => ({
        url: `/products/search?searchedText=${name}`,
        method: "GET",
      }),
    }),
    getProductsbyCategory: builder.query<any[], { categoryId: string }>({
      query: ({ categoryId }) => ({
        url: `/products?categoryId=${categoryId}`,
        method: "GET",
      }),
    }),
    createProduct: builder.mutation<
      any,
      {
        name: string;
        description: string;
        images: string[];
        price: number;
        categoryId: string;
      }
    >({
      query: (body) => ({
        url: `/products`,
        method: "POST",
        body,
      }),
    }),
    getSingleProduct: builder.query<Product, { slug: string }>({
      query: ({ slug }) => ({
        url: `/products/${slug}`,
        method: "GET",
      }),
    }),
    updateProduct: builder.mutation<
      any,
      {
        id: string;
        name: string;
        description: string;
      }>({
      query: ({ id, name, description }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: { name, description},
      }),
    }),
    deleteProduct: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id, ...rest }) => ({
        url: `/products/${id}`,
        method: "DELETE",
        rest,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useSearchProductsbyNameQuery,
  useGetProductsbyCategoryQuery,
  useCreateProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = apiSlice;
