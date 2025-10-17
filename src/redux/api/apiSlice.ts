import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.bitechx.com",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token || localStorage.getItem('jwtToken');
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
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
  }),
});

export const { useLoginMutation, useGetProductsQuery, useSearchProductsbyNameQuery } = apiSlice;
