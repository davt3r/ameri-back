import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { Repository } from '../repository/repository.js';
import { Perfume } from '../entities/perfume.entity/perfume.js';
import { PerfumeRepo } from '../repository/perfume/perfume.m.repo.js';
import { User } from '../entities/user.entity/user.js';
import { UserRepo } from '../repository/user/user.m.repo.js';
import { PerfumeController } from '../controllers/perfume.controller.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';
import { FileMiddleware } from '../middlewares/files.js';

const debug = createDebug('Quiet:UserRouter');

debug('Executed');
const perfumeRepo: Repository<Perfume> = new PerfumeRepo();
const userRepo: Repository<User> = new UserRepo();
const controller = new PerfumeController(perfumeRepo, userRepo);
export const perfumeRouter = createRouter();
const auth = new AuthInterceptor(userRepo, perfumeRepo);
const fileStore = new FileMiddleware();

perfumeRouter.get('/', controller.getAll.bind(controller));
perfumeRouter.get('/:id', controller.getById.bind(controller));
perfumeRouter.post(
  '/create',
  fileStore.singleFileStore('image').bind(fileStore),
  auth.logged.bind(auth),
  fileStore.optimization.bind(fileStore),
  fileStore.saveImage.bind(fileStore),
  controller.post.bind(controller)
);
perfumeRouter.patch(
  '/edit/:id',
  auth.logged.bind(auth),
  auth.authorized.bind(auth),
  controller.patch.bind(controller)
);
perfumeRouter.delete(
  '/:id',
  auth.logged.bind(auth),
  auth.authorized.bind(auth),
  controller.deleteById.bind(controller)
);
