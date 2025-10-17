import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.bitechx.com',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, { email: string }>({
      query: (body) => ({
        url: '/auth',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = apiSlice;
