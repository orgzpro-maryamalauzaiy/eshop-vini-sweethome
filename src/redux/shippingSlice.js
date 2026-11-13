import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shippingApi = createApi({
  reducerPath: "shippingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SHIPPING_COST_API}`,
    credentials: "include",
    headers: `key: ${process.env.REACT_APP_SHIPPING_COST_API_KEY}`
  }),
  endpoints: (builder) => ({
    getProvinces: builder.query ({
      query: () => "/destination/provinces",
  }),
    getCities: builder.query({
      query: (province_id) => `/destination/city/${province_id}`
  }),
    getDistrics: builder.query({
      query: (city_id) => `/destination/distric/${city_id}`
  }),
    getServices: builder.query({
      query: (body) => ({
        url: `/calculate/district/domestic-cost`,
        method: 'POST',
        body
      }),
      // query: ({ origin, destination, weight, courier }) =>
    // `/cost/${origin})/${destination}/${weight}/${courier}`,
  })
  })
})

export const { useGetProvincesQuery, useGetCitiesQuery, useGetDistricsQuery, useGetServicesQuery } = shippingApi