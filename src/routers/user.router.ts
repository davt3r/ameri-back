import { UserController } from '../controllers/user.controller.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';
import { Repository } from '../repository/repository.js';
import { UserRepo } from '../repository/user/user.m.repo.js';
import { Router as createRouter } from 'express';
import { User } from '../entities/user.entity/user.js';
import { Perfume } from '../entities/perfume.entity/perfume.js';
import { PerfumeRepo } from '../repository/perfume/perfume.m.repo.js';

const repo: Repository<User> = new UserRepo() as Repository<User>;
const repoPerfume: Repository<Perfume> =
  new PerfumeRepo() as Repository<Perfume>;
const controller = new UserController(repo);
const interceptor = new AuthInterceptor(repo, repoPerfume);
export const userRouter = createRouter();

userRouter.get('/', controller.getAll.bind(controller));
userRouter.get('/:id', controller.getById.bind(controller));
userRouter.post('/register', controller.register.bind(controller));
userRouter.patch(
  '/update/:id',
  interceptor.logged.bind(interceptor),
  controller.patch.bind(controller)
);
userRouter.patch('/login', controller.login.bind(controller));
userRouter.post(
  '/addPerfume',
  interceptor.logged.bind(interceptor),
  controller.post.bind(controller)
);
