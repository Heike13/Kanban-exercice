import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { doubleCsrf } from 'csrf-csrf';
import { router } from './src/routers/index.js';
import xssMiddleware from './src/middlewares/xssMiddleware.js';
import limiter from './src/middlewares/limiterMiddleware.js';
import corsOptions from './src/middlewares/corsMiddleware.js';

import express from 'express';
const app = express();

const { generateToken, validateRequest, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.TOKEN_SECRET,
    cookieName: '__Host-psifi.x-csrf-token',
    cookieOptions: {
        sameSite: 'strict',
        path: '/',
        httpOnly: true,
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getTokenFromRequest: req => req.headers['x-csrf-token'],
});

app.use(express.static('./dist'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(doubleCsrfProtection);
app.use(cookieParser());
app.use(limiter);
app.use(xssMiddleware);

//  Route to generate a token CSRF
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

app.use(router, validateRequest);

// Then launch the server
app.listen(process.env.PORT, () => {
    console.log(
        `Example app listening on port ${process.env.BASE_URL}:${process.env.PORT}`
    );
});
