import { NextFunction, Request, Response } from 'express';
import AuthServices, { Payload } from '../services/auth.js';
import { HttpError } from '../types/http.error.js';
import { LoginResponse } from '../types/response.api.js';
import { Controller } from './controller.js';
import { UserRepo } from '../repository/user/user.m.repo.js';
import { User } from '../entities/user.entity/user.js';

export class UserController extends Controller<User> {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: UserRepo) {
    super();
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const password = await AuthServices.hash(req.body.password);
      req.body.password = password;
      res.status(201);
      res.send(await this.repo.create(req.body));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.user || !req.body.password) {
        throw new HttpError(400, 'Bad request1', 'Invalid User/Password');
      }

      const data = await this.repo.search({
        key: 'userName',
        value: req.body.user,
      });

      if (!data.length) {
        throw new HttpError(400, 'Bad request2', 'Invalid User/Password');
      }

      const isUserValid = await AuthServices.compare(
        req.body.password,
        data[0].password
      );

      if (!isUserValid) {
        throw new HttpError(400, 'Bad request3', 'Invalid User/Password');
      }

      const payload: Payload = {
        id: data[0].id,
        userName: data[0].userName,
      };
      const token = AuthServices.createJWT(payload);
      const response: LoginResponse = {
        token,
        user: data[0],
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  }
}
