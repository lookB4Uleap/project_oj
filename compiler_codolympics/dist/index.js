"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config"); // remember
const cors_1 = __importDefault(require("cors"));
const run_1 = __importDefault(require("./routes/run"));
const submit_1 = __importDefault(require("./routes/submit"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const DATABASE_URL = process.env.DATABASE;
DATABASE_URL && mongoose_1.default.connect(DATABASE_URL).then(() => console.log(`[server] Database Found`)).catch(err => console.log(err));
const db = mongoose_1.default.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log(`[server] Connected to database`));
app.get('/', (req, res) => {
    // console.log(`Request processed at ${process.pid}`);
    res.send('Codolympics Compiler');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
app.use('/api/v1/run', run_1.default);
app.use('/api/v1/submit', submit_1.default);
app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging
    if (Math.floor(res.statusCode / 100) === 4)
        res.status(res.statusCode).json({ message: err.message });
    else if (err.name === 'JsonWebTokenError' || err.message === 'Authorization Failed')
        res.status(401).json({ message: 'Authorization Failed' });
    else
        res.status(500).json({ message: "Internal Server Error", err });
});
