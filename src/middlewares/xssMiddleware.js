// import xss from 'xss';

// /**
//  * Middleware pour nettoyer les entrées de requêtes.
//  * Utilise la bibliothèque xss pour empêcher les attaques XSS en nettoyant les
//  * données contenues dans req.body, req.query, et req.params.
//  *
//  * @param {Object} req - L'objet de requête Express.
//  * @param {Object} res - L'objet de réponse Express.
//  * @param {Function} next - La fonction next() pour passer au middleware suivant.
//  */

// const xssMiddleware = (req, res, next) => {
//     if (req.body) req.body = JSON.parse(xss(JSON.stringify(req.body)));
//     if (req.query) req.query = JSON.parse(xss(JSON.stringify(req.query)));
//     if (req.params) req.params = JSON.parse(xss(JSON.stringify(req.params)));
//     next();
// };

// export default xssMiddleware;

// xssMiddleware.js
import xss from 'xss';

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
            console.log('Before cleaning:', req.params[key]);
            req.params[key] = xss(req.params[key]);
            console.log('After cleaning:', req.params[key]);
          }
        }
      }

    next();
};

export default xssMiddleware;
