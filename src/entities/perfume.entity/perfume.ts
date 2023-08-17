import { User } from '../user.entity/user';

export type PerfumeImage = {
  urlOriginal: string;
  url: string;
  mimetype: string;
  size: number;
};

export type Perfume = {
  name: string;
  id: string;
  season: 'winter' | 'spring' | 'summer' | 'autumn';
  topNotes: 'bergamote' | 'ginger' | 'iris';
  baseNotes: 'woodyNotes' | 'aquaticNotes' | 'vanilla';
  lastNotes: 'vetiver' | 'patchouli' | 'sandal';
  owner: User;
  description: string;
  image: PerfumeImage;
};
