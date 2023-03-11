import express from "express";
import db from "./config/dbConnect.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

db.on("error", console.log.bind(console, 'Erro de conexão'))
db.once("open", () => {
  console.log("conexão com o banco feita com sucesso")
})

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
routes(app);

export default app
