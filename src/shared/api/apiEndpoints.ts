export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh'
  },
  products: '/admin/products',
  catalog: {
    products: '/catalog/products',
    productById: (id: string) => `/catalog/products/${id}`,
    productBySlug: (slug: string) => `/catalog/products/slug/${slug}`,
    productByIdentifier: (identifier: string) => `/catalog/products/${identifier}`,
    relatedProducts: (identifier: string) => `/catalog/products/${identifier}/related`
  }
} as const;
