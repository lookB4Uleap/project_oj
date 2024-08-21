import express, { Express, NextFunction, Request, Response } from 'express';
import 'dotenv/config'; // remember
import cors from 'cors';
import mongoose from 'mongoose';
import AuthRouter from './routes/authentication';
import cookieParser from 'cookie-parser';

const app: Express = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8000'], // Allow your frontend domain
    credentials: true // Allow sending cookies and credentials
}));
// app.use(cors());

const DATABASE_URL = process.env.DATABASE;

DATABASE_URL && mongoose.connect(
    DATABASE_URL
).then(
    () => console.log(`[server] Database Found`)
).catch(err => console.log(err));

const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log(`[server] Connected to database`));

app.get('/', (req: Request, res: Response) => {
    // console.log(`Request processed at ${process.pid}`);
    res.send('[server] Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`[server] Server is running at http://localhost:${port}`);
});

app.use('/api/users', AuthRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log the error for debugging

    if (Math.floor(res.statusCode/100) === 4)
        res.status(res.statusCode).json({ message: err.message });
    else if(err.name === 'JsonWebTokenError' || err.message === 'Authorization Failed')
        res.status(401).json({message: 'Authorization Failed'});
    else
        res.status(500).json({message: "Internal Server Error"});
});
