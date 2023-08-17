import { NextFunction, Request, Response } from 'express';
import { Controller } from './controller.js';
import { Payload } from '../services/auth.js';
import { PerfumeRepo } from '../repository/perfume/perfume.m.repo.js';
import { Perfume } from '../entities/perfume.entity/perfume.js';
import { UserRepo } from '../repository/user/user.m.repo.js';
import { ApiResponse } from '../types/response.api.js';

export class PerfumeController extends Controller<Perfume> {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: PerfumeRepo, private userRepo: UserRepo) {
    super();
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await this.repo.query(req.query);
      const response: ApiResponse = {
        items,
        count: items.length,
      };
      res.status(200);
      res.send(response);
    } catch (error) {
      next(error);
    }
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.body.tokenPayload as Payload;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      req.body.owner = userId;
      const newPerfume = await this.repo.create(req.body);
      this.userRepo.update(user.id, user);
      res.status(201);
      res.send(newPerfume);
    } catch (error) {
      next(error);
    }
  }
}
