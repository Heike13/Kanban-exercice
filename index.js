import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { doubleCsrf } from 'csrf-csrf';

import express from 'express';
const app = express();

app.use(
    cors({
        origin: [
            'http://localhost',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5174',
        ],
        credentials: true,
    })
);


const {
    invalidCsrfTokenError, 
    generateToken,
    validateRequest,
    doubleCsrfProtection,
} = doubleCsrf({
    getSecret: () => process.env.TOKEN_SECRET,
    cookieName: '__Host-psifi.x-csrf-token', 
    cookieOptions: {
        path: '/',
        httpOnly: true,
    },
    size: 64, 
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getTokenFromRequest: req => req.headers['x-csrf-token'],
});
app.use(cookieParser());

import { router } from './src/routers/index.js';

app.use(express.json());
app.use(express.static('./dist'));

app.get('/token', (req, res) => {
    try {
        if (!req.headers['x-csrf-token']) {
            const token = generateToken(req, res);

            return res.json(token);
        }
    } catch (error) {
        console.log(error);
        console.log(error.message);
    }
});

app.use(router);

app.listen(process.env.PORT, () => {
    console.log(
        `Example app listening on port ${process.env.BASE_URL}:${process.env.PORT}`
    );
});
