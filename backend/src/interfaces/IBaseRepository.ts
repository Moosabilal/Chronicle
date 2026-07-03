import { Document } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: any): Promise<T | null>;
  findAll(filter?: any, sort?: any, skip?: number, limit?: number): Promise<T[]>;
  update(id: string, item: any): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: any): Promise<number>;
}
