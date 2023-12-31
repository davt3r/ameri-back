import { FilterQuery } from 'mongoose';

/* eslint-disable no-unused-vars */
export interface Repository<T extends { id: string | number }> {
  query: (query?: FilterQuery<{ season: string }>) => Promise<T[]>;
  queryById: (id: T['id']) => Promise<T>;
  search: (query: { key: string; value: unknown }) => Promise<T[]>;
  create: (data: Omit<T, 'id'>) => Promise<T>;
  update: (id: T['id'], data: Partial<T>) => Promise<T>;
  delete: (id: T['id']) => Promise<void>;
}
