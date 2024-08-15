import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {
    doubleCsrfProtection,
    generateToken,
    validateRequest,
} from './src/middlewares/generateCsrfToken.js';
import { router } from './src/routers/index.js';
import xssMiddleware from './src/middlewares/xssMiddleware.js';
import limiter from './src/middlewares/limiterMiddleware.js';
import corsOptions from './src/middlewares/corsMiddleware.js';

import express from 'express';
const app = express();

//! Load the middlewares by order of priority

app.use(express.static('./dist'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security middlewares
app.use(doubleCsrfProtection);
app.use(limiter);
app.use(xssMiddleware);


// Route to get the CSRF token
app.get('/token', (req, res) => {
    if (!req.headers['x-csrf-token']) {
        const token = generateToken(req, res);
        return res.json(token);
    }
});

// Router
app.use(router, validateRequest);

// Launch the server
app.listen(process.env.PORT, () => {
    console.log(
        `Example app listening on port ${process.env.BASE_URL}:${process.env.PORT}`
    );
});
