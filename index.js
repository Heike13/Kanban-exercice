import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { doubleCsrf } from 'csrf-csrf';
import { router } from './src/routers/index.js';
import rateLimit from 'express-rate-limit';
import xssMiddleware from './src/middlewares/xssMiddleware.js';

import express from 'express';
const app = express();

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
             
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET, POST, PATCH, DELETE, OPTIONS',
    allowedHeaders:
        'Authorization, Content-Type, X-Customer-Software, X-My-Custom,Accept, Accept-Language',
    credentials: true,
};

const { generateToken, validateRequest, doubleCsrfProtection } = doubleCsrf({
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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message:
        'Trop de requêtes envoyées depuis cette adresse IP, veuillez réessayer après 15 minutes',
    standardHeaders: true, // Returns the default rate limit headers with the response
    legacyHeaders: false, // Desactivate the X-RateLimit headers
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
