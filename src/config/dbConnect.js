import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();


const dbUrl = process.env.DB_URL

mongoose.set('strictQuery', true);

mongoose.connect(dbUrl);

let db = mongoose.connection;

export default db;