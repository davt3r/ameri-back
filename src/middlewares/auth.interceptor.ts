/* eslint-disable no-useless-constructor */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { Repository } from '../repository/repository.js';
import { Perfume } from '../entities/perfume.entity/perfume.js';
import AuthServices, { Payload } from '../services/auth.js';
import { UserRepo } from '../repository/user/user.m.repo.js';

export class AuthInterceptor {
  constructor(
    // eslint-disable-next-line no-unused-vars
    protected repo: UserRepo,
    // eslint-disable-next-line no-unused-vars
    private perfumeRepo: Repository<Perfume>
  ) {}

  logged(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        throw new HttpError(401, 'Not Authorized', 'Not Authorization header');
      }

      if (!authHeader.startsWith('Bearer')) {
        throw new HttpError(
          401,
          'Not Authorized',
          'Not Bearer in Authorization header'
        );
      }

      const token = authHeader.slice(7);
      const payload = AuthServices.verifyJWT(token);

      req.body.tokenPayload = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  async authorized(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.tokenPayload) {
        throw new HttpError(
          498,
          'Token not found',
          'Token not found in Authorized interceptor'
        );
      }

      const { id: userId } = req.body.tokenPayload as Payload;
      const { id: sightingId } = req.params;

      const sighting = await this.perfumeRepo.queryById(sightingId);

      if (sighting.owner.id !== userId) {
        throw new HttpError(498, 'Token not found', 'Invalid Token');
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
