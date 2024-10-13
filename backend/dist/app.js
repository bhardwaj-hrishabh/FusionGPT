import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import path from "path"
// const _dirname = path.resolve();
config();
const app = express();
// middlewares
app.use(cors({
    origin: 'https://fusion-gpt.vercel.app', // No trailing slash
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// remove it in production
app.use(morgan("dev"));
app.use("/api/v1", appRouter);
// app.use(express.static(path.join(_dirname, "/frontend/dist")));
// app.get('*', (_,res) => {
// res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
// })
export default app;
//# sourceMappingURL=app.js.map