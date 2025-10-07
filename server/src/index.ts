import express, { type Request, type Response, type NextFunction } from "express"
import logger from "./config/logger";
import type { HttpError } from "http-errors";
import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import useragent from "express-useragent";
import cookieParser from "cookie-parser";
import cors from "cors"
import _env from "./config";

const app = express();

app.use(express.json());
app.use(useragent.express());
app.use(cookieParser());
app.use(cors({
    origin: [_env.FRONTEND_URL],  
    credentials: true
}))

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/conversations", chatRoutes);
app.get('/health', (req:Request, res) => {
    
    res.status(200).send({
        success: true,
        data: {
            os: req?.useragent?.os,
            browser: req?.useragent?.browser,
            version: req?.useragent?.version,
            source: req?.useragent?.source,
            platform: req?.useragent?.platform
        }
    });
})



app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        error: [
            {
                type: err.name,
                message: err.message,
                path: "",
                location: "",
            },
        ],
        success: false,
        message: err.message,
    });
});



export default app;

