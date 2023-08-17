import { NextFunction, Request, Response } from 'express';
import { UserRepo } from '../repository/user/user.m.repo';
import { PerfumeRepo } from '../repository/perfume/perfume.m.repo';
import { PerfumeController } from './perfume.controller';

describe('Given an abstract Controller class', () => {
  describe('When its extended by PerfumeController', () => {
    const mockRepoUser = {} as unknown as UserRepo;
    const mockRepo: PerfumeRepo = {
      query: jest.fn().mockResolvedValue([]),
      queryById: jest.fn().mockResolvedValue({ perfumes: [] }),
      search: jest.fn(),
      create: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as PerfumeRepo;

    const req = {
      params: { id: 1 },
      body: { name: 'sample', id: 1 },
    } as unknown as Request;

    const res = {
      send: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;
    const controller = new PerfumeController(mockRepo, mockRepoUser);

    test('Then method getAll should be used', async () => {
      await controller.getAll(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockRepo.query).toHaveBeenCalled();
    });

    test('Then method getByID should be used', async () => {
      await controller.getById(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockRepo.queryById).toHaveBeenCalled();
    });

    test('Then method patch should be used', async () => {
      await controller.patch(req, res, next);
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.send).toHaveBeenCalled();
      expect(mockRepo.update).toHaveBeenCalled();
    });

    test('Then method deleteById should be used', async () => {
      await controller.deleteById(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockRepo.delete).toHaveBeenCalled();
    });
  });

  describe('When PerfumeController is instantiated', () => {
    const mockUserRepo = {
      queryById: jest.fn(),
      update: jest.fn(),
    } as unknown as UserRepo;

    const mockPerfumeRepo: PerfumeRepo = {
      query: jest.fn().mockResolvedValue([]),
      queryById: jest.fn().mockResolvedValue({ perfumes: [] }),
      search: jest.fn(),
      create: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as PerfumeRepo;

    const req = {
      params: { id: '1' },
      body: { tokenPayload: {} },
    } as unknown as Request;

    const res = {
      send: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;
    const controller = new PerfumeController(mockPerfumeRepo, mockUserRepo);

    test('Then the method post should be called', async () => {
      const userMock = {
        id: '1',
        perfumes: [],
      };
      (mockUserRepo.queryById as jest.Mock).mockResolvedValueOnce(userMock);
      await controller.post(req, res, next);
      expect(res.send).toHaveBeenCalled();
      expect(mockPerfumeRepo.create).toHaveBeenCalled();
    });
  });

  describe('Error handlers', () => {
    const error = new Error('error');
    const mockRepoUser = {} as unknown as UserRepo;
    const mockRepo: PerfumeRepo = {
      query: jest.fn().mockRejectedValue(error),
      queryById: jest.fn().mockRejectedValue(error),
      create: jest.fn().mockRejectedValue(error),
      update: jest.fn().mockRejectedValue(error),
      delete: jest.fn().mockRejectedValue(error),
    } as unknown as PerfumeRepo;

    const req = {
      params: { id: 1 },
      body: { name: 'sample', id: 2 },
    } as unknown as Request;

    const res = {
      send: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;
    const controller = new PerfumeController(mockRepo, mockRepoUser);

    test('getAll should handle errors', async () => {
      await controller.getAll(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('getById should handle errors', async () => {
      await controller.getById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('post should handle errors', async () => {
      await controller.post(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('patch should handle errors', async () => {
      await controller.patch(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('deleteById should handle errors', async () => {
      await controller.deleteById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
