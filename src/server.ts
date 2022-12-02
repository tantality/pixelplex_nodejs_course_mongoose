/* eslint-disable no-console */
import { DataSource } from 'typeorm';
import { app } from './app';
import { config } from './config';
import { connectToDb } from './utils/db';

let dbConnection: DataSource;
async function init(): Promise<void> {
  try {
    dbConnection = await connectToDb(config.DEV.DB);
    app.listen(config.DEV.PORT, () => console.log(`Listening ${config.DEV.PORT}`));
  } catch (error) {
    console.log(error);
    dbConnection.destroy();
    process.exit(1);
  }
}

init();
