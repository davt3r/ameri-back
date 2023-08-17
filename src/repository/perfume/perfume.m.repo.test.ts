import { Perfume, PerfumeImage } from '../../entities/perfume.entity/perfume';
import { User } from '../../entities/user.entity/user';
import { HttpError } from '../../types/http.error';
import { PerfumeModel } from './perfume.m.model';
import { PerfumeRepo } from './perfume.m.repo';

jest.mock('./perfume.m.model');

describe('Given the PerfumeRepo class', () => {
  const repo = new PerfumeRepo();
  describe('When it has been instantiated', () => {
    test('Then the query method should be used', async () => {
      const mockData = [{}];
      const exec = jest.fn().mockResolvedValueOnce(mockData);

      const findMock = jest.fn().mockReturnValueOnce({
        exec,
      });

      PerfumeModel.find = findMock;

      const result = await repo.query();
      expect(findMock).toHaveBeenCalled();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test('Then the queryById method should be used', async () => {
      const mockSample = { id: '1' };
      const exec = jest.fn().mockResolvedValue(mockSample);
      PerfumeModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      const result = await repo.queryById('1');
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockSample);
    });

    test('Then the create method should be used', async () => {
      const mockPerfume = {
        title: 'test',
        description: 'abc',
        image: {} as PerfumeImage,
        owner: {} as User,
      } as unknown as Perfume;

      PerfumeModel.create = jest.fn().mockReturnValueOnce(mockPerfume);
      const result = await repo.create(mockPerfume);
      expect(PerfumeModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockPerfume);
    });

    test('Then the update method should be used', async () => {
      const mockId = '1';
      const mockPerfume = { id: '1', title: 'test' };
      const updatedPerfume = { id: '1', title: 'test2' };
      const exec = jest.fn().mockResolvedValueOnce(updatedPerfume);
      PerfumeModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.update(mockId, mockPerfume);
      expect(PerfumeModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedPerfume);
    });

    test('Then the search method should be used', async () => {
      const mockPerfumes = [{ id: '1', title: 'test' }];

      const exec = jest.fn().mockResolvedValueOnce(mockPerfumes);
      PerfumeModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });
      const result = await repo.search({ key: 'title', value: 'test' });
      expect(PerfumeModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockPerfumes);
    });

    test('Then the delete method should be used', async () => {
      const mockId = '1';
      const exec = jest.fn();
      PerfumeModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await repo.delete(mockId);
      expect(PerfumeModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then the query method should return filtered data when filter is provided', async () => {
      const mockData = [{}];
      const mockFilter = { season: 'summer' };
      const exec = jest.fn().mockResolvedValueOnce(mockData);

      const findMock = jest.fn().mockReturnValueOnce({
        exec,
      });

      PerfumeModel.find = findMock;

      const result = await repo.query(mockFilter);
      expect(findMock).toHaveBeenCalledWith(mockFilter);
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('When it is instantiated and queryById method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const error = new HttpError(
        404,
        'Not found',
        'No user found with this id'
      );
      const mockId = '1';

      const exec = jest.fn().mockResolvedValue(null);

      PerfumeModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          exec,
        }),
      });

      await expect(repo.queryById(mockId)).rejects.toThrowError(error);
      expect(PerfumeModel.findById).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and update method is called but the new user equals to null', () => {
    test('Then it should throw an error', async () => {
      const error = new HttpError(404, 'Not found', 'Invalid id');
      const mockId = '1';
      const mockPerfume = {} as Partial<Perfume>;

      const exec = jest.fn().mockResolvedValue(null);
      PerfumeModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });

      await expect(repo.update(mockId, mockPerfume)).rejects.toThrowError(
        error
      );
      expect(PerfumeModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and delete method is called but the id is not found', () => {
    test('Then it should throw an error', async () => {
      const error = new HttpError(404, 'Not found', 'Invalid id');
      const mockId = '1';
      const exec = jest.fn().mockResolvedValueOnce(null);
      PerfumeModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await expect(repo.delete(mockId)).rejects.toThrowError(error);
      expect(PerfumeModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
