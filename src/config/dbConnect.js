import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL;

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl);

let db = mongoose.connection;

export default db;