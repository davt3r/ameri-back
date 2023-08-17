import { FilterQuery } from 'mongoose';
import { Perfume } from '../../entities/perfume.entity/perfume.js';
import { HttpError } from '../../types/http.error.js';
import { Repository } from '../repository.js';
import { PerfumeModel } from './perfume.m.model.js';

export class PerfumeRepo implements Repository<Perfume> {
  async query(filter?: FilterQuery<{ season: string }>): Promise<Perfume[]> {
    if (filter) {
      const filteredData = await PerfumeModel.find(filter).exec();
      return filteredData;
    }

    const allData = await PerfumeModel.find().exec();
    return allData;
  }

  async queryById(id: string): Promise<Perfume> {
    const result = await PerfumeModel.findById(id)
      .populate('owner', { perfumes: 0 })
      .exec();
    if (result === null)
      throw new HttpError(400, 'Not found', 'No user found with this id');
    return result;
  }

  async create(data: Omit<Perfume, 'id'>): Promise<Perfume> {
    const newPerfume = await PerfumeModel.create(data);
    return newPerfume;
  }

  async update(id: string, data: Partial<Perfume>): Promise<Perfume> {
    const newPerfume = await PerfumeModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();

    if (newPerfume === null)
      throw new HttpError(404, 'Not found', 'Invalid id');
    return newPerfume;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Perfume[]> {
    const result = await PerfumeModel.find({ [key]: value }).exec();
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await PerfumeModel.findByIdAndDelete(id).exec();
    if (result === null) throw new HttpError(404, 'Not found', 'Invalid id');
  }
}
