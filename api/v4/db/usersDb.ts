import client from './';

export type Role = 'user' | 'admin';

export type User = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: Role,
  wishes?: [],
  created_at?: string,
  updated_at?: string,
};

export type UserPatch = {
  firstName?: string,
  lastName?: string,
  email?: string,
  role?: Role,
};

export type CreateUserParams = {
  firstName: string,
  lastName: string,
  email: string,
  password?: string,
};

export type FindUserParams = {
  email: string,
};

export type PaginationParams = {
  limit: number,
  offset: number,
  search?: string,
};

export type CountParams = {
  search?: string,
};

export type WishesParams = {
  userId: string,
  productId: string,
};

export function findUser(params: FindUserParams): Promise<User[]> {
  return client('users')
    .where({ email: params.email })
    .select();
}

export function findUserById(id: string): Promise<User[]> {
  return client('users')
    .where({ id })
    .select();
}

export function findAll({
  limit,
  offset,
  search,
}: PaginationParams): Promise<User[]> {
  return client('users')
    .limit(limit || 10)
    .offset(offset || 0)
    .whereRaw(`LOWER(title) LIKE ?`, [`%${search ? search.toLowerCase(): ''}%`])
    .select();
}

export function createUser(user: CreateUserParams): Promise<User[]> {
  return client('users')
    .insert(user)
    .returning('*');
}

export function removeById(id: number): Promise<User[]> {
  return client('users')
    .where({ id })
    .del();
}

export function updateById(
  id: number,
  patch: UserPatch,
): Promise<User[]> {
  return client('users')
    .where({ id })
    .update(patch)
    .returning('*');
}

export function getUserCount({
  search,
}: CountParams): Promise<User[]> {
  return client('products')
    .whereRaw(`LOWER(title) LIKE ?`, [`%${search ? search.toLowerCase(): ''}%`])
    .count('id')
}

export function addWish(
  userId: string,
  productId: string,
): Promise<User[]> {
  return client('users')
    .where('id', userId)
    .select()
    .then(userRow => {
      let user = userRow;
      if(user[0].wishes === null){
        user[0].wishes = [productId]
      } else {
        user[0].wishes.push(productId)
      }
      return client('users')
        .where('id', userId)
        .select()
        .update('wishes', user[0].wishes);
    })
}

export function removeWish(
  userId: string,
  productId: string,
): Promise<User[]> {
  return client('users')
    .where('id', userId)
    .select()
    .then(userRow => {
      let user = userRow;
      if(user[0].wishes === null){
        return user;
      } else {
        const indexOfProductId = user[0].wishes.indexOf(productId)
        if (indexOfProductId === -1) {
          return user;
        } else {
          user[0].wishes.splice(indexOfProductId, 1);
        }
      }
      return client('users')
        .where('id', userId)
        .select()
        .update('wishes', user[0].wishes);
    })
}

export function getWishes(id: string): Promise<User[]> {
  return client('users')
    .where({ id })
    .select();
}
