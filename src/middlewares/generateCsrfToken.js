import { doubleCsrf } from 'csrf-csrf';

/**
 * Generate a CSRF token and send it to the client in a cookie
 * @param {Request} req The request object from Express
 * @param {Response} res The response object from Express
 * @returns {string} The CSRF token
 */
export const { generateToken, validateRequest, doubleCsrfProtection } =
    doubleCsrf({
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
