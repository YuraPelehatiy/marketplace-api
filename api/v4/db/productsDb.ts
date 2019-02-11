import client from './';

export type Product = {
  id: string,
  title: string,
  description: string,
  image: string,
  price: number,
  created_at?: string,
  updated_at?: string,
  category?: string,
};

export type ProductPatch = {
  title?: string,
  description?: string,
  image?: string,
  price?: number,
};

export type ProductCountPatch = {
  count?: number,
};

export type PaginationParams = {
  limit: number,
  offset: number,
  search?: string,
  sort?: string,
  order?: string,
};

export type CountParams = {
  search?: string,
};


export function getProducts({
  limit,
  offset,
  search,
  sort,
  order,
}: PaginationParams): Promise<Product[]> {
  return client('products')
    .limit(limit || 10)
    .offset(offset || 0)
    .whereRaw(`LOWER(title) LIKE ?`, [`%${search ? search.toLowerCase(): ''}%`])
    .orderBy(sort || 'created_at', order)
    .select('*');
}

export function getProductsByCategory({
  limit,
  offset,
  search,
}: PaginationParams,
  category: string,
): Promise<Product[]> {
  return client('products')
    .limit(limit || 10)
    .offset(offset || 0)
    .where({ category })
    .andWhereRaw(`LOWER(title) LIKE ?`, [`%${search ? search.toLowerCase(): ''}%`])
    .select('*')
}

export function getProductsByIds(ids: []): Promise<Product[]> {
  return client
    .select('*')
    .from('products')
    .whereIn('id', ids);
}

export function getProductById(id: number): Promise<Product[]> {
  return client('products')
    .where({ id })
    .select();
}

export function removeProductById(id: number): Promise<Product[]> {
  return client('products')
    .where({ id })
    .del();
}

export function updateProductById(
  id: number,
  patch: ProductPatch,
): Promise<Product[]> {
  return client('products')
    .where({ id })
    .update(patch)
    .returning('*');
}

export function createProduct(
  product: ProductPatch,
): Promise<Product[]> {
  return client('products')
    .insert(product)
    .returning('*');
}

export function getProductsCount({
  search,
}: CountParams): Promise<Product[]> {
  return client('products')
    // .where('title', 'like', `%${search || ''}%`)
    .whereRaw(`LOWER(title) LIKE ?`, [`%${search ? search.toLowerCase(): ''}%`])
    .count('id')
}