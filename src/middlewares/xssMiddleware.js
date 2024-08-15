import xss from 'xss';

/**
 * Middleware to clean up request body, query and params from XSS attacks.
 */
const xssMiddleware = (req, res, next) => {
    // Cleanup req.body
    if (req.body) {
        for (const key in req.body) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                req.body[key] = xss(req.body[key]);
            }
        }
    }

    // Cleanup req.query
    if (req.query) {
        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
                req.query[key] = xss(req.query[key]);
            }
        }
    }

    // Cleanup req.params
    if (req.params) {
        for (const key in req.params) {
            if (Object.prototype.hasOwnProperty.call(req.params, key)) {
                req.params[key] = xss(req.params[key]);
            }
        }
    }

    next();
};

export default xssMiddleware;
