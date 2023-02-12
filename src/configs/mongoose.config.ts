import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
mongoose.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, converted) => {
    delete converted._id;
  },
});
