import db from "./config/dbConnect.js";
import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

db.on("error", console.log.bind(console, 'Erro de conexão'))
db.once("open", () => {
  console.log("conexão com o banco feita com sucesso")
})

const port = process.env.FRONT_PORT;
const corsOptions = {
  origin: `http://localhost:${port}`, // replace with your frontend origin
  credentials: true
}



const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
routes(app);

export default app
