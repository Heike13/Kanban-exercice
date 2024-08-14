import rateLimit from 'express-rate-limit';

/**
 * Middleware to limit the number of requests by IP
 * in a certain time window in milliseconds
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message:
        'Trop de requêtes envoyées depuis cette adresse IP, veuillez réessayer après 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

export default limiter;
