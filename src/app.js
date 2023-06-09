import db from "./config/dbConnect.js";
import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from './middlewares/oAuth.js'
import { initializeData } from "./models/modelSamplesData.js";

db.on("error", console.log.bind(console, 'Erro de conexão'))
db.once("open", () => {
  console.log("conexão com o banco feita com sucesso")
})

await initializeData();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
routes(app);

export default app
