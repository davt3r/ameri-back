import { Schema, model } from 'mongoose';
import { Perfume } from '../../entities/perfume.entity/perfume.js';

const perfumeSchema = new Schema<Perfume>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  season: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  topNotes: {
    type: String,
    required: true,
  },
  baseNotes: {
    type: String,
    required: true,
  },
  lastNotes: {
    type: String,
    required: true,
  },
  image: {
    type: {
      urlOriginal: { type: String },
      url: { type: String },
      mimetype: { type: String },
      size: { type: Number },
    },
  },
});

perfumeSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const PerfumeModel = model('perfume', perfumeSchema, 'perfumes');
