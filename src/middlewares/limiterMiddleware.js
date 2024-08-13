import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message:
        'Trop de requêtes envoyées depuis cette adresse IP, veuillez réessayer après 15 minutes',
    standardHeaders: true, // Returns the default rate limit headers with the response
    legacyHeaders: false, // Desactivate the X-RateLimit headers
});

export default limiter;
