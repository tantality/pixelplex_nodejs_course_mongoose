/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { app } from './app';
import './configs/mongoose.config';
dotenv.config();

function connectToDb(): mongoose.Connection {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_CONNECTION_URL as string);
  return mongoose.connection;
}

function startServer(): void {
  try {
    app.listen(8080, () => console.log('Listening 8080'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

connectToDb().on('error', console.log).on('disconnected', connectToDb).once('open', startServer);
