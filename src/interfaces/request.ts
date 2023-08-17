import { Request } from 'express';
import { Payload } from '../services/auth';

export interface RequestPlus extends Request {
  info?: Payload;
}
