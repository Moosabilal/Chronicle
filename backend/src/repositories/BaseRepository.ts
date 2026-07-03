import 'reflect-metadata';
import { injectable } from 'inversify';
import { Document, Model } from 'mongoose';
import { IBaseRepository } from '../interfaces/IBaseRepository';

@injectable()
export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(item: Partial<T>): Promise<T> {
    return await this.model.create(item);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: any): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async findAll(filter: any = {}, sort: any = { createdAt: -1 }, skip: number = 0, limit: number = 0): Promise<T[]> {
    return await this.model.find(filter).sort(sort).skip(skip).limit(limit).exec();
  }

  async update(id: string, item: any): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, item, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async count(filter: any = {}): Promise<number> {
    return await this.model.countDocuments(filter).exec();
  }
}
